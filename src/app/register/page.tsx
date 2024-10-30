// pages/register.tsx
"use client";
import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Playfair_Display, Montserrat } from "next/font/google";
import Image from "next/image";
import { REGISTER_USER } from "@/graphql/mutations";
import { useSendOTP } from "@/modules/user-registration/services/services";
import { useMutation } from "@apollo/client";
import OTPVerification from "@/modules/user-registration/components/OtpVerification";
import ProfilePictureUpload from "@/modules/user-registration/components/ProfileUpdation";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSetRecoilState } from 'recoil';
import { userAtom } from '@/atoms/userAtom';

import {
    FaUser,
    FaEnvelope,
    FaMapMarkerAlt,
    FaLock,
    FaChevronLeft,
    FaChevronRight,
    FaExclamationCircle,
} from "react-icons/fa";

interface FormValues {
    name: string;
    email: string;
    phone: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    password: string;
    confirmPassword: string;
    profilePicture: File | null;
}

const playfair = Playfair_Display({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"] });

const formSections = [
    { title: "Personal Information", icon: FaUser, fields: ["name", "profilePicture"] },
    { title: "Contact Details", icon: FaEnvelope, fields: ["email", "phone"] },
    { title: "OTP Verification", icon: FaLock, fields: [] },
    { title: "Address", icon: FaMapMarkerAlt, fields: ["city", "state", "country", "pincode"] },
    { title: "Security", icon: FaLock, fields: ["password", "confirmPassword"] },
];

const inputStyles = `mt-1 block w-full px-3 py-2 bg-white bg-opacity-20 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${montserrat.className} text-white transition-all duration-300 ease-in-out`;
const buttonStyles = `px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ease-in-out ${montserrat.className}`;

const ErrorMessage = ({ message }: { message: string | undefined }) => (
    <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="flex items-center text-red-500 text-xs mt-1"
    >
        <FaExclamationCircle className="mr-1" />
        <span>{message}</span>
    </motion.div>
);

const Register = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [values, setValues] = useState<FormValues>({
        name: "",
        email: "",
        phone: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
        password: "",
        confirmPassword: "",
        profilePicture: null,
    });
    const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
    const [touchedFields, setTouchedFields] = useState<Set<keyof FormValues>>(new Set());
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);
    const [sessionInfo, setSessionInfo] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const [registerUser] = useMutation(REGISTER_USER);
    const { sendOTP } = useSendOTP();
    const setUser= useSetRecoilState(userAtom)

    const validateField = useCallback((field: keyof FormValues, value: string | File | null): string | undefined => {
        switch (field) {
            case "name":
                return !value ? "Name is required" : undefined;
            case "email":
                return !value ? "Email is required" : !/\S+@\S+\.\S+/.test(value as string) ? "Email is invalid" : undefined;
            case "phone":
                return !value ? "Phone is required" : !/^\d{10}$/.test(value as string) ? "Phone number must be 10 digits" : undefined;
            case "city":
            case "state":
            case "country":
                return !value ? `${field.charAt(0).toUpperCase() + field.slice(1)} is required` : undefined;
            case "pincode":
                return !value ? "Pincode is required" : !/^\d{6}$/.test(value as string) ? "Pincode must be 6 digits" : undefined;
            case "password":
                return !value ? "Password is required" : (value as string).length < 8 ? "Password must be at least 8 characters" : undefined;
            case "confirmPassword":
                return !value ? "Confirm Password is required" : value !== values.password ? "Passwords do not match" : undefined;
            case "profilePicture":
                return !value ? "Profile picture is required" : undefined;
            default:
                return undefined;
        }
    }, [values.password]);

    const validateForm = useCallback((fieldsToValidate: Array<keyof FormValues>) => {
        const newErrors: Partial<Record<keyof FormValues, string>> = {};
        fieldsToValidate.forEach((field) => {
            const error = validateField(field, values[field]);
            if (error) {
                newErrors[field] = error;
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [values, validateField]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: value }));
        setTouchedFields(prev => new Set(prev).add(name as keyof FormValues));

        // Clear the error for this field as the user is typing
        setErrors(prev => ({ ...prev, [name]: undefined }));
    }, []);

    const validateFieldOnBlur = useCallback((field: keyof FormValues) => {
        const error = validateField(field, values[field]);
        setErrors(prev => ({ ...prev, [field]: error }));
    }, [values, validateField]);

    const handleFileChange = useCallback((name: keyof FormValues, file: File | null) => {
        setValues(prev => ({ ...prev, [name]: file }));
        setTouchedFields(prev => new Set(prev).add(name));
    }, []);

    const handleNext = useCallback(() => {
        const currentFields = formSections[currentStep].fields as Array<keyof FormValues>;
        if (validateForm(currentFields)) {
            if (currentStep === 1 && !isPhoneVerified) {
                handleSendOTP();
            } else {
                setCurrentStep(prev => prev + 1);
            }
        }
    }, [currentStep, validateForm, isPhoneVerified]);

    const handleSendOTP = async () => {
        try {
            const response = await sendOTP(values.phone);
            setSessionInfo(response.Details);
            toast.success("OTP sent successfully");
            setCurrentStep(prev => prev + 1);
        } catch (err) {
            console.error("Error sending OTP:", err);
            toast.error("Failed to send OTP");
        }
    };

    const handlePhoneVerificationSuccess = useCallback(() => {
        setIsPhoneVerified(true);
        setCurrentStep(prev => prev + 1);
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateForm(Object.keys(values) as Array<keyof FormValues>)) {
            setIsSubmitting(true);
            try {
                const { data } = await registerUser({
                    variables: {
                        input: {
                            name: values.name,
                            email: values.email,
                            phone: values.phone,
                            city: values.city,
                            state: values.state,
                            country: values.country,
                            pincode: values.pincode,
                            password: values.password,
                            profilePicture: values.profilePicture,
                        },
                    },
                });

                const userDetails= {
                    name : data.registerUser.name,
                    email : data.registerUser.email,
                    profilePicture: data.registerUser.profilePicture
                } 
                setUser(userDetails)
                localStorage.setItem('userDetails',JSON.stringify(userDetails))
                toast.success("Registration successful!");
                router.push('/')
                // Handle successful registration (e.g., redirect  to login)
            } catch (err) {
                console.error("Registration error:", err);
                toast.error("Registration failed. Please try again.");
            } finally {
                setIsSubmitting(false);

            }
        }
    };

    const progressPercentage = ((currentStep + 1) / formSections.length) * 100;
    return (
        <div className=" min-h-screen   bg-black flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="absolute inset-0 z-0 ">
                <Image
                    src="/images/car.png"
                    alt="Luxury Car Background"
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black/90"></div>
            </div>

            <div className="max-w-md w-full space-y-8 z-10 ">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2
                        className={`mt-6 text-center text-4xl font-extrabold text-white ${playfair.className}`}
                    >
                        Join <span className="text-red-600">DreamDrive</span>
                    </h2>
                    <p
                        className={`mt-2 text-center text-sm text-gray-300 ${montserrat.className}`}
                    >
                        Experience luxury on wheels
                    </p>
                </motion.div>

                <motion.div
                    className="mt-8 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg py-8 px-4 shadow sm:rounded-lg sm:px-10"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="mb-6">
                        <div className="relative pt-1">
                            <div className="flex mb-2 items-center justify-between">
                                <div>
                                    <span
                                        className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600 bg-red-200 ${montserrat.className}`}
                                    >
                                        Step {currentStep + 1} of{" "}
                                        {formSections.length}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span
                                        className={`text-xs font-semibold inline-block text-red-600 ${montserrat.className}`}
                                    >
                                        {progressPercentage.toFixed(0)}%
                                    </span>
                                </div>
                            </div>
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-red-200">
                                <motion.div
                                    style={{ width: `${progressPercentage}%` }}
                                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-600"
                                    initial={{ width: 0 }}
                                    animate={{
                                        width: `${progressPercentage}%`,
                                    }}
                                    transition={{ duration: 0.5 }}
                                ></motion.div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.3 }}
                            >
                                {currentStep === 2 ? (
                                    <OTPVerification
                                        otpStatus={isPhoneVerified}
                                        phoneNumber={values.phone}
                                        sessionInfo={sessionInfo}
                                        onVerificationSuccess={handlePhoneVerificationSuccess}
                                        nextSlide={() => setCurrentStep(prev => prev + 1)}
                                        onResendOTP={handleSendOTP}
                                    />
                                ) : (
                                    <>
                                        <h3 className={`text-lg font-medium text-white mb-4 flex items-center ${playfair.className}`}>
                                            {React.createElement(formSections[currentStep].icon, { className: "mr-2" })}
                                            {formSections[currentStep].title}
                                        </h3>
                                        {formSections[currentStep].fields.map((field) => (
                                            <div key={field} className="mb-4">
                                                {field === "profilePicture" ? (
                                                    <ProfilePictureUpload
                                                        value={values.profilePicture}
                                                        onChange={(file) => handleFileChange("profilePicture", file)}
                                                        error={errors.profilePicture}
                                                    />
                                                ) : (
                                                    <>
                                                        <label htmlFor={field} className={`block text-sm font-medium text-gray-200 ${montserrat.className}`}>
                                                            {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1").trim()}
                                                        </label>
                                                        <input
                                                            type={field.includes("password") ? "password" : field === "email" ? "email" : "text"}
                                                            name={field}
                                                            id={field}
                                                            value={values[field as keyof FormValues] as string}
                                                            onChange={handleChange}
                                                            className={inputStyles}
                                                            onBlur={() => validateFieldOnBlur(field as keyof FormValues)}
                                                            required
                                                        />
                                                        <AnimatePresence>
                                                            {touchedFields.has(field as keyof FormValues) && errors[field as keyof FormValues] && (
                                                                <ErrorMessage key={`error-${field}`} message={errors[field as keyof FormValues]} />
                                                            )}
                                                        </AnimatePresence>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        <div className="flex justify-between mt-6">
                            {currentStep > 0 && (
                                <motion.button
                                    type="button"
                                    onClick={() => setCurrentStep(prev => prev - 1)}
                                    className={`${buttonStyles} bg-gray-600 hover:bg-gray-700 focus:ring-gray-500`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FaChevronLeft className="inline mr-2" />
                                    Back
                                </motion.button>
                            )}
                            <motion.button
                                type={currentStep === formSections.length - 1 ? "submit" : "button"}
                                onClick={currentStep < formSections.length - 1 ? handleNext : undefined}
                                className={`${buttonStyles} ${currentStep === 2 && !isPhoneVerified
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-red-600 hover:bg-red-700"
                                    } focus:ring-red-500 ml-auto transition-colors duration-300`}
                                whileHover={currentStep !== 2 || isPhoneVerified ? { scale: 1.05 } : {}}
                                whileTap={currentStep !== 2 || isPhoneVerified ? { scale: 0.95 } : {}}
                                disabled={currentStep === 2 && !isPhoneVerified}
                            >
                                {currentStep === formSections.length - 1
                                    ? isSubmitting ? "Registering..." : "Register"
                                    : "Next"}
                                {currentStep < formSections.length - 1 && <FaChevronRight className="inline ml-2" />}
                            </motion.button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <Link href="/login">
                            <span
                                className={`text-sm text-gray-300 hover:text-white transition-colors duration-300 ${montserrat.className}`}
                            >
                                Already have an account? Log in
                            </span>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
