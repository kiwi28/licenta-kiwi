"use client";

import {
	Avatar,
	Box,
	BoxProps,
	Button,
	Flex,
	Heading,
	Text,
	useColorModeValue,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import Link from "next/link";

import { IPost } from "@/lib/types/types";
import { CM_CARD } from "@/constants";

interface IArticleCardProps extends BoxProps {
	article: IPost;
	uid?: string;
}

export const ArticleCard: React.FC<IArticleCardProps> = ({ article, uid }) => {
	return (
		<Box
			borderRadius={"md"}
			backgroundColor={useColorModeValue(...CM_CARD)}
			w={["90%", null, "44rem"]}
			minW={80}
			mb={8}
		>
			<Flex p={4}>
				<Box
					pr={[0, null, 20]}
					w={"100%"}
				>
					<Flex mb={4}>
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
									_hover={{
										textDecoration: "underline",
									}}
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
								{
									new Date(Number(article.updatedAt))
										.toISOString()
										.split("T")[0]
								}
							</Text>
						</Box>
					</Flex>
					<Box pl={[0, null, 14]}>
						<Link href={`/${article.username}/${article.slug}`}>
							<Flex
								flexDir={"column"}
								justifyContent={"flex-end"}
							>
								<Box
									background={
										article.imageURL ? `url(${article.imageURL})` : "none"
									}
									backgroundPosition={"center"}
									backgroundSize={"cover"}
									h={article.imageURL ? 48 : "none"}
									mb={4}
								/>
								<Heading
									_hover={{
										textDecoration: "underline",
									}}
									aria-label="article title"
									as="h3"
									size="xl"
								>
									{article.title}
								</Heading>
							</Flex>
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
									color={useColorModeValue(...CM_VOTE)}
									w={5}
									h={5}
									mr={2}
								/>

								<Text mr={1}>{article.heartCount}</Text>
								<Text>upvotes</Text>
							</Flex> */}
							{uid && (
								<Flex
									mt={8}
									alignItems={"center"}
								>
									<Link href={`/admin/${uid}/${article.slug}`}>
										<Button leftIcon={<EditIcon />}>Edit</Button>
									</Link>

									{!article.published && (
										<Text
											ml={2}
											color={"orange"}
										>
											Not published
										</Text>
									)}
								</Flex>
							)}
						</Flex>
					</Box>
				</Box>
			</Flex>
		</Box>
	);
};
