import { useMutation } from '@apollo/client';
import { SEND_OTP, VERIFY_OTP } from '@/graphql/mutations';

export const useSendOTP = () => {
  const [sendOTPMutation, { loading, error }] = useMutation(SEND_OTP);

  const sendOTP = async (phoneNumber : string) => { 
    console.log(phoneNumber)
    try {
      const { data } = await sendOTPMutation({ variables: { phoneNumber } });
      return data.sendOTP; // This will be the sessionInfo
    } catch (err) {
      console.error('Error sending OTP:', err);
      throw err;
    }
  };

  return { sendOTP, loading, error };   
};

export const useVerifyOTP = () => {
  const [verifyOTPMutation, { loading, error }] = useMutation(VERIFY_OTP);

  const verifyOTP = async (sessionInfo : string, otp : string) => {
    try {
      const { data } = await verifyOTPMutation({ variables: { sessionInfo, otp } });
      return data.verifyOTP; // This will be a boolean indicating success or failure
    } catch (err) {
      console.error('Error verifying OTP:', err);
      throw err;
    }
  };

  return { verifyOTP, loading, error };
};