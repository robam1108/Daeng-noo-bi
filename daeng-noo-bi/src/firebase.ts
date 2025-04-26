// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBFl57YmuNE9ALihh8d-MH0SQiMtk3rJto",
    authDomain: "dang-noo-bi.firebaseapp.com",
    projectId: "dang-noo-bi",
    storageBucket: "dang-noo-bi.firebasestorage.app",
    messagingSenderId: "72737362888",
    appId: "1:72737362888:web:895416fd296b523880e6fd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 인증 모듈
export const auth = getAuth(app);

// 데이터베이스 모듈
export const db = getFirestore(app);