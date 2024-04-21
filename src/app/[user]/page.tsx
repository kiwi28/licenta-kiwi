"use client";
import { useEffect, useState } from "react";

import { getDocs, orderBy, query, collection } from "firebase/firestore";
import { notFound, useParams } from "next/navigation";

import { auth, db, getUserWithUsername, postToJson } from "../../lib/firebase";
import { IPost } from "@/lib/types/types";
import { ArticlesFeed } from "@/modules";
import { Loader } from "@/components";
import { useToast } from "@chakra-ui/react";

export default function UserProfile() {
	const [posts, setPosts] = useState<IPost[]>([]);
	const [isNotFount, setIsNotFound] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(true);
	const [uid, setUid] = useState<string | null>(null);
	const [refresh, setRefresh] = useState<number>(0);

	const { user: userNameParams } = useParams();
	const user =
		typeof userNameParams === "string" ? userNameParams : userNameParams[0];
	const toast = useToast();

	useEffect(() => {
		setLoading(true);
		async function getPosts() {
			if (user) {
				const userDoc = await getUserWithUsername(user);
				console.log(userDoc);

				if (userDoc) {
					const uid = userDoc.id;
					setUid(uid);
					const postsQuery = query(
						collection(db, "users", uid, "posts"),
						orderBy("published", "desc"),
						orderBy("createdAt", "desc")
					);

					const posts = (await getDocs(postsQuery)).docs.map(postToJson);
					setPosts(posts);
				} else {
					setIsNotFound(true);
				}
			}
		}
		getPosts()
			.catch((err) => {
				toast({
					title: "Error",
					description: "Failed to load user's posts.",
					status: "error",
				});
				console.error(err);
			})
			.finally(() => setLoading(false));
	}, [user, toast, refresh]);

	if (loading) return <Loader />;
	if (isNotFount) notFound();

	return (
		<ArticlesFeed
			posts={posts}
			uidUser={uid === auth?.currentUser?.uid ? uid : ""}
			setRefresh={setRefresh}
		/>
	);
}
