// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCTco3Kyvkf8hodV12sJMqyQ2jC8i5tcPk",
  authDomain: "vstudio-3a136.firebaseapp.com",
  projectId: "vstudio-3a136",
  storageBucket: "vstudio-3a136.firebasestorage.app",
  messagingSenderId: "578102210639",
  appId: "1:578102210639:web:21d84a239697b90f1e7a3a",
  measurementId: "G-VC15QQRW9Z"
};


// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
