// import { User as IUser } from "firebase/auth";
import { DocumentData } from "firebase/firestore";

export type IColorModeTuple = [string, string];

// export interface IUser {
// 	displayName: string;
// 	photoURL: string;
// 	username: string;
// 	uid: string;
// }

export interface IPost {
	content: string;
	createdAt: Date;
	heartCount: number;
	published: boolean;
	slug: string;
	title: string;
	uid: string;
	updatedAt: Date;
	username: string;
}

// export interface PostWFB extends Post, DocumentData {}
export type PostWFB = IPost & DocumentData;
