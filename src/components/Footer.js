import { Box, Flex, Text } from '@chakra-ui/react';

function Footer() {
    return (
        <Box py={4}>
        <Flex justify="center" align="center">
            <Text fontSize="sm" color="gray.500">
            © 2022 Travel Mates. All rights reserved.
            </Text>
        </Flex>
        </Box>
        );
    }

    export default Footer;