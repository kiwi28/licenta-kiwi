"use client";
import { ArticleEditor } from "@/modules";
import { Box } from "@chakra-ui/react";

const Admin: React.FC = () => {
	return (
		<Box pb={32}>
			<ArticleEditor />
		</Box>
	);
};

export default Admin;
