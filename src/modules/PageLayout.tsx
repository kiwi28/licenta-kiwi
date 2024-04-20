"use client";
import { usePathname, useRouter } from "next/navigation";

import { Box, Flex, VStack, useColorModeValue } from "@chakra-ui/react";

import { Header } from "./Header";

import { CM_LAYOUT, CM_TEXT } from "@/constants";
import { useUserDataCtx } from "@/lib/hooks";
import { Loader } from "@/components";

export const PageLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
	const txtColor = useColorModeValue(...CM_TEXT);
	const layoutColor = useColorModeValue(...CM_LAYOUT);

	return (
		<VStack
			w={"100%"}
			alignItems={"flex-start"}
			color={txtColor}
		>
			<Header />
			<Box
				minH={"100vh"}
				w={"100%"}
				backgroundColor={layoutColor}
				pt={28}
				px={["5vw", null, "15vw"]}
			>
				<Flex
					flexDirection={"column"}
					alignItems={"center"}
					justifyContent={"center"}
					pb={32}
				>
					{children}
				</Flex>
			</Box>
		</VStack>
	);
};
