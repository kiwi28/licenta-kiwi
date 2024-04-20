import { Loader } from "@/components";
import { db } from "@/lib/firebase";
import { IPost } from "@/lib/types/types";
import { ArticleEditor } from "@/modules";
import { SpinnerIcon } from "@chakra-ui/icons";
import { Box, Spinner, useToast } from "@chakra-ui/react";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { get } from "lodash";
import { notFound, redirect, useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { getAuth, onAuthStateChanged } from "firebase/auth";

export interface IEditArticleFields {
	title: string;
	content: string;
	published: boolean;
	imageURL: string;
}
interface IAdminProps {
	params: { slug: string; adminID: string };
}

const Admin: React.FC<IAdminProps> = async ({ params }) => {
	let article = {} as IPost;
	// const [loading, setLoading] = useState<boolean>(false);
	// const [article, setArticle] = useState<IPost>({} as IPost);

	// const toast = useToast();
	// const params = useParams();

	console.log("params", params);
	const { slug, adminID } = params;

	// const articleRef = useMemo(
	// 	() => doc(db, `users/${auth?.currentUser?.uid}/posts/${slug}`),
	// 	[slug]
	// );

	// setLoading(true);

	const articleRef = doc(db, `users/${adminID}/posts/${slug}`);
	const articleSnap = await getDoc(articleRef);

	if (articleSnap.exists()) {
		article = articleSnap.data() as IPost;
	} else {
		notFound();
	}
	// setLoading(false);

	// const getArticle = useCallback(async () => {
	// 	setLoading(true);

	// 	const articleSnap = await getDoc(articleRef);

	// 	if (articleSnap.exists()) {
	// 		const articleData = articleSnap.data() as IPost;
	// 		console.log({ articleData });
	// 		setArticle(articleData);
	// 	}
	// 	setLoading(false);
	// }, [articleRef]);

	// const onSubmit = useCallback(
	// 	async (data: IEditArticleFields) => {
	// 		await updateDoc(articleRef, {
	// 			content: data.content,
	// 			imageURL: data.imageURL,
	// 			published: data.published,
	// 			updatedAt: serverTimestamp(),
	// 		});

	// 		toast({
	// 			title: "Post updated",
	// 			status: "success",
	// 			description: "Post updated successfully!",
	// 		});

	// 		await getArticle();
	// 	},
	// 	[articleRef, toast, getArticle]
	// );

	// useEffect(() => {
	// 	getArticle().catch((err) => console.error("error editing article:", err));
	// }, [articleRef, getArticle]);

	// if (loading) return <Loader />;

	// if (!Object.keys(article).length) {
	// 	console.log(article);
	// 	return <Box color={"orange"}>Article not found!</Box>;
	// }

	// return <Box>Admin</Box>;

	return (
		<ArticleEditor
			article={article}
			// onSubmit={onSubmit}
			// getArticle={getArticle}
		/>
	);
};

export default Admin;
/* <ArticleEditor
				article={article}
				onSubmit={onSubmit}
				// getArticle={getArticle}
			/> */
