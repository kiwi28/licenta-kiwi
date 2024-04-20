import { Button, VStack } from "@chakra-ui/react";
import Link from "next/link";

export default function NotFound() {
	return (
		<VStack>
			<h1>Not found – 404!</h1>
			<Link href="/">
				<Button>Go back to Home</Button>
			</Link>
		</VStack>
	);
}
