// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDPzAAVaLE0QcAZ8biyFF6ahxI8nu3lMuk",
  authDomain: "entebuddy-1f191.firebaseapp.com",
  projectId: "entebuddy-1f191",
  storageBucket: "entebuddy-1f191.appspot.com",
  messagingSenderId: "29717603090",
  appId: "1:29717603090:web:7c273c5584c31f00c749cb",
  measurementId: "G-2438W6Q2MX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);