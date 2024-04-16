"use client";
import { useEffect, useState } from "react";

import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import Markdown from "react-markdown";
import Link from "next/link";

import {
	Avatar,
	Box,
	Flex,
	Heading,
	Text,
	useColorModeValue,
} from "@chakra-ui/react";

import { db, getUserWithUsername } from "@/lib/firebase";
import { IPost } from "@/lib/types/types";
import { CM_CARD, CM_VOTE } from "@/constants";

import { Loader, UpvotehFilled } from "@/components";

export default function ArticlePage() {
	const [article, setArticle] = useState<IPost | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [userUid, setUserUid] = useState<string | null>(null);

	const params = useParams();
	const username =
		typeof params.user === "string" ? params.user : params.user[0];
	const slug = typeof params.slug === "string" ? params.slug : params.slug[0];

	const bgColor = useColorModeValue(...CM_CARD);
	const voteColor = useColorModeValue(...CM_VOTE);

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

	if (loading && !article) return <Loader />;
	if (!article) return <Text>Article not found</Text>;

	return (
		<Box
			borderRadius={"md"}
			backgroundColor={bgColor}
			w={["90%", null, "44rem"]}
			minW={80}
			mb={8}
		>
			<Box
				w={"100%"}
				p={4}
			>
				<Flex mb={8}>
					<Avatar
						h={10}
						w={10}
						mr={4}
						name={article.username}
						src={article.authorProfilePic || "/avatar.webp"}
					/>
					<Box>
						<Link href={`/${article.username}`}>
							<Text
								lineHeight={"none"}
								aria-label="article author"
								fontSize={"lg"}
							>
								@{article.username}
							</Text>
						</Link>
						<Text
							aria-label="date posted"
							fontSize={"sm"}
						>
							{article.createdAt === article.updatedAt ? "Posted" : "Updated"}
							{": "}
							{new Date(Number(article.updatedAt)).toISOString().split("T")[0]}
						</Text>
					</Box>
				</Flex>
				<Box>
					<Link href={`/${article.username}/${article.slug}`}>
						<Box
							flexDir={"column"}
							justifyContent={"flex-end"}
							background={
								article.imageURL ? `url(${article.imageURL})` : "none"
							}
							backgroundPosition={"center"}
							backgroundSize={"cover"}
							h={article.imageURL ? 48 : "none"}
							mb={4}
						/>

						<Heading
							as="h3"
							fontSize="3xl"
							mb={4}
						>
							{article.title}
						</Heading>
						<Box py={6}>
							<Markdown>{article.content}</Markdown>
						</Box>
					</Link>
					<Flex
						flexWrap={"wrap"}
						alignItems={"center"}
					>
						<Flex
							alignItems={"center"}
							mr={4}
							p={2}
							pl={0}
						>
							<UpvotehFilled
								color={voteColor}
								w={5}
								h={5}
								mr={2}
							/>

							<Text mr={1}>{article.heartCount}</Text>
							<Text>upvotes</Text>
						</Flex>
					</Flex>
				</Box>
			</Box>
		</Box>
	);
}
