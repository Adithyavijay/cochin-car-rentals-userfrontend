import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaLock, FaChevronRight, FaCheckCircle, FaSync } from "react-icons/fa";
import { useVerifyOTP } from "../services/services";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";

interface OTPVerificationProps {
    phoneNumber: string;
    otpStatus: boolean;
    sessionInfo: string;
    onVerificationSuccess: () => void;
    nextSlide: () => void;
    onResendOTP: () => void // Updated to return the new session info
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
    phoneNumber,
    otpStatus,
    sessionInfo,
    onVerificationSuccess,
    nextSlide,
    onResendOTP,
}) => {
    const [otp, setOtp] = useState("");
    const [resending, setResending] = useState(false);
    const [currentSessionInfo, setCurrentSessionInfo] = useState(sessionInfo);
    const {
        verifyOTP,
        loading: verifyingOTP,
        error: verifyError,
    } = useVerifyOTP();

    const handleVerify = async () => {
        if (otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
            return;
        }

        try {
            const isValid = await verifyOTP(currentSessionInfo, otp);
            if (isValid) {
                toast.success("OTP verified successfully");
                onVerificationSuccess();
            } else {
                toast.error("OTP verification failed");
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            toast.error("An error occurred during verification");
        }
    };

    const handleResendOTP = async () => {
        setResending(true);
        try {
            const newSessionInfo = await onResendOTP();
            setCurrentSessionInfo(newSessionInfo);
        } catch (error) {
            console.error("Error resending OTP:", error);
            toast.error("Failed to resend OTP");
        } finally {
            setResending(false);
        }
    };

    if (otpStatus) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
            >
                <FaCheckCircle className="text-green-500 text-5xl mb-4 mx-auto" />
                <h3 className="text-2xl font-bold text-white mb-4">
                    Phone Verified Successfully
                </h3>
                <p className="text-sm text-gray-300 mb-6">
                    Your phone number {phoneNumber} has been verified.
                </p>
                <motion.button
                    onClick={() => nextSlide()}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-300 flex items-center mx-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Continue
                    <FaChevronRight className="ml-2" />
                </motion.button>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                <FaLock className="mr-2" />
                Verify Your Phone Number
            </h3>
            <p className="text-sm text-gray-300 mb-6">
                We`ve sent an OTP to {phoneNumber}. Please enter it below.
            </p>
            <div className="mb-6">
                <label
                    htmlFor="otp"
                    className="block text-sm font-medium text-gray-200 mb-2"
                >
                    Enter OTP
                </label>
                <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="Enter 6-digit OTP"
                    className="w-full px-3 py-2 bg-white bg-opacity-20 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 text-white transition-all duration-300 ease-in-out"
                    maxLength={6}
                />
            </div>
            <div className="flex justify-between items-center">
                <motion.button
                    onClick={handleResendOTP}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-300 flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={resending}
                >
                    {resending ? (
                        <ClipLoader
                            color="#ffffff"
                            size={20}
                            className="mr-2"
                        />
                    ) : (
                        <FaSync className="mr-2" />
                    )}
                    {resending ? "Resending..." : "Resend OTP"}
                </motion.button>
                <motion.button
                    onClick={handleVerify}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300 flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={verifyingOTP}
                >
                    {verifyingOTP ? (
                        <ClipLoader
                            color="#ffffff"
                            size={20}
                            className="mr-2"
                        />
                    ) : null}
                    {verifyingOTP ? "Verifying..." : "Verify OTP"}
                    {!verifyingOTP && <FaChevronRight className="ml-2" />}
                </motion.button>
            </div>
        </motion.div>
    );
};

export default OTPVerification;
