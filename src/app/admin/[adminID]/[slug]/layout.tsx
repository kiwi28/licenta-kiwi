import { Box } from "@chakra-ui/react";

export default function ArticleEditorLayout({
	children, // will be a page or nested layout
	params,
}: {
	children: React.ReactNode;
	params: { slug: string };
}) {
	// console.log("params din layout", params);
	return <Box pb={32}>{children}</Box>;
}
