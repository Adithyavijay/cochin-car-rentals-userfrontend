import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USER_DETAILS } from '@/graphql/queries';
import { UPDATE_USER_DETAILS } from '@/graphql/mutations';
import { Poppins } from 'next/font/google';
import EditableField from '../components/EditableUserProfile';
import toast from 'react-hot-toast';
import { useSendOTP, useVerifyOTP } from '../services/services';
import ProfilePictureUploader from '../components/ProfilePictureUploader';
const poppins = Poppins({ weight: ['400', '600'], subsets: ['latin'] });
import { useRecoilState } from 'recoil';
import { userAtom } from '@/atoms/userAtom';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}
interface User {
  name : string;
  email : string;
}


const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { loading, error, data } = useQuery(GET_USER_DETAILS);
  const [updateUserDetails] = useMutation(UPDATE_USER_DETAILS);
  const { sendOTP, loading: sendingOTP } = useSendOTP();
  const { verifyOTP, loading: verifyingOTP } = useVerifyOTP();
  const [userDetails, setUserDetails] = useState(data?.getUserDetails || {});
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [sessionInfo, setSessionInfo] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useRecoilState<User >(userAtom); 

 

  useEffect(() => {
    if (data?.getUserDetails) {
      setUserDetails(data.getUserDetails);
    }
  }, [data]); 

  console.log(userDetails)


  const handleSave = async (field: string, newValue: string) => {
    if (field === 'phone' && newValue !== data?.getUserDetails.phone) {
      try {
        const response = await sendOTP(newValue);
        setSessionInfo(response.Details);
        setOtpSent(true);
        toast.success("OTP sent successfully");
      } catch (err) {
        console.error('Error sending OTP:', err);
        toast.error("Failed to send OTP");
      }
    } else {
      try {
        console.log(field, newValue)
        await updateUserDetails({ variables: { input: { [field]: newValue } } });
        setUserDetails((prev) => ({ ...prev, [field]: newValue }));

          setUser(prevUser => ({ ...prevUser, [field]: newValue }));
        
        toast.success(`${field} updated successfully`);
      } catch (err) {
        console.error('Error updating user details', err);
        toast.error(`Failed to update ${field}`);
      }
    }
  };



  const handleVerifyOTP = async () => {
    try {
      const result = await verifyOTP(sessionInfo, otp);
      if (result) {
        await updateUserDetails({ variables: { phone: userDetails.phone } });
        setOtpSent(false);
        setOtp('');
        toast.success("Phone number updated successfully");
      } else {
        toast.error("Invalid OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Failed to verify OTP");
    }
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed ${poppins.className} inset-0 h-screen bg-black bg-opacity-75 flex items-center justify-center z-50 px-4`}
          onClick={onClose}
        >
          <div className={`absolute inset-0 bg-black ${isEditing ? 'bg-opacity-75 backdrop-filter backdrop-blur-sm' : 'bg-opacity-50'}`} onClick={onClose}></div>
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-8 max-w-md w-full border border-gray-700 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
               {loading && (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
              </div>
            )}
            {error && (
              <div className="text-red-500 text-center py-8">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>Error: {error.message}</p>
              </div>
            )}
            {userDetails && (
              <>
                <div className="relative mb-8">
                  <ProfilePictureUploader
                    currentPicture={userDetails.profilePicture}
                    name={userDetails.name}
                  />
                  <h2 className="text-2xl font-bold mt-4 text-center text-white">{userDetails.name}</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <EditableField
                    label="Name"
                    value={userDetails.name}
                    field="name"
                    onSave={handleSave}
                    maxLength={50}
                  />
                  <EditableField
                    label="Email"
                    value={userDetails.email}
                    field="email"
                    onSave={handleSave}
                    maxLength={100}
                  />
                  <EditableField
                    label="Phone"
                    value={userDetails.phone}
                    field="phone"
                    onSave={handleSave}
                    maxLength={15}
                  />
                  <EditableField
                    label="Pincode"
                    value={userDetails.pincode}
                    field="pincode"
                    onSave={handleSave}
                    maxLength={10}
                  />
                  <EditableField
                    label="City"
                    value={userDetails.city}
                    field="city"
                    onSave={handleSave}
                    maxLength={50}
                  />
                  <EditableField
                    label="State"
                    value={userDetails.state}
                    field="state"
                    onSave={handleSave}
                    maxLength={50}
                  />
                  <EditableField
                    label="Country"
                    value={userDetails.country}
                    field="country"
                    onSave={handleSave}
                    maxLength={50}
                  />
                </div>
                {otpSent && (
                  <div className="mt-4">
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP"
                      className="bg-gray-700 text-white p-2 rounded w-full"
                    />
                    <button
                      onClick={handleVerifyOTP}
                      disabled={verifyingOTP}
                      className="mt-2 w-full bg-red-600 text-white px-4 py-2 rounded"
                    >
                      {verifyingOTP ? 'Verifying...' : 'Verify OTP'}
                    </button>
                  </div>
                )}
              </>
            )}
            <button
              className="mt-8 w-full bg-gradient-to-r from-red-700 to-red-900 text-white px-4 py-3 rounded-lg hover:from-red-800 hover:to-red-950 transition duration-300 ease-in-out shadow-md text-lg font-semibold"
              onClick={onClose}
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserProfileModal;