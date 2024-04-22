"use client";

import {
	Avatar,
	Box,
	BoxProps,
	Button,
	Flex,
	Heading,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	useColorModeValue,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import Link from "next/link";

import { IPost } from "@/lib/types/types";
import { CM_CARD } from "@/constants";
import { useCallback } from "react";
import {
	DocumentData,
	DocumentReference,
	deleteDoc,
	doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
interface IArticleCardProps extends BoxProps {
	article: IPost;
	uidUser?: string;
	setRefresh?: (value: number) => void;
}

export const ArticleCard: React.FC<IArticleCardProps> = ({
	article,
	uidUser,
	setRefresh,
}) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();

	const bgColorLight = useColorModeValue(...CM_CARD);

	let articleRef: DocumentReference<DocumentData, DocumentData>;
	let handleDelete: () => void;
	if (uidUser) {
		articleRef = doc(db, `users/${uidUser}/posts/${article.slug}`);
		handleDelete = async () => {
			if (articleRef && toast && setRefresh) {
				try {
					await deleteDoc(articleRef);
					toast({
						title: "Article deleted",
						status: "success",
						description: "Post deleted successfully!",
					});
					// set refresh is setState in the parent and the state value it;s used in the parent's useEffect that gets the articles. When it changes, it triggers data refetch
					setRefresh(Math.random());
				} catch (error) {
					console.error("Error deleting article", error);
					toast({
						title: "Error deleting Article",
						status: "error",
						description:
							"An error occurred. Please try again or contact support.",
					});
				}
			}
		};
	}

	// const handleDelete = useCallback(async () => {
	// 	if (articleRef) {
	// 		try {
	// 			await deleteDoc(articleRef);
	// 			toast({
	// 				title: "Article deleted",
	// 				status: "success",
	// 				description: "Post deleted successfully!",
	// 			});
	// 			// set refresh is setState in the parent and the state value it;s used in the parent's useEffect that gets the articles. When it changes, it triggers data refetch
	// 			if (setRefresh) setRefresh(Math.random());
	// 		} catch (error) {
	// 			console.error("Error deleting article", error);
	// 			toast({
	// 				title: "Error deleting Article",
	// 				status: "error",
	// 				description:
	// 					"An error occurred. Please try again or contact support.",
	// 			});
	// 		}
	// 	}
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [articleRef, toast, setRefresh]);
	return (
		<Box
			borderRadius={"md"}
			backgroundColor={useColorModeValue(...CM_CARD)}
			w={["97%", null, "44rem"]}
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
								role="group"
							>
								{article.imageURL && (
									<Box
										background={`url(${article.imageURL})`}
										backgroundPosition={"center"}
										backgroundSize={"cover"}
										h={48}
										mb={4}
									/>
								)}
								<Heading
									_groupHover={{
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
							{uidUser && (
								<Flex
									mt={8}
									alignItems={"center"}
								>
									<Link href={`/admin/${uidUser}/${article.slug}`}>
										<Button
											mr={4}
											leftIcon={<EditIcon />}
										>
											Edit
										</Button>
									</Link>
									<Button
										colorScheme="red"
										leftIcon={<DeleteIcon />}
										onClick={onOpen}
									>
										Delete
									</Button>

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
			<Modal
				isOpen={isOpen}
				onClose={onClose}
			>
				<ModalOverlay />
				<ModalContent bgColor={bgColorLight}>
					<ModalHeader>Do you want to delete this article ?</ModalHeader>
					<ModalBody>{article.title}</ModalBody>

					<ModalFooter>
						<Button
							mr={4}
							colorScheme="red"
							leftIcon={<DeleteIcon />}
							onClick={() => {
								if (handleDelete) handleDelete();
							}}
						>
							Delete
						</Button>

						<Button
							variant="ghost"
							onClick={onClose}
						>
							Cancel
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
};
