"use client";
import { Box, VStack, useColorModeValue } from "@chakra-ui/react";
import { Header } from "./Header";
import { CM_LAYOUT, CM_TEXT } from "@/constants";

export const PageLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
	return (
		<VStack
			w={"100%"}
			alignItems={"flex-start"}
			color={useColorModeValue(...CM_TEXT)}
		>
			<Header />
			<Box
				w={"100%"}
				backgroundColor={useColorModeValue(...CM_LAYOUT)}
				pt={28}
				px={["5vw", null, "15vw"]}
			>
				{children}
			</Box>
		</VStack>
	);
};
