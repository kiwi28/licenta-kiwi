"use client";
import { useEffect, useState } from "react";

import { getDocs, orderBy, query, collection } from "firebase/firestore";

import { auth, db, getUserWithUsername, postToJson } from "../../lib/firebase";
import { useUserDataCtx } from "@/lib/hooks";
import { ArticlesFeed } from "@/modules/ArticlesFeed";
import { IPost } from "@/lib/types/types";

export default function UserProfile() {
	const [posts, setPosts] = useState<IPost[]>([]);
	const [uid, setUid] = useState<string | null>(null);
	const { username } = useUserDataCtx();

	useEffect(() => {
		async function getPosts() {
			if (username) {
				const userDoc = await getUserWithUsername(username);
				const uid = userDoc.id;
				setUid(uid);

				// let user: Partial<User>;
				// let posts: PostWFB[];

				if (userDoc) {
					const postsQuery = query(
						collection(db, "users", uid, "posts"),
						orderBy("published", "desc"),
						orderBy("createdAt", "desc")
					);

					const posts = (await getDocs(postsQuery)).docs.map(postToJson);
					setPosts(posts);
				}
			}
		}
		getPosts();
	}, [username]);

	return (
		<ArticlesFeed
			posts={posts}
			uid={uid === auth?.currentUser?.uid ? uid : ""}
		/>
	);
}
