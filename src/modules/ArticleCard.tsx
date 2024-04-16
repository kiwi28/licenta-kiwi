"use client";

import { CM_CARD, CM_VOTE } from "@/constants";
import {
	Avatar,
	Box,
	BoxProps,
	Button,
	Flex,
	Heading,
	Image,
	Text,
	useColorModeValue,
} from "@chakra-ui/react";

import { UpvoteBorder, UpvotehFilled } from "@/components";
import { IPost } from "@/lib/types/types";
import Link from "next/link";
import { EditIcon } from "@chakra-ui/icons";

interface IArticleCardProps extends BoxProps {
	article: IPost;
	admin?: boolean;
}

export const ArticleCard: React.FC<IArticleCardProps> = ({
	article,
	admin = false,
}) => {
	console.log(article.authorProfilePic);
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
						{/* <Image
							src={article.authorProfilePic || "/avatar.webp"}
              imgProps
							alt="avatar"
							borderRadius={"xl"}
							mr={4}
							w={10}
							h={10}
						/> */}
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
								background={
									article.imageURL ? `url(${article.imageURL})` : "none"
								}
								backgroundPosition={"center"}
								backgroundSize={"cover"}
								h={article.imageURL ? 48 : "none"}
								mb={4}
								role="group"
							>
								<Heading
									aria-label="article title"
									textShadow={article.imageURL ? "1px 1px 20px black" : "none"}
									_groupHover={
										article.imageURL ? { background: "rgba(0, 0, 0, 0.5)" } : {}
									}
									transition={"background 0.3s ease"}
									as="h3"
									pl={article.imageURL ? 4 : 0}
									size="xl"
								>
									{article.title}
								</Heading>
							</Flex>
						</Link>
						{/* <Box>
							{tags.map((tag, idx) => (
								<Text
									fontSize={"sm"}
									key={idx}
									aria-label="tag"
									display={"inline-block"}
									// px={2}
									// py={1}
									// borderRadius={"md"}
									// backgroundColor={"teal.200"}
									mr={2}
								>
									#{tag}
								</Text>
							))}
						</Box> */}
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
									color={useColorModeValue(...CM_VOTE)}
									w={5}
									h={5}
									mr={2}
								/>

								<Text mr={1}>{article.heartCount}</Text>
								<Text>upvotes</Text>
							</Flex>
							{admin && (
								<Flex>
									<Link href={`/admin/${article.slug}`}>
										<Button
											ml={4}
											leftIcon={<EditIcon />}
										>
											Edit
										</Button>
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
							{/* <Flex
								alignItems={"center"}
								mr={4}
								p={2}
								cursor={"pointer"}
							>
								<Icon
									as={ChatIcon}
									w={4}
									h={4}
									mr={2}
								/>
								<Text mr={1}>12</Text>
								<Text>comments</Text>
							</Flex> */}
						</Flex>
					</Box>
				</Box>
			</Flex>
		</Box>
	);
};
