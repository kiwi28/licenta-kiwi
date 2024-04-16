// import { User as IUser } from "firebase/auth";
import { DocumentData, Timestamp } from "firebase/firestore";

export type IColorModeTuple = [string, string];

// export interface IUser {
// 	displayName: string;
// 	photoURL: string;
// 	username: string;
// 	uid: string;
// }

export interface IPost {
	authorProfilePic: string;
	imageURL: string;
	content: string;
	heartCount: number;
	published: boolean;
	slug: string;
	title: string;
	uid: string;
	username: string;
	updatedAt: number;
	createdAt: number;
}

// export interface PostWFB extends Post, DocumentData {}
export type PostWFB = IPost & DocumentData;
