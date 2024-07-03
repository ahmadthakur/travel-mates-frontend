import { Box, Button, Text, VStack, Heading } from "@chakra-ui/react";
import { Image } from "@chakra-ui/image";
import { Link } from "react-scroll";

function Hero({ title, subtitle }) {
  return (
    <Box position="relative" width="100%" height="100vh">
      <Image
        src="https://cdn.pixabay.com/photo/2019/07/29/22/35/landscape-4371647_1280.jpg"
        alt="Scenic landscape with tree and lake"
        width="100%"
        height="100%"
        objectFit="cover"
      />
      <Box
        position="absolute"
        top="0"
        left="0"
        width="100%"
        height="100%"
        bg="rgba(0, 0, 0, 0.5)"  // Add a semi-transparent overlay
      />
      <VStack
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        spacing={6}
        width="90%"
        maxWidth="800px"
      >
        <Heading
          as="h1"
          size="2xl"
          color="white"
          textAlign="center"
          textShadow="2px 2px 4px rgba(0,0,0,0.5)"
        >
          {title}
        </Heading>
        <Text
          fontSize="xl"
          color="white"
          textAlign="center"
          textShadow="1px 1px 2px rgba(0,0,0,0.5)"
        >
          {subtitle}
        </Text>
        <Link to="destinations" smooth={true} duration={500}>
          <Button
            size="lg"
            colorScheme="teal"
            mt={8}
            px={8}
            py={6}
            fontSize="xl"
            fontWeight="bold"
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "xl",
            }}
            transition="all 0.2s"
          >
            Explore Now
          </Button>
        </Link>
      </VStack>
    </Box>
  );
}

export default Hero;