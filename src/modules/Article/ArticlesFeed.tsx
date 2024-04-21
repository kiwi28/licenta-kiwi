import { ArticleCard } from "..";
import { IPost } from "@/lib/types/types";

interface ArticlesFeedProps {
	posts: IPost[];
	uidUser?: string;
	setRefresh?: (value: number) => void;
}

export const ArticlesFeed: React.FC<ArticlesFeedProps> = ({
	posts,
	uidUser = "",
	setRefresh = () => {},
}) => {
	return (
		<>
			{posts.map((post, idx) => (
				<ArticleCard
					key={idx}
					article={post}
					uidUser={uidUser}
					setRefresh={setRefresh}
				/>
			))}
		</>
	);
};
