"use client";
import { useEffect, useState } from "react";

import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";

import { db, getUserWithUsername } from "@/lib/firebase";
import { IPost } from "@/lib/types/types";

import { Loader } from "@/components";
import { Box, Heading, Image, useColorModeValue } from "@chakra-ui/react";
import { CM_CARD } from "@/constants";
import Markdown from "react-markdown";

export default function ArticlePage() {
	const [article, setArticle] = useState<IPost | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [userUid, setUserUid] = useState<string | null>(null);

	const params = useParams();
	const username =
		typeof params.user === "string" ? params.user : params.user[0];
	const slug = typeof params.slug === "string" ? params.slug : params.slug[0];

	const bgColor = useColorModeValue(...CM_CARD);

	useEffect(() => {
		setLoading(true);
		const getUserData = async () => {
			const userDoc = await getUserWithUsername(username);
			setUserUid(userDoc.id);
		};
		getUserData().then(() => setLoading(false));
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
				}
			};
			getArticleData().then(() => setLoading(false));
		}
	}, [userUid, slug]);

	if (loading) return <Loader />;

	console.log({ article });

	return (
		<Box
			borderRadius={"md"}
			backgroundColor={bgColor}
			w={["90%", null, "44rem"]}
			minW={80}
			px={8}
			py={4}
		>
			{article?.imageURL && (
				<Image
					mb={4}
					width={"100%"}
					height={"auto"}
					src={article.imageURL}
					alt={"cover image"}
					borderRadius={"md"}
				/>
			)}
			<Heading
				as="h3"
				fontSize="3xl"
				mb={4}
			>
				{article?.title}
			</Heading>
			<Markdown>{article?.content}</Markdown>
		</Box>
	);
}
