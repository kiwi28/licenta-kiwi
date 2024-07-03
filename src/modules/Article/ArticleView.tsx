"use client";

import { IPost } from "@/lib/types/types";
import { Avatar, Box, Flex, Heading, Text } from "@chakra-ui/react";
import Link from "next/link";
import Markdown from "react-markdown";
import { Timestamp } from "firebase/firestore";

interface IArticleViewProps {
	article: IPost;
}

const convertFirebaseDate = (date: Timestamp) => {
	const fireBaseTime = new Date(
		date.seconds * 1000 + date.nanoseconds / 1000000
	);
	return new Intl.DateTimeFormat("ro-RO").format(fireBaseTime);
};

export const ArticleView: React.FC<IArticleViewProps> = ({ article }) => {
	return (
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
						{convertFirebaseDate(article.updatedAt)}
					</Text>
				</Box>
			</Flex>
			<Box>
				<Link href={`/${article.username}/${article.slug}`}>
					<Box
						flexDir={"column"}
						justifyContent={"flex-end"}
						background={article.imageURL ? `url(${article.imageURL})` : "none"}
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
					{/* <Flex
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
					</Flex> */}
				</Flex>
			</Box>
		</Box>
	);
};
