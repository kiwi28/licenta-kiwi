import { Box, Flex } from "@chakra-ui/react";
import { ArticleCard } from ".";
import { IPost } from "@/lib/types/types";

interface ArticlesFeedProps {
	posts: IPost[];
	admin?: boolean;
}

export const ArticlesFeed: React.FC<ArticlesFeedProps> = ({
	posts,
	admin = false,
}) => {
	return (
		<Flex
			flexDirection={"column"}
			alignItems={"center"}
			justifyContent={"center"}
		>
			{posts.map((post, idx) => (
				<ArticleCard
					key={idx}
					article={post}
					admin={admin}
				/>
			))}
		</Flex>
	);
};