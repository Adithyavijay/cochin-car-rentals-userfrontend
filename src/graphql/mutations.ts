import { gql } from "@apollo/client";

export const REGISTER_USER = gql`
mutation RegisterUser($input : RegisterUserInput!){
    registerUser(input: $input){
    id
    name
    email
    phone
    city
    state
    country
    pincode
    profilePicture
    } 
}
`;
export const SEND_OTP = gql`
  mutation SendOTP($phoneNumber: String!) {
    sendOTP(phoneNumber: $phoneNumber) {
      Status
      Details
      OTP
    }
  }
`;

export const VERIFY_OTP = gql`
  mutation VerifyOTP($sessionInfo: String!, $otp: String!) {
    verifyOTP(sessionInfo: $sessionInfo, otp: $otp)
  }
`;

export const UPDATE_USER_DETAILS = gql`
mutation UpdateUserDetails($input : UpdateUserDetailsInput){
  updateUserDetails(input : $input ){
      id
      name
      email
      phone
      city
      state
      country
      pincode
      profilePicture
  
  }
}`;

export const CHECK_PHONE_NUMBER = gql`
  mutation CheckPhoneNumber($phone: String!) {
    checkPhoneNumber(phone: $phone) {
      isAvailable
    }
  }
`;

export const UPLOAD_PROFILE_IMAGE = gql`
  mutation UploadProfilePicture($file: Upload!) {
    uploadProfilePicture(file: $file) {
      id
      name
      email
      phone
      city
      state
      country
      pincode
      profilePicture
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
    changePassword(currentPassword: $currentPassword, newPassword: $newPassword) {
      success
      message
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      success
      message
      user {
        id
        name
        email
        profilePicture
      }
    }
  }
`;

export const LOGOUT_USER = gql`
  mutation LogoutUser {
    logoutUser {
      success
      message
    }
  }
`;