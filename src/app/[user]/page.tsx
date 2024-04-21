"use client";
import { useEffect, useState } from "react";

import { getDocs, orderBy, query, collection } from "firebase/firestore";
import { useParams } from "next/navigation";

import { auth, db, getUserWithUsername, postToJson } from "../../lib/firebase";
import { IPost } from "@/lib/types/types";
import { ArticlesFeed } from "@/modules";

export default function UserProfile() {
	const [posts, setPosts] = useState<IPost[]>([]);
	const [uid, setUid] = useState<string | null>(null);
	const { user } = useParams();

	useEffect(() => {
		async function getPosts() {
			if (user) {
				const userDoc = await getUserWithUsername(user);
				const uid = userDoc.id;
				setUid(uid);

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
	}, [user]);

	return (
		<ArticlesFeed
			posts={posts}
			uid={uid === auth?.currentUser?.uid ? uid : ""}
		/>
	);
}
