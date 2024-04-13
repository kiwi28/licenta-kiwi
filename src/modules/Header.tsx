"use client";
import Image from "next/image";
import Link from "next/link";

import { User as IUser } from "firebase/auth";
// import { IUser } from "@/lib/types/types";

import {
	Box,
	Button,
	Flex,
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
	Text,
	useColorMode,
	useColorModeValue,
	useDisclosure,
	useMediaQuery,
} from "@chakra-ui/react";
// import { Link } from "@chakra-ui/next-js";
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

import { SignInButton, SignOutButton } from "@/components/Auth";
import { ArticleCreate } from "./ArticleCreate";

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
			<Flex
				as="header"
				p={6}
				w={"100%"}
				alignItems={"center"}
				position={"fixed"}
				backgroundColor={useColorModeValue(...CM_HEADER)}
				// backgroundColor={"teal.700"}
				zIndex={100}
				backdropFilter="saturate(180%) blur(10px)"
			>
				<Flex
					flexGrow={1}
					justifyContent={"flex-end"}
					alignItems={"center"}
				>
					<Link href={"/"}>
						<Image
							src="/vercel.svg"
							alt="Vercel Logo"
							height={8}
							width={32}
						/>
					</Link>
				</Flex>
				<Flex
					alignItems={"center"}
					flexGrow={2}
					px={4}
				>
					<SearchBar />
				</Flex>
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
			</Flex>
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
}

const HeaderMobileButtons: React.FC<HeaderButtonsProps> = ({
	user,
	username,
}) => {
	const { toggleColorMode } = useColorMode();
	const btnBg = useColorModeValue(...CM_BUTTON_MAIN);
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
						<Link href={username}>
							<Button
								backgroundColor={btnBg}
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
					<MenuItem background={"transparent"}>
						<IconButton
							aria-label="toggle color mode"
							background={"transparent"}
							icon={darkModeIcon}
							onClick={toggleColorMode}
						/>
					</MenuItem>
				)}
			</MenuList>
		</Menu>
	);
};

const SearchBar: React.FC = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
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
					placeholder="Search an article ..."
					// _placeholder={{ color: "gray.100", opacity: 0.8 }}
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
								_focusVisible={{ outline: "none" }}
								border={"none"}
								backgroundColor={useColorModeValue(...CM_INPUT)}
								placeholder="Search an article ..."
								// _placeholder={{ color: "gray.100", opacity: 0.8 }}
								// TODO: add search and filter logic here
							/>
						</InputGroup>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

// const HeaderDesktopButtons: React.FC<HeaderButtonsProps> = ({ isUser }) => {
// 	const { toggleColorMode } = useColorMode();
// 	const btnBg = useColorModeValue(...CM_BUTTON_CONTRAST);
// 	const btnColor = useColorModeValue(...CM_TEXT);

// 	return (
// 		<>
// 			{isUser ? (
// 				<>
// 					<Button
// 						// colorScheme="teal"
// 						backgroundColor={btnBg}
// 						color={btnColor}
// 						leftIcon={<AddIcon color={btnColor} />}
// 					>
// 						New Post
// 					</Button>
// 					<Button
// 						color={btnColor}
// 						background={"transparent"}
// 					>
// 						Log Out
// 					</Button>
// 				</>
// 			) : (
// 				<>
// 					<Button>Log In</Button>
// 					<Button>Register</Button>
// 				</>
// 			)}
// 			<IconButton
// 				aria-label="toggle color mode"
// 				background={"transparent"}
// 				icon={useColorModeValue(<MoonIcon />, <SunIcon />)}
// 				onClick={toggleColorMode}
// 			/>
// 		</>
// 	);
// };
