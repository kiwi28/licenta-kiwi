import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "../lib/providers";
import { PageLayout } from "@/modules";
import { ColorModeScript } from "@chakra-ui/react";
import theme from "@/theme";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<meta
				name="referrer"
				content="no-referrer"
			/>
			<body>
				<ColorModeScript initialColorMode={theme.config.initialColorMode} />
				<Providers>
					<PageLayout>{children}</PageLayout>
				</Providers>
			</body>
		</html>
	);
}
