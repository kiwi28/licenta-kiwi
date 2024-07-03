import { CM_BUTTON_MAIN } from "@/constants";
import { auth, googleAuthProvider } from "@/lib/firebase";
import { Button, useColorModeValue } from "@chakra-ui/react";
import { signInWithPopup } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const SignInButton = () => {
	const router = useRouter();

	const signInWithGoogle = async () => {
		const result = await signInWithPopup(auth, googleAuthProvider);
		if (result?.user) {
			console.log("User signed in with Google", result);
			router.push("/register");
		}
	};

	return (
		<Button
			onClick={signInWithGoogle}
			backgroundColor={useColorModeValue(...CM_BUTTON_MAIN)}
		>
			<Image
				src="/google.png"
				alt="Google Logo"
				width={20}
				height={20}
				style={{ marginRight: "10px" }}
			/>
			Sign In
		</Button>
	);
};

export const SignOutButton = () => {
	return (
		<Button
			as={"div"}
			onClick={() => auth.signOut()}
		>
			Sign Out
		</Button>
	);
};
