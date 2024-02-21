import { Box, Center, Heading, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function NotFoundPage() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <Center height="100vh" bg="gray.100">
      <Box
        textAlign="center"
        p={10}
        bg="white"
        borderRadius="md"
        boxShadow="lg"
      >
        <Heading mb={4}>404</Heading>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-alert-octagon"
        >
          <polygon points="10 2 2 10 2 14 10 22 14 22 22 14 22 10 14 2"></polygon>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12" y2="16"></line>
        </svg>
        <Text fontSize="xl" mb={4}>
          Oops! The page you're looking for does not exist.
        </Text>
        <Button colorScheme="teal" onClick={goBack}>
          Go Back
        </Button>
      </Box>
    </Center>
  );
}

export default NotFoundPage;
