"use client";
import { Box, useColorModeValue } from "@chakra-ui/react";

export const Separator: React.FC = () => {
	return (
		<Box
			borderTop={"1px"}
			borderColor={useColorModeValue("blackAlpha.200", "whiteAlpha.200")}
			mb={4}
		/>
	);
};
