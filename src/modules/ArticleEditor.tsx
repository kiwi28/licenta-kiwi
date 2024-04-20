"use client";
import { useCallback, useEffect, useState } from "react";

import {
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Switch,
	Text,
	Textarea,
	useColorModeValue,
	useToast,
} from "@chakra-ui/react";

import { SubmitHandler, useForm } from "react-hook-form";
import Markdown from "react-markdown";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { ImageUploader } from "./ImageUploader";

import { serverTimestamp, updateDoc } from "firebase/firestore";
import { CM_CARD, CM_HEADER } from "@/constants";
import { IPost } from "@/lib/types/types";
import { Loader } from "@/components";
import { IEditArticleFields } from "@/app/admin/[adminID]/[slug]/page";
import { set } from "lodash";

interface IArticleEditorProps {
	article: IPost;
	// onSubmit: (data: IEditArticleFields) => void;
}

export const ArticleEditor: React.FC<IArticleEditorProps> = ({
	article,
	// onSubmit,
}) => {
	console.log("article din editor", article);
	const [isPreview, setIsPreview] = useState<boolean>(false);
	const [imageURL, setImageURL] = useState<string>("");

	const bgColorLight = useColorModeValue(...CM_CARD);
	const bgColorDark = useColorModeValue(...CM_HEADER);

	const articleSchema = yup.object().shape({
		title: yup.string().required().min(5, "Title is too short"),
		content: yup.string().required().min(10, "Content is too short"),
		published: yup.boolean().required(),
		imageURL: yup.string().required(),
	});

	const {
		handleSubmit,
		register,
		formState: { errors, isValid },
		setValue,
	} = useForm({
		resolver: yupResolver(articleSchema),
		defaultValues: {
			title: article.title,
			content: article.content,
			published: article.published,
			imageURL: article.imageURL,
		},
	});

	const toggleIsPreview = useCallback(() => {
		setIsPreview((prev) => !prev);
	}, [setIsPreview]);

	useEffect(() => {
		setValue("imageURL", imageURL);
	}, [imageURL, setValue]);

	return (
		<Box
			w={["90%", null, "44rem"]}
			minW={80}
			bgColor={bgColorLight}
			px={8}
			py={4}
			borderRadius={"xl"}
		>
			<form onSubmit={handleSubmit(() => {})}>
				<FormControl isInvalid={!!errors.title}>
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
								<Text
									aria-label="date posted"
									fontSize={"sm"}
								>
									{article.createdAt === article.updatedAt
										? "Posted"
										: "Updated"}
									{": "}
									{
										new Date(Number(article.updatedAt))
											.toISOString()
											.split("T")[0]
									}
								</Text>
								<Heading
									as="h3"
									fontSize="3xl"
									mb={4}
								>
									{article.title}
								</Heading>
								<Markdown>{article.content}</Markdown>
							</Box>
							<Button
								mr={4}
								onClick={toggleIsPreview}
							>
								Edit
							</Button>
							<Button type="submit">Save changes</Button>
						</>
					) : (
						<Flex flexDir={"column"}>
							<FormLabel
								htmlFor="published"
								mb="0"
							>
								Published:
							</FormLabel>
							<Switch id="published" />
							<Box>
								<FormLabel htmlFor="title">Title</FormLabel>
								<Input
									isReadOnly
									id={"title"}
									mb={6}
									value={article?.title}
									{...register("title")}
								/>
								<FormLabel htmlFor="content">Content</FormLabel>
								<Textarea
									id={"content"}
									placeholder="Write your article here..."
									{...register("content")}
								/>

								<Button
									onClick={toggleIsPreview}
									isDisabled={isValid}
								>
									Preview
								</Button>
							</Box>
						</Flex>
					)}
				</FormControl>
			</form>
		</Box>
	);
};
