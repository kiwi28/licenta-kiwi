import { db } from "@/lib/firebase";
import { IPost } from "@/lib/types/types";
import { ArticleEditor } from "@/modules";
import { doc, getDoc } from "firebase/firestore";

interface IAdminProps {
	params: { slug: string; adminID: string };
}

const Admin: React.FC<IAdminProps> = async ({ params }) => {
	let article = {} as IPost;
	const { slug, adminID } = params;

	const articleRef = doc(db, `users/${adminID}/posts/${slug}`);
	const articleSnap = await getDoc(articleRef);

	if (articleSnap.exists()) {
		article = articleSnap.data() as IPost;
	}
	return <ArticleEditor article={article} />;
};

export default Admin;
