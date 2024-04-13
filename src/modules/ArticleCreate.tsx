import { useCallback, useState } from "react";

import { auth, db } from "@/lib/firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { kebabCase } from "lodash";

import {
	Box,
	Button,
	HStack,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	VStack,
	useColorModeValue,
	useToast,
} from "@chakra-ui/react";

import { useUserDataCtx } from "@/lib/hooks";
import { CM_BUTTON_CONTRAST, CM_INPUT } from "@/constants";

interface ArticleCreateProps {
	isOpen: boolean;
	onClose: () => void;
}

export const ArticleCreate: React.FC<ArticleCreateProps> = ({
	isOpen,
	onClose,
}) => {
	const router = useRouter();
	const { username } = useUserDataCtx();
	const [title, setTitle] = useState("");

	const toast = useToast();
	const bgColor = useColorModeValue(...CM_INPUT);
	const btnColor = useColorModeValue(...CM_BUTTON_CONTRAST);

	const slug = encodeURI(kebabCase(title));
	const isValid = title.length > 3 && title.length < 100;

	const createPost = useCallback(async () => {
		const uid = auth?.currentUser?.uid || "";
		const ref = doc(db, "users", uid, "posts", slug);

		const data = {
			title,
			slug,
			uid,
			username,
			published: false,
			content: "",
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp(),
			heartCount: 0,
		};

		toast.promise(setDoc(ref, data), {
			success: { title: "Promise resolved", description: "Post created!" },
			error: { title: "Promise rejected", description: "Something wrong" },
			loading: { title: "Promise pending", description: "Please wait" },
		});

		onClose();
		router.push(`/admin/${slug}`);
	}, [slug, title, username, router, toast, onClose]);

	const handleChangeTitle = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setTitle(e.target.value);
		},
		[setTitle]
	);

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
		>
			<ModalOverlay />
			<ModalContent bgColor={bgColor}>
				<ModalHeader>Create a new Article</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<VStack alignItems={"flex-start"}>
						<Box>Title</Box>
						<Input
							placeholder="Title"
							onChange={handleChangeTitle}
							value={title}
							mb={4}
						/>
						<HStack>
							<Text>Slug:</Text>
							<Text color={"orange.500"}>{slug}</Text>
						</HStack>
					</VStack>
				</ModalBody>

				<ModalFooter>
					<Button
						mr={3}
						variant="ghost"
						onClick={onClose}
					>
						Close
					</Button>
					<Button
						bgColor={btnColor}
						isDisabled={!isValid}
						onClick={createPost}
					>
						Create Post
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
