import { createContext } from "react";
// import { IUser } from "@/lib/types/types";

import { User as IUser } from "firebase/auth";

export const UserContext = createContext<{
	user: IUser | null | undefined;
	username: string | null;
	isLoadingUser: boolean;
}>({
	user: null,
	username: null,
	isLoadingUser: true,
});
UserContext.displayName = "UserDataFirebase";
