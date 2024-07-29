/*
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDmWPwwrCQnMNKMsFHFvWJImSsqTiJrsP8",
    authDomain: "ex03-1cda9.firebaseapp.com",
    projectId: "ex03-1cda9",
    storageBucket: "ex03-1cda9.appspot.com",
    messagingSenderId: "197987103495",
    appId: "1:197987103495:web:5d6aadf1ed302adf5e0ba2",
    measurementId: "G-6DQ8ER8EK3"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
*/
// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDmWPwwrCQnMNKMsFHFvWJImSsqTiJrsP8",
    authDomain: "ex03-1cda9.firebaseapp.com",
    projectId: "ex03-1cda9",
    storageBucket: "ex03-1cda9.appspot.com",
    messagingSenderId: "197987103495",
    appId: "1:197987103495:web:5d6aadf1ed302adf5e0ba2",
    measurementId: "G-6DQ8ER8EK3"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
