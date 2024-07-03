"use client";
import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User as IUser } from "firebase/auth";
import {
	collectionGroup,
	getDocs,
	query,
	orderBy,
	where,
} from "firebase/firestore";

import {
	Box,
	Button,
	Flex,
	Grid,
	GridItem,
	IconButton,
	Input,
	InputGroup,
	InputLeftElement,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Modal,
	ModalBody,
	ModalContent,
	ModalOverlay,
	SimpleGrid,
	Text,
	useColorMode,
	useColorModeValue,
	useDisclosure,
	useMediaQuery,
} from "@chakra-ui/react";
import {
	AddIcon,
	HamburgerIcon,
	MoonIcon,
	SearchIcon,
	SunIcon,
} from "@chakra-ui/icons";

import {
	CM_BUTTON_CONTRAST,
	CM_BUTTON_MAIN,
	CM_HEADER,
	CM_INPUT,
	CM_LAYOUT,
	CM_TEXT,
} from "@/constants";
import { useUserDataCtx } from "@/lib/hooks";
import { db, postToJson } from "@/lib/firebase";
import { IPost } from "@/lib/types/types";

import { SignInButton, SignOutButton } from "@/components/Auth";
import { ArticleCreate } from "./Article/ArticleCreate";
import { Loader } from "@/components";
import { SearchResult } from "./Article/SearchResult";

export const Header: React.FC = () => {
	const { toggleColorMode } = useColorMode();
	const { user, username } = useUserDataCtx();
	const { isOpen, onOpen, onClose } = useDisclosure();

	const btnBg = useColorModeValue(...CM_BUTTON_CONTRAST);
	const btnColor = useColorModeValue(...CM_TEXT);
	const darkModeIcon = useColorModeValue(<MoonIcon />, <SunIcon />);

	const [isDesktop] = useMediaQuery("(min-width: 768px)");

	return (
		<>
			<Grid
				templateColumns={["repeat(8, 1fr)", null, null, "repeat(3, 1fr)"]}
				as="header"
				p={[2, null, 4]}
				w={"100%"}
				alignItems={"center"}
				position={"fixed"}
				backgroundColor={useColorModeValue(...CM_HEADER)}
				zIndex={100}
				backdropFilter="saturate(180%) blur(10px)"
			>
				<GridItem colSpan={1}>
					<Flex
						flexGrow={1}
						justifyContent={"flex-end"}
						alignItems={"center"}
					>
						<Link href={"/"}>
							<Image
								src="/kiwi-chirp-logo.png"
								alt="Kiwi Chirp Logo"
								height={32}
								width={70}
							/>
						</Link>
					</Flex>
				</GridItem>
				<GridItem colSpan={[6, null, null, 1]}>
					<Flex
						// w={"30rem"}
						alignItems={"center"}
						flexGrow={2}
						px={4}
					>
						<SearchBar />
					</Flex>
				</GridItem>
				<GridItem colSpan={1}>
					<Flex
						alignItems={"center"}
						flexGrow={1}
						gap={4}
					>
						{isDesktop && (
							<Button
								backgroundColor={btnBg}
								color={btnColor}
								leftIcon={<AddIcon color={btnColor} />}
								onClick={onOpen}
							>
								New Post
							</Button>
						)}
						{user && username ? (
							<HeaderMobileButtons
								user={user}
								username={username}
								openCreatePost={onOpen}
							/>
						) : (
							<SignInButton />
						)}
						{isDesktop && (
							<IconButton
								aria-label="toggle color mode"
								background={"transparent"}
								icon={darkModeIcon}
								onClick={toggleColorMode}
								fontSize={"2xl"}
							/>
						)}
					</Flex>
				</GridItem>
			</Grid>
			<ArticleCreate
				isOpen={isOpen}
				onClose={onClose}
			/>
		</>
	);
};

interface UserAvatarButtonProps {
	user: IUser;
	username: string;
}

const UserAvatarButton: React.FC<UserAvatarButtonProps> = ({
	user,
	username,
}) => {
	return (
		<Box>
			<Image
				src={user?.photoURL || ""}
				alt={username || "user_profile_image"}
				height={40}
				width={40}
				style={{ borderRadius: "50%", border: "2px solid white" }}
			/>
		</Box>
	);
};

interface HeaderButtonsProps {
	user: IUser;
	username: string;
	openCreatePost: () => void;
}

const HeaderMobileButtons: React.FC<HeaderButtonsProps> = ({
	user,
	username,
	openCreatePost,
}) => {
	const { toggleColorMode } = useColorMode();
	const btnBg = useColorModeValue(...CM_BUTTON_MAIN);
	const bgColorContrast = useColorModeValue(...CM_BUTTON_CONTRAST);
	const btnColor = useColorModeValue(...CM_TEXT);
	const darkModeIcon = useColorModeValue(<MoonIcon />, <SunIcon />);

	const [isDesktop] = useMediaQuery("(min-width: 768px)");

	return (
		<Menu>
			<MenuButton>
				{isDesktop ? (
					<UserAvatarButton
						username={username}
						user={user}
					/>
				) : (
					<IconButton
						as={"div"}
						fontSize={"4xl"}
						aria-label="user profile"
						icon={<HamburgerIcon />}
						background={"transparent"}
					/>
				)}
			</MenuButton>
			<MenuList backgroundColor={useColorModeValue(...CM_LAYOUT)}>
				<MenuItem>
					<Text>{username}</Text>
				</MenuItem>
				<MenuItem background={"transparent"}>
					{isDesktop ? (
						<Link href={`/${username}`}>
							<Button
								as={"div"}
								backgroundColor={bgColorContrast}
								color={btnColor}
								leftIcon={<AddIcon color={btnColor} />}
							>
								My Profile
							</Button>
						</Link>
					) : (
						<UserAvatarButton
							username={username}
							user={user}
						/>
					)}
				</MenuItem>

				<MenuItem
					color={btnColor}
					background={"transparent"}
				>
					<SignOutButton />
				</MenuItem>
				{!isDesktop && (
					<>
						<MenuItem background={"transparent"}>
							<Button
								backgroundColor={bgColorContrast}
								color={btnColor}
								leftIcon={<AddIcon color={btnColor} />}
								onClick={openCreatePost}
							>
								New Post
							</Button>
						</MenuItem>
						<MenuItem background={"transparent"}>
							<IconButton
								as={"div"}
								aria-label="toggle color mode"
								background={"transparent"}
								icon={darkModeIcon}
								onClick={toggleColorMode}
							/>
						</MenuItem>
					</>
				)}
			</MenuList>
		</Menu>
	);
};

const SearchBar: React.FC = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(false);
	const [results, setResults] = useState([] as IPost[]);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const pathname = usePathname();

	useEffect(() => {
		setLoading(true);
		const debouncedSearch = async () => {
			if (searchTerm.length < 3) {
				setResults([]);
				return;
			}

			const resultsQuery = query(
				collectionGroup(db, "posts"),
				where("published", "==", true),
				orderBy("createdAt", "desc")
			);

			const results = (await getDocs(resultsQuery)).docs.map(postToJson);
			setResults(
				results.filter(
					(article) =>
						article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
						article.username.toLowerCase().includes(searchTerm.toLowerCase())
				)
			);
		};
		debouncedSearch().then(() => setLoading(false));
	}, [searchTerm]);

	useEffect(() => {
		setSearchTerm("");
		onClose();
	}, [onClose, pathname]);

	return (
		<>
			<InputGroup onClick={onOpen}>
				<InputLeftElement
					pointerEvents="none"
					fontSize="1.2em"
				>
					<SearchIcon h={4} />
				</InputLeftElement>
				<Input
					border={"none"}
					backgroundColor={useColorModeValue(...CM_INPUT)}
					placeholder="Search an article or author ..."
					isReadOnly
					cursor={"pointer"}
				/>
			</InputGroup>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
			>
				<ModalOverlay />
				<ModalContent backgroundColor={useColorModeValue(...CM_INPUT)}>
					<ModalBody>
						<InputGroup onClick={onOpen}>
							<InputLeftElement
								pointerEvents="none"
								fontSize="2em"
							>
								<SearchIcon h={4} />
							</InputLeftElement>
							<Input
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								_focusVisible={{ outline: "none" }}
								border={"none"}
								backgroundColor={useColorModeValue(...CM_INPUT)}
								placeholder="Search an article or author ..."
							/>
						</InputGroup>
						<Box>
							{loading ? (
								<Loader />
							) : (
								results.map((article, idx) => (
									<SearchResult
										key={idx}
										article={article}
									/>
								))
							)}
						</Box>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};
