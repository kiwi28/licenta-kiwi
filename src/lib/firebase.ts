// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyArr6uUO94OFN-RBY9soggd99DP60RwV-U",
	authDomain: "licenta-kiwi.firebaseapp.com",
	projectId: "licenta-kiwi",
	storageBucket: "licenta-kiwi.appspot.com",
	messagingSenderId: "546237160855",
	appId: "1:546237160855:web:3ee3092f9c0da6ca0c78d2",
	measurementId: "G-9JPM5EM44F",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
// export const storage = getStorage();
