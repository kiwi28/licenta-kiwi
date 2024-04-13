"use client";
import ImageUploader from "./ImageUploader";
import { useCallback, useState } from "react";

import { Box, Button, FormControl, Heading, Textarea } from "@chakra-ui/react";

import Markdown from "react-markdown";

// export const NewArticle: React.FC = () => {
// 	const [isEditing, setIsEditing] = useState<boolean>(false);

// 	const btnBg = useColorModeValue(...CM_BUTTON_CONTRAST);
// 	const btnColor = useColorModeValue(...CM_TEXT);

// 	const toggleIsEditing = useCallback(() => {
// 		setIsEditing((prev) => !prev);
// 	}, [setIsEditing]);

// 	return (
// 		<Box pb={96}>
// 			<ArticleEditor toggleIsEditing={toggleIsEditing} />
// 		</Box>
// 	);
// };

interface ArticleEditorProps {
	toggleIsEditing?: () => void;
	articleDoc?: any;
}
export const ArticleEditor: React.FC<ArticleEditorProps> = ({
	toggleIsEditing,
	articleDoc,
}) => {
	const [isPreview, setIsPreview] = useState<boolean>(false);
	const [textAreaContent, setTextAreaContent] = useState<string>("");

	const toggleIsPreview = useCallback(() => {
		setIsPreview((prev) => !prev);
	}, [setIsPreview]);

	const handleChangeTextArea = useCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			setTextAreaContent(e.target.value);
		},
		[setTextAreaContent]
	);

	return (
		<>
			<Box mb={8}>
				<ImageUploader />
			</Box>
			{isPreview ? (
				<>
					<Box mb={4}>
						<Heading
							as="h3"
							fontSize="xl"
							mb={4}
						>
							{"Lorem ipsum"}
						</Heading>
						<Markdown>{textAreaContent}</Markdown>
					</Box>
					<Button
						mr={4}
						onClick={toggleIsPreview}
					>
						Edit
					</Button>
					<Button>Publish</Button>
				</>
			) : (
				<>
					<FormControl mb={4}>
						<Textarea
							placeholder="Write your article here..."
							value={textAreaContent}
							onChange={handleChangeTextArea}
						/>
					</FormControl>
					{/* <Button
						mr={4}
						onClick={toggleIsEditing}
					>
						Cancel
					</Button> */}
					<Button
						onClick={toggleIsPreview}
						isDisabled={!textAreaContent}
					>
						Preview
					</Button>
				</>
			)}
		</>
	);
};
