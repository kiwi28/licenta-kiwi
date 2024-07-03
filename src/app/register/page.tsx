/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useCallback, useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import debounce from "lodash/debounce";
import { doc, getDoc, writeBatch } from "firebase/firestore";

import {
	Box,
	Button,
	FormControl,
	FormErrorMessage,
	FormHelperText,
	Heading,
	Input,
	useToast,
} from "@chakra-ui/react";

import { db } from "../../lib/firebase";
import { useUserDataCtx, useUserDataFireBase } from "../../lib/hooks";

import { SignInButton, SignOutButton } from "@/components/Auth";

export default function EnterPage() {
	const { user, username } = useUserDataFireBase();

	const router = useRouter();
	if (username) {
		router.push("/");
	}

	return (
		<Box>
			{user ? (
				!username ? (
					<UsernameForm />
				) : (
					<SignOutButton />
				)
			) : (
				<SignInButton />
			)}
		</Box>
	);
}

const UsernameForm = () => {
	const [formValue, setFormValue] = useState<string>("");
	const [isValid, setIsValid] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	const { user, username } = useUserDataCtx();

	const toast = useToast();
	const router = useRouter();

	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault();

		const userDoc = doc(db, `users/${user?.uid}`);
		const usernameDoc = doc(db, `usernames/${formValue}`);

		try {
			const batch = writeBatch(db);

			batch.set(userDoc, {
				username: formValue,
				photoURL: user?.photoURL,
				displayName: user?.displayName,
				uid: user?.uid,
				savedPosts: [],
			});
			batch.set(usernameDoc, { uid: user?.uid });

			toast.promise(batch.commit(), {
				loading: { description: "Loading..." },
				success: { description: "Username saved." },
				error: { description: "Uh oh, there was an error!" },
			});
			router.push("/");
		} catch (e) {
			toast({
				title: "An error ocurred",
				description: (e as Error).message,
				status: "error",
			});
			console.dir(e);
		}
	};

	const useHandleChange = (e: React.FormEvent<HTMLInputElement>): void => {
		const val = (e.target as HTMLInputElement).value.toLowerCase();
		const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

		if (val.length < 3) {
			setFormValue(val);
			setLoading(false);
			setIsValid(false);
		}

		if (re.test(val)) {
			setFormValue(val);
			setLoading(true);
			setIsValid(false);
		}
	};

	const checkUsername = useCallback(
		debounce(async (username: string) => {
			if (username?.length >= 3) {
				const ref = doc(db, `usernames/${username}`);
				const userDoc = await getDoc(ref);
				const existsUser = userDoc.exists();
				setIsValid(!existsUser);
				setLoading(false);
			}
		}, 500),
		[]
	);

	useEffect(() => {
		checkUsername(formValue);
	}, [formValue, checkUsername]);

	return (
		!username && (
			<FormControl isInvalid={!isValid}>
				<Heading
					mb={2}
					as={"h6"}
					fontSize={"xl"}
				>
					Choose Username
				</Heading>
				<form onSubmit={handleSubmit}>
					<Box>
						<Input
							name="username"
							placeholder="username"
							value={formValue}
							onChange={useHandleChange}
							mb={4}
							w={64}
						/>
						{isValid ? (
							<FormHelperText mb={4}>Username is available!</FormHelperText>
						) : (
							<FormErrorMessage mb={4}>
								Username is not available
							</FormErrorMessage>
						)}
					</Box>

					<Button
						type="submit"
						isDisabled={!isValid}
						mb={4}
					>
						Choose
					</Button>
				</form>
			</FormControl>
		)
	);
};

// const UsernameMessage = ({
// 	username,
// 	isValid,
// 	loading,
// }: {
// 	username: string;
// 	isValid: boolean;
// 	loading: boolean;
// }) => {
// 	if (loading) {
// 		return <p>Checking...</p>;
// 	} else if (isValid) {
// 		return <p className="text-success">{username} is available!</p>;
// 	} else if (username && !isValid) {
// 		return <p className="text-danger">That username is taken!</p>;
// 	} else {
// 		return <p></p>;
// 	}
// };
