"use client";
import { useCallback, useEffect, useState } from "react";

import { db, fromMillis, postToJson } from "@/lib/firebase";
import {
	collectionGroup,
	getDocs,
	limit,
	query,
	orderBy,
	where,
	startAfter,
} from "firebase/firestore";

import { IPost } from "@/lib/types/types";
import { ArticlesFeed } from "@/modules";
import { Button, Spinner } from "@chakra-ui/react";
import { Loader } from "@/components";

const LIMIT = 2;

export default function Home() {
	const [posts, setPosts] = useState<IPost[]>([]);
	const [postsEnd, setPostsEnd] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [initialLoad, setInitialLoad] = useState<boolean>(false);

	useEffect(() => {
		const getPosts = async () => {
			setInitialLoad(true);

			const postsQuery = query(
				collectionGroup(db, "posts"),
				where("published", "==", true),
				orderBy("createdAt", "desc"),
				limit(LIMIT)
			);

			const posts = (await getDocs(postsQuery)).docs.map(postToJson);
			setPosts(posts);

			if (posts.length < LIMIT) {
				setPostsEnd(true);
			}

			setInitialLoad(false);
		};
		getPosts();
	}, []);

	const handleGetMorePosts = useCallback(async () => {
		setLoading(true);

		const last = posts[posts.length - 1];
		const cursor =
			typeof last.createdAt === "number"
				? fromMillis(last.createdAt)
				: last.createdAt;

		const postsQuery = query(
			collectionGroup(db, "posts"),
			where("published", "==", true),
			orderBy("createdAt", "desc"),
			startAfter(cursor),
			limit(LIMIT)
		);

		const querySnapPosts = await getDocs(postsQuery);
		const newPosts: IPost[] = querySnapPosts.docs.map(postToJson);

		setPosts([...posts, ...newPosts]);
		setLoading(false);
		if (newPosts.length < LIMIT) {
			setPostsEnd(true);
		}
	}, [posts]);

	if (initialLoad) {
		return <Loader />;
	}

	return (
		<>
			<ArticlesFeed posts={posts} />
			{!initialLoad && !postsEnd && !!posts.length && (
				<Button onClick={handleGetMorePosts}>Load more!</Button>
			)}
			{loading && <Spinner />}
			{postsEnd && `You've reached the end!`}
		</>
	);
}
