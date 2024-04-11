import { Box } from "@chakra-ui/react";
// import Image from "next/image";

import { ArticleCard } from "@/modules";

export default function Home() {
	return (
		<>
			{new Array(2).fill(0).map((_, idx) => (
				<Box
					pb={8}
					key={idx}
				>
					<ArticleCard
						tags={[
							"architecture",
							"code-writing",
							"programming",
							"structure",
							"begginer",
							"programming",
							"structure",
							"begginer",
						]}
					/>
				</Box>
			))}
		</>
	);
}
