import { User } from "firebase/auth";
import { DocumentData, Timestamp } from "firebase/firestore";

export type IColorModeTuple = [string, string];

export interface IPost {
	authorProfilePic: string;
	imageURL: string;
	content: string;
	published: boolean;
	slug: string;
	title: string;
	uid: string;
	username: string;
	updatedAt: Timestamp;
	createdAt: Timestamp;
}

// export interface PostWFB extends Post, DocumentData {}
export type PostWFB = IPost & DocumentData;
