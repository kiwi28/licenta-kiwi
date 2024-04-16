// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";

import { initializeApp } from "firebase/app";
import {
	DocumentSnapshot,
	Timestamp,
	collection,
	getDocs,
	getFirestore,
	limit,
	query,
	where,
} from "firebase/firestore";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { IPost } from "./types/types";
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
export const storage = getStorage();

export async function getUserWithUsername(username: string) {
	const usersRef = collection(db, "users");
	const usersQuery = query(
		usersRef,
		where("username", "==", username),
		limit(1)
	);
	const userDoc = (await getDocs(usersQuery)).docs[0];

	return userDoc;
}

export const postToJson = (doc: DocumentSnapshot) => {
	const data = doc.data();
	return {
		authorProfilePic: (data?.authorProfilePic as string) || "",
		imageURL: (data?.imageURL as string) || "",
		content: data?.content as string,
		heartCount: data?.heartCount as number,
		published: data?.published as boolean,
		slug: data?.slug as string,
		title: data?.title as string,
		uid: data?.uid as string,
		username: data?.username as string,
		createdAt: data?.createdAt.toMillis() as number,
		updatedAt: data?.updatedAt.toMillis() as number,
	};
};

export const fromMillis = Timestamp.fromMillis;
