import { Box, Button, Text, Center } from "@chakra-ui/react";
import { Image } from "@chakra-ui/image";


function Hero({ title, subtitle }) {
  return (
    <Box position="relative" width="100%" height="100vh">
      <Image
        src="https://cdn.pixabay.com/photo/2019/07/29/22/35/landscape-4371647_1280.jpg"
        alt="tree-lake-pakistan-nature"
        width="100%"
        height="100vh"
        objectFit="cover"
      />
      <Center
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
      >
        <Box textAlign="center">
          <Text fontSize="2xl" fontWeight="bold" color="white">
            {title}
          </Text>
          <Text fontSize="xl" color="white">
            {subtitle}
          </Text>
          <Button mt={4}>Explore</Button>
        </Box>
      </Center>
    </Box>
  );
}

export default Hero;
