"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Box, VStack, useColorModeValue } from "@chakra-ui/react";

import { Header } from "./Header";

import { CM_LAYOUT, CM_TEXT } from "@/constants";
import { useUserDataCtx } from "@/lib/hooks";

export const PageLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
	const pathName = usePathname();
	const router = useRouter();

	const { user, username, isLoadingUser } = useUserDataCtx();

	if (user && !username && !isLoadingUser && pathName !== "/register") {
		router.push("/register");
	}

	const txtColor = useColorModeValue(...CM_TEXT);
	const layoutColor = useColorModeValue(...CM_LAYOUT);

	return (
		// <>
		// 	{loading ? (
		// 		<Loader />
		// 	) : (
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
				{children}
			</Box>
		</VStack>
		// 	)}
		// </>
	);
};
