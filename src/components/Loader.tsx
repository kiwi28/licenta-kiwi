import { Flex, Spinner } from "@chakra-ui/react";

export const Loader: React.FC = () => {
	return (
		<Flex
			my={32}
			placeContent={"center"}
		>
			<Spinner />
		</Flex>
	);
};
