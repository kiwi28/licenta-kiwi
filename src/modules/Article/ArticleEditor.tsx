"use client";
import { useCallback, useEffect, useState } from "react";

import {
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	HStack,
	Input,
	Modal,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Switch,
	Text,
	Textarea,
	useColorModeValue,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { ImageUploader } from "../ImageUploader";

import { deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { CM_CARD, CM_HEADER } from "@/constants";
import { IPost } from "@/lib/types/types";
import { redirect, useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { ArticleView } from "./ArticleView";
import Link from "next/link";
import { DeleteIcon } from "@chakra-ui/icons";

interface IArticleEditorProps {
	article: IPost;
}

export const ArticleEditor: React.FC<IArticleEditorProps> = ({ article }) => {
	const [isPreview, setIsPreview] = useState<boolean>(false);
	const [published, setPublished] = useState<boolean>(article.published);
	const [imageURL, setImageURL] = useState<string>("");

	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const {
		isOpen: isOpenDelete,
		onOpen: onOpenDelete,
		onClose: onCloseDelete,
	} = useDisclosure();
	const { adminID, slug } = useParams();

	const articleRef = doc(db, `users/${adminID}/posts/${slug}`);

	const bgColorLight = useColorModeValue(...CM_CARD);
	const bgColorDark = useColorModeValue(...CM_HEADER);

	const articleSchema = yup.object().shape({
		content: yup.string().required().min(10, "Content is too short"),
	});

	const {
		handleSubmit,
		register,
		formState: { errors, isValid, isDirty },
		getValues,
	} = useForm({
		resolver: yupResolver(articleSchema),
		defaultValues: {
			content: article.content,
		},
	});

	const onSubmit = useCallback(
		async (data: { content: string }) => {
			try {
				await updateDoc(articleRef, {
					content: data.content,
					imageURL: imageURL,
					published: published,
					updatedAt: serverTimestamp(),
				});

				toast({
					title: "Article updated",
					status: "success",
					description: "Post updated successfully!",
				});
				onOpen();
			} catch (error) {
				console.error("Error updating article", error);
				toast({
					title: "Error updating Article",
					status: "error",
					description:
						"An error occurred. Please try again or contact support.",
				});
			}
		},
		[articleRef, toast, onOpen, published, imageURL]
	);

	const handleDelete = useCallback(async () => {
		try {
			await deleteDoc(articleRef);
			toast({
				title: "Article deleted",
				status: "success",
				description: "Post deleted successfully!",
			});
			onOpenDelete();
		} catch (error) {
			console.error("Error deleting article", error);
			toast({
				title: "Error deleting Article",
				status: "error",
				description: "An error occurred. Please try again or contact support.",
			});
		}
	}, [articleRef, toast, onOpenDelete]);

	const toggleIsPreview = useCallback(() => {
		setIsPreview((prev) => !prev);
	}, [setIsPreview]);

	console.log("formErrors", errors);

	return (
		<Box
			w={["90%", null, "44rem"]}
			minW={80}
			bgColor={bgColorLight}
			px={8}
			py={4}
			borderRadius={"xl"}
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				<FormControl>
					{isPreview ? (
						<>
							<ArticleView article={{ ...article, ...getValues() }} />
						</>
					) : (
						<>
							<Box mb={8}>
								<ImageUploader
									downloadURL={imageURL}
									setDownloadURL={setImageURL}
								/>
							</Box>
							<Flex flexDir={"column"}>
								<HStack mb={4}>
									<FormLabel
										htmlFor="published"
										mb="0"
									>
										Published:
									</FormLabel>
									<Switch
										id="published"
										isChecked={published}
										onChange={() => {
											setPublished((prev) => !prev);
										}}
									/>
								</HStack>
								<Box>
									<FormLabel htmlFor="title">Title</FormLabel>
									<Input
										isReadOnly
										id={"title"}
										mb={6}
										value={article?.title}
									/>
									<FormLabel htmlFor="content">Content</FormLabel>
									<Textarea
										mb={8}
										rows={15}
										id={"content"}
										placeholder="Write your article here..."
										{...register("content")}
									/>
								</Box>
							</Flex>
							{!!Object.keys(errors).length &&
								Object.values(errors).map((value, idx) => (
									<Text
										key={idx}
										color="red.500"
									>
										{value.message}
									</Text>
								))}
						</>
					)}
					{isPreview ? (
						<HStack>
							<Button
								mr={4}
								onClick={toggleIsPreview}
							>
								Edit
							</Button>
							<Button
								type="submit"
								isDisabled={!isValid && !isDirty}
							>
								Save changes
							</Button>
						</HStack>
					) : (
						<>
							<Button
								isDisabled={!isValid}
								onClick={toggleIsPreview}
								mr={4}
							>
								Preview
							</Button>
							<Button
								colorScheme="red"
								leftIcon={<DeleteIcon />}
								onClick={handleDelete}
							>
								Delete
							</Button>
						</>
					)}
				</FormControl>
			</form>
			<Modal
				// modal success update
				closeOnOverlayClick={false}
				isOpen={isOpen}
				onClose={onClose}
			>
				<ModalOverlay />
				<ModalContent bgColor={bgColorLight}>
					<ModalHeader>Article Updated sucesfully</ModalHeader>

					<ModalFooter>
						<Link href={`/`}>
							<Button
								bgColor={bgColorDark}
								mr={3}
							>
								Go Home
							</Button>
						</Link>

						<Link href={`/${article.username}/${article.slug}`}>
							<Button variant="ghost">See Article</Button>
						</Link>
					</ModalFooter>
				</ModalContent>
			</Modal>
			<Modal
				// modal sucess Delete
				closeOnOverlayClick={false}
				isOpen={isOpenDelete}
				onClose={onCloseDelete}
			>
				<ModalOverlay />
				<ModalContent bgColor={bgColorLight}>
					<ModalHeader>Article Deleted sucesfully</ModalHeader>

					<ModalFooter>
						<Link href={`/`}>
							<Button
								bgColor={bgColorDark}
								mr={3}
							>
								Go Home
							</Button>
						</Link>

						<Link href={`/${article.username}`}>
							<Button variant="ghost">Go to my profile</Button>
						</Link>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
};
