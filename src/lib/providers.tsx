"use client";

import { ChakraProvider } from "@chakra-ui/react";

import theme from "@/theme";
import { UserContext } from "@/lib/context";
import { useUserDataFireBase } from "@/lib/hooks";

export function Providers({ children }: { children: React.ReactNode }) {
	const userData = useUserDataFireBase();
	return (
		<UserContext.Provider value={userData}>
			<ChakraProvider theme={theme}>{children}</ChakraProvider>
		</UserContext.Provider>
	);
}
