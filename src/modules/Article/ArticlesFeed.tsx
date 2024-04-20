import { ArticleCard } from "..";
import { IPost } from "@/lib/types/types";

interface ArticlesFeedProps {
	posts: IPost[];
	uid?: string;
}

export const ArticlesFeed: React.FC<ArticlesFeedProps> = ({
	posts,
	uid = "",
}) => {
	return (
		<>
			{posts.map((post, idx) => (
				<ArticleCard
					key={idx}
					article={post}
					uid={uid}
				/>
			))}
		</>
	);
};
