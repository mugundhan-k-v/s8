// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDvP_0m5FvPLpSJNghUqkCPI8RUwybnAQs",
    authDomain: "offline-db-42.firebaseapp.com",
    projectId: "offline-db-42",
    storageBucket: "offline-db-42.firebasestorage.app",
    messagingSenderId: "1075205980651",
    appId: "1:1075205980651:web:00f228f7480c41066599ae",
    measurementId: "G-JRT78DFFTH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Uncomment the line below if you want to use analytics
// export const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
