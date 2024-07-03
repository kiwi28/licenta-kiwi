"use client";
import { useCallback, useState } from "react";
import {
	getDownloadURL,
	ref,
	StorageReference,
	uploadBytesResumable,
} from "firebase/storage";

import { auth, storage } from "@/lib/firebase";
import {
	Box,
	Image,
	Input,
	InputGroup,
	InputLeftElement,
	Spinner,
	Tooltip,
	VStack,
	useColorModeValue,
	useToast,
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import { CM_INPUT } from "@/constants";

interface ImageUploaderProps {
	downloadURL: string;
	setDownloadURL: (url: string) => void;
}

export function ImageUploader({
	downloadURL,
	setDownloadURL,
}: ImageUploaderProps) {
	const [uploading, setUploading] = useState<boolean>(false);
	const [progress, setProgress] = useState<number>(0);

	const inputBackground = useColorModeValue(...CM_INPUT);

	const toast = useToast();

	const handleUploadFile = async (e: any) => {
		const file = Array.from(e.target.files)[0] as Blob;
		const extension = file.type.split("/")[1];

		const fileRef = ref(
			storage,
			`uploads/${auth?.currentUser?.uid}/${Date.now()}.${extension}`
		) as StorageReference;

		// start uploading
		setUploading(true);

		const uploadTask = uploadBytesResumable(fileRef, file);
		uploadTask.on(
			"state_changed",
			(snapShot) => {
				const uploadedPercent = parseInt(
					((snapShot.bytesTransferred / snapShot.totalBytes) * 100).toFixed(0)
				);
				setProgress(uploadedPercent);
			},
			(error) => {
				toast({
					title: "Error on image upload!",
					description: error.message,
					status: "error",
				});
				console.dir(error);
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
					console.log("File available at", downloadURL);
					setUploading(false);
					setDownloadURL(downloadURL);
				});
			}
		);
	};

	const handleCopyURL = useCallback(() => {
		if (downloadURL) {
			navigator.clipboard.writeText(downloadURL);
			toast({
				title: "URL copied to clipboard",
				status: "success",
			});
		} else {
			toast({
				title: "Failed to copy URL to clipboard",
				status: "error",
			});
		}
	}, [downloadURL, toast]);

	return (
		<Box>
			{uploading && <Spinner />}
			{uploading && <h3>{progress}%</h3>}

			{!uploading && (
				<VStack
					mb={4}
					w={64}
					alignItems={"flex-start"}
				>
					<label htmlFor={"fileUploader"}>Upload Image</label>
					<Input
						px={0}
						id={"fileUploader"}
						border={"none"}
						type="file"
						onChange={handleUploadFile}
						accept="image/x-png,image/gif,image/jpeg,image/jpg"
					/>
				</VStack>
			)}

			{downloadURL && (
				<Box>
					<Image
						mb={4}
						width={"100%"}
						src={downloadURL}
						alt={"cover image"}
					/>
					<Tooltip
						label="Click to copy the URL"
						aria-label="Click to copy the URL tooltip"
					>
						<InputGroup>
							<InputLeftElement
								pointerEvents="none"
								fontSize="1.2em"
							>
								<CopyIcon h={4} />
							</InputLeftElement>
							<Input
								onClick={handleCopyURL}
								cursor={"pointer"}
								isReadOnly
								border={"none"}
								backgroundColor={inputBackground}
								value={downloadURL}
							/>
						</InputGroup>
					</Tooltip>
				</Box>
			)}
		</Box>
	);
}
