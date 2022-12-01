// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCcqHrikClIe-OD5h4uvqewyKE2PJKxhFg",
  authDomain: "street-post.firebaseapp.com",
  projectId: "street-post",
  storageBucket: "street-post.appspot.com",
  messagingSenderId: "714016676751",
  appId: "1:714016676751:web:bf5d94ef23030046efc9fa",
  measurementId: "G-6VP0LG1RMB",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export default app;
export { db, storage };
