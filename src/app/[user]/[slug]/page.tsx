"use client";
import { useEffect, useState } from "react";

import { notFound, useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";

import { Box, useColorModeValue, useToast } from "@chakra-ui/react";

import { db, getUserWithUsername } from "@/lib/firebase";
import { IPost } from "@/lib/types/types";
import { CM_CARD } from "@/constants";

import { Loader } from "@/components";
import { ArticleView } from "@/modules";

export default function ArticlePage() {
	const [article, setArticle] = useState<IPost | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [userUid, setUserUid] = useState<string | null>(null);
	const [isNotFount, setIsNotFound] = useState<boolean>(false);

	const toast = useToast();
	const params = useParams();
	const username =
		typeof params.user === "string" ? params.user : params.user[0];
	const slug = typeof params.slug === "string" ? params.slug : params.slug[0];

	const bgColor = useColorModeValue(...CM_CARD);

	useEffect(() => {
		setLoading(true);
		const getUserData = async () => {
			const userDoc = await getUserWithUsername(username);
			if (userDoc) {
				setUserUid(userDoc.id);
			} else {
				setIsNotFound(true);
			}
		};
		getUserData().finally(() => setLoading(false));
	}, [username]);

	useEffect(() => {
		if (userUid) {
			const getArticleData = async () => {
				setLoading(true);
				const articleRef = doc(db, `users/${userUid}/posts/${slug}`);
				const articleSnap = await getDoc(articleRef);

				if (articleSnap.exists()) {
					const article = articleSnap.data() as IPost;
					setArticle(article);
				} else {
					setIsNotFound(true);
				}
			};
			getArticleData()
				.catch((err) => {
					toast({
						title: "Error",
						description: "Failed to load article.",
						status: "error",
					});
					console.error(err);
				})
				.finally(() => setLoading(false));
		}
	}, [userUid, slug, toast]);

	if (loading) return <Loader />;
	if (isNotFount) notFound();

	return (
		<Box
			borderRadius={"md"}
			backgroundColor={bgColor}
			w={["90%", null, "44rem"]}
			minW={80}
			mb={8}
		>
			{article && <ArticleView article={article} />}
		</Box>
	);
}
