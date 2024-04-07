"use client";
import {
	Button,
	Flex,
	IconButton,
	Image,
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
	useColorMode,
	useColorModeValue,
	useDisclosure,
	useMediaQuery,
} from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import {
	AddIcon,
	HamburgerIcon,
	MoonIcon,
	SearchIcon,
	SunIcon,
} from "@chakra-ui/icons";
import {
	CM_BUTTON_CONTRAST,
	CM_HEADER,
	CM_INPUT,
	CM_LAYOUT,
	CM_TEXT,
} from "@/constants";

export const Header: React.FC = () => {
	const [isDesktop] = useMediaQuery("(min-width: 768px)");

	return (
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
				{isDesktop ? (
					<HeaderDesktopButtons isUser={true} />
				) : (
					<HeaderMobileButtons isUser={true} />
				)}
			</Flex>
		</Flex>
	);
};
interface HeaderButtonsProps {
	isUser: boolean;
}
const HeaderDesktopButtons: React.FC<HeaderButtonsProps> = ({ isUser }) => {
	const { toggleColorMode } = useColorMode();
	const btnBg = useColorModeValue(...CM_BUTTON_CONTRAST);
	const btnColor = useColorModeValue(...CM_TEXT);

	return (
		<>
			{isUser ? (
				<>
					<Button
						// colorScheme="teal"
						backgroundColor={btnBg}
						color={btnColor}
						leftIcon={<AddIcon color={btnColor} />}
					>
						New Post
					</Button>
					<Button
						color={btnColor}
						background={"transparent"}
					>
						Log Out
					</Button>
				</>
			) : (
				<>
					<Button>Log In</Button>
					<Button>Register</Button>
				</>
			)}
			<IconButton
				aria-label="toggle color mode"
				background={"transparent"}
				icon={useColorModeValue(<MoonIcon />, <SunIcon />)}
				onClick={toggleColorMode}
			/>
		</>
	);
};

const HeaderMobileButtons: React.FC<HeaderButtonsProps> = ({ isUser }) => {
	const { toggleColorMode } = useColorMode();
	const btnBg = useColorModeValue(...CM_BUTTON_CONTRAST);
	const btnColor = useColorModeValue(...CM_TEXT);

	const [isDesktop] = useMediaQuery("(min-width: 768px)");
	console.log("isDesktop", isDesktop);
	return (
		<Menu>
			<MenuButton>
				<HamburgerIcon
					h={8}
					w={8}
				/>
			</MenuButton>
			<MenuList backgroundColor={useColorModeValue(...CM_LAYOUT)}>
				<MenuItem background={"transparent"}>
					<IconButton
						aria-label="toggle color mode"
						background={"transparent"}
						icon={useColorModeValue(<MoonIcon />, <SunIcon />)}
						onClick={toggleColorMode}
					/>
				</MenuItem>
				{isUser ? (
					<>
						<MenuItem background={"transparent"}>
							<Button
								backgroundColor={btnBg}
								color={btnColor}
								leftIcon={<AddIcon color={btnColor} />}
							>
								New Post
							</Button>
						</MenuItem>
						<MenuItem
							color={btnColor}
							background={"transparent"}
						>
							Log Out
						</MenuItem>
					</>
				) : (
					<>
						<MenuItem background={"transparent"}>Log In</MenuItem>
						<MenuItem background={"transparent"}>Register</MenuItem>
					</>
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
