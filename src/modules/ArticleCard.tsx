"use client";

import { CM_CARD, CM_VOTE } from "@/constants";
import {
	Box,
	Flex,
	Heading,
	Icon,
	Image,
	Text,
	useColorModeValue,
} from "@chakra-ui/react";

import { UpvoteBorder, UpvotehFilled } from "@/components";
import { ChatIcon } from "@chakra-ui/icons";

interface IArticleCardProps {
	tags: string[];
}

export const ArticleCard: React.FC<IArticleCardProps> = ({ tags }) => {
	return (
		<Box
			borderRadius={"md"}
			backgroundColor={useColorModeValue(...CM_CARD)}
		>
			<Flex p={4}>
				<Box pr={[0, null, 20]}>
					<Flex>
						<Image
							src="/avatar.webp"
							alt="avatar"
							borderRadius={"xl"}
							mr={4}
							w={10}
							h={10}
						/>
						<Box>
							<Text
								lineHeight={"none"}
								aria-label="article author"
								fontSize={"lg"}
							>
								Chivulescu Alexandru
							</Text>
							<Text
								aria-label="date posted"
								fontSize={"md"}
							>
								6 apr 2024
							</Text>
						</Box>
					</Flex>
					<Box pl={[0, null, 14]}>
						<Heading
							aria-label="article title"
							as="h3"
							size="xl"
							py={8}
						>
							{
								"Understanding Code Structure: A Beginner's Guide to Tree-sitter"
							}
						</Heading>
						<Box>
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
						</Box>
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

								<Text mr={1}>12</Text>
								<Text>upvotes</Text>
							</Flex>
							<Flex
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
							</Flex>
						</Flex>
					</Box>
				</Box>
			</Flex>
		</Box>
	);
};
