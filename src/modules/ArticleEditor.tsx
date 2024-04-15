"use client";
import { ImageUploader } from "./ImageUploader";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
	Box,
	Button,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Switch,
	Textarea,
	useColorModeValue,
	useToast,
} from "@chakra-ui/react";
import Markdown from "react-markdown";

import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useParams } from "next/navigation";
import { CM_CARD, CM_HEADER } from "@/constants";
import { IPost } from "@/lib/types/types";
import { Loader } from "@/components";
import { set } from "lodash";

export const ArticleEditor: React.FC = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [article, setArticle] = useState<IPost | null>(null);
	const [isPreview, setIsPreview] = useState<boolean>(false);
	const [textAreaContent, setTextAreaContent] = useState<string>("");
	const [isPublished, setIsPublished] = useState<boolean>(false);
	const [imageURL, setImageURL] = useState<string>("");

	const toast = useToast();
	const params = useParams();
	const { slug } = params;

	const bgColorLight = useColorModeValue(...CM_CARD);
	const bgColorDark = useColorModeValue(...CM_HEADER);

	const articleRef = useMemo(
		() => doc(db, `users/${auth?.currentUser?.uid}/posts/${slug}`),
		[slug]
	);

	useEffect(() => {
		setLoading(true);
		const getArticle = async () => {
			const articleSnap = await getDoc(articleRef);

			if (articleSnap.exists()) {
				const article = articleSnap.data() as IPost;
				console.log({ article });
				setArticle(article);
			}
		};
		getArticle().then(() => setLoading(false));
	}, [articleRef]);

	useEffect(() => {
		if (article) {
			setTextAreaContent(article.content);
			setIsPublished(article.published);
			setImageURL(article.imageURL || "");
		}
	}, [article]);

	const updatePost = useCallback(
		async (publishedStatus = isPublished) => {
			await updateDoc(articleRef, {
				content: textAreaContent,
				imageURL,
				published: publishedStatus,
				updatedAt: serverTimestamp(),
			});

			toast({
				title: "Post updated",
				status: "success",
				description: "Post updated successfully!",
			});
		},
		[articleRef, textAreaContent, isPublished, toast, imageURL]
	);

	const toggleIsPreview = useCallback(() => {
		setIsPreview((prev) => !prev);
	}, [setIsPreview]);

	const handleChangeTextArea = useCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			setTextAreaContent(e.target.value);
		},
		[setTextAreaContent]
	);

	if (loading) return <Loader />;
	// console.log({ article });

	return (
		<Box
			bgColor={bgColorLight}
			px={8}
			py={4}
			borderRadius={"xl"}
		>
			<Box mb={8}>
				<ImageUploader
					downloadURL={imageURL}
					setDownloadURL={setImageURL}
				/>
			</Box>
			{isPreview ? (
				<>
					<Box
						mb={8}
						border={"1px solid gray"}
						borderRadius={"xl"}
						bgColor={bgColorDark}
						px={8}
						py={4}
					>
						<Heading
							as="h3"
							fontSize="3xl"
							mb={4}
						>
							{article?.title}
						</Heading>
						<Markdown>{textAreaContent}</Markdown>
					</Box>
					<Button
						mr={4}
						onClick={toggleIsPreview}
					>
						Edit
					</Button>
					<Button
						onClick={() => {
							updatePost();
						}}
					>
						Save changes
					</Button>
				</>
			) : (
				<>
					<FormControl mb={8}>
						<FormLabel htmlFor="title">Title</FormLabel>
						<Input
							isReadOnly
							id={"title"}
							mb={6}
							value={article?.title}
						/>
						<FormLabel htmlFor="content">Content</FormLabel>
						<Textarea
							id={"content"}
							placeholder="Write your article here..."
							value={textAreaContent}
							onChange={handleChangeTextArea}
						/>
					</FormControl>

					<Button
						onClick={toggleIsPreview}
						isDisabled={!textAreaContent}
					>
						Preview
					</Button>
				</>
			)}
			<FormControl
				display="flex"
				alignItems="center"
				mt={2}
			>
				<FormLabel
					htmlFor="publish-post"
					mb="0"
				>
					Published:
				</FormLabel>
				<Switch
					onChange={() => {
						updatePost(!isPublished);
						setIsPublished((prev) => !prev);
					}}
					isChecked={isPublished}
					id="publish-post"
				/>
			</FormControl>
		</Box>
	);
};
