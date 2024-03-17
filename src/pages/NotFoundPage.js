import { Box, Center, Heading, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function NotFoundPage() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <Center height="100vh">
      <Box
        textAlign="center"
        p={20}
        borderRadius="md"
        boxShadow="2xl"
      >
        <Heading mb={4} fontSize="6xl" color="gray.800">
          404
        </Heading>
        <Text fontSize="lg" mb={4} color="gray.600">
          Oops! The page you're looking for does not exist.
        </Text>
        <Button colorScheme="gray" onClick={goBack}>
          Go Back
        </Button>
      </Box>
    </Center>
  );
}

export default NotFoundPage;