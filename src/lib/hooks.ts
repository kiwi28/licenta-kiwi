import { useContext, useEffect, useState } from "react";

import { doc, onSnapshot } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth, db } from "./firebase";
import { UserContext } from "./context";
import { set } from "lodash";
// import { IUser } from "@/lib/types/types";

export const useUserDataCtx = () => useContext(UserContext);

export const useUserDataFireBase = () => {
	const [user] = useAuthState(auth);
	const [username, setUsername] = useState<string | null>(null);
	const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);
	// const [userDocData, setUserDocData] = useState<IUser | null>(null);

	useEffect(() => {
		let unsubscribe = () => {};

		if (user) {
			setIsLoadingUser(true);
			unsubscribe = onSnapshot(doc(db, "users", user.uid), (doc) => {
				setUsername(doc.data()?.username);
			});
		} else {
			setUsername(null);
		}
		setIsLoadingUser(false);

		return unsubscribe;
	}, [user]);

	useEffect(() => {
		if (user && username) {
			setIsLoadingUser(false);
		}
	}, [username, user]);

	return { user, username, isLoadingUser };
};
