import { Avatar, Box, HStack, Heading, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";

import { IPost } from "@/lib/types/types";

interface SearchResultProps {
	article: IPost;
}
export const SearchResult: React.FC<SearchResultProps> = ({ article }) => {
	return (
		<HStack
			border={"1px solid gray"}
			borderRadius={"md"}
			py={2}
			px={4}
			my={4}
		>
			<Link href={`/${article.username}`}>
				<VStack mr={2}>
					<Avatar
						src={article.authorProfilePic}
						name={article.username}
					/>
					<Text
						_hover={{
							textDecoration: "underline",
						}}
					>
						@{article.username}
					</Text>
				</VStack>
			</Link>
			<Box flexGrow={1}>
				<Link href={`/${article.username}/${article.slug}`}>
					<Heading
						py={2}
						w={"100%"}
						_hover={{
							textDecoration: "underline",
						}}
						as={"h3"}
						size={"md"}
					>
						{article.title}
					</Heading>
				</Link>
			</Box>
		</HStack>
	);
};
