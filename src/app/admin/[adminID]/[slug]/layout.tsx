import { Box } from "@chakra-ui/react";

export default function ArticleEditorLayout({
	children, // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return <Box pb={32}>{children}</Box>;
}
