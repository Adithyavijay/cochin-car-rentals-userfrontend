// pages/login.tsx
"use client";
import React, { useState,useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Playfair_Display, Montserrat } from "next/font/google";
import Image from "next/image";
import { useMutation} from "@apollo/client";
import { LOGIN_USER } from "@/graphql/mutations";
import toast from "react-hot-toast"; 
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import { useSetRecoilState } from 'recoil';
import { userAtom } from '@/atoms/userAtom';


const playfair = Playfair_Display({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"] });

interface FormData {
    email : string,
    password : string
}

interface LoginResponse {
    loginUser: {
        success: boolean;
        message: string;
        user: {
            id: string;
            name: string;
            email: string;
            profilePicture?: string;
        };
    };
}

interface UserDetails {     
    name : string,
    email : string,
    profilePicture: string 
}

const Login  = () => {
    const [formData, setFormData] = useState<FormData>({
        email: "",
        password: "",
    });
    const setUser = useSetRecoilState(userAtom);
    const router= useRouter();

       // Add useEffect to check for existing user data on component mount
       useEffect(() => {
        // Clear any existing user data when login component mounts
        localStorage.removeItem('userDetails');
        setUser(null);
    }, [setUser]);


    const [loginUser, { loading , error}] = useMutation<LoginResponse>(LOGIN_USER , {
        onCompleted : (data) =>{
            if(data.loginUser.success){ 
                localStorage.clear();
                console.log('login successfull');
                toast.success("Login successfull");
                router.push('/');
                const userDetails: UserDetails = {
                    name: data.loginUser.user.name,
                    email: data.loginUser.user.email,
                    profilePicture: data.loginUser.user.profilePicture || ''
                };
                setUser(userDetails);
            }
        }  ,
        onError : (error)=>{
           toast.error(error.message)
            console.error("some error occured : ",error)
        }
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async(e:React.FormEvent )=>{
        e.preventDefault();
        try{
            await loginUser({
                variables : { 
                    email : formData.email ,
                    password : formData.password
                }
            })
        }catch(err){
                console.log('form submission error : ',err)
        }
    }

    return (
        <div className="min-h-screen bg-[#121212] flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="absolute inset-0 z-0 hidden sm:block">
                <Image
                    src="/images/car.png"
                    alt="Luxury Car Background"
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black/90"></div>
            </div>

            <div className="max-w-md w-full space-y-8 z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2
                        className={`mt-6 text-center text-4xl font-extrabold text-white ${playfair.className}`}
                    >
                        Welcome to{" "}
                        <span className="text-red-600">DreamDrive</span>
                    </h2>
                    <p
                        className={`mt-2 text-center text-sm text-gray-300 ${montserrat.className}`}
                    >
                        Your journey begins here
                    </p>
                </motion.div>

                <motion.div
                    className="mt-8 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg py-8 px-4 shadow sm:rounded-lg sm:px-10"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {Object.keys(formData).map((key) => (
                            <div key={key}>
                                <label
                                    htmlFor={key}
                                    className={`block text-sm font-medium text-gray-200 ${montserrat.className}`}
                                >
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                </label>
                                <div className="mt-1">
                                <input
                                        id={key}
                                        name={key}
                                        type={key === "password" ? "password" : "email"}
                                        required
                                        disabled={loading}
                                        className={`appearance-none block w-full px-3 py-2 border border-gray-300 
                                            rounded-md shadow-sm placeholder-gray-400 
                                            focus:outline-none focus:ring-red-500 focus:border-red-500 
                                            sm:text-sm ${montserrat.className} 
                                            bg-white bg-opacity-20 text-white
                                            ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        ))}
                        <div>
                        <motion.button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex justify-center py-2 px-4 
                                    border border-transparent rounded-md shadow-sm 
                                    text-sm font-medium text-white 
                                    ${loading ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'} 
                                    focus:outline-none focus:ring-2 focus:ring-offset-2 
                                    focus:ring-red-500 ${montserrat.className}
                                    relative`}
                                whileHover={!loading ? { scale: 1.05 } : {}}
                                whileTap={!loading ? { scale: 0.95 } : {}}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <ClipLoader
                                            color="#ffffff"
                                            size={20}
                                            className="mr-2"
                                        />
                                        <span>Logging in...</span>
                                    </div>
                                ) : (
                                    'Log in'
                                )}
                            </motion.button>
                        </div>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-400 text-sm text-center"
                            >
                                {error.message}
                            </motion.div>
                        )}
                    </form>

                    <div className="mt-6">
                        <div className="relative flex justify-center text-sm">
                            <span
                                className={`px-2 bg-white bg-opacity-10 text-gray-200 ${montserrat.className}`}
                            >
                                Don`t have an account?
                            </span>
                        </div>

                        <div className="mt-6">
                            <Link
                                href="/register"
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-gray-50 ${montserrat.className}`}
                            >
                                <motion.span
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Register
                                </motion.span>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
