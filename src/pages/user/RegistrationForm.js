import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Box,
  Flex,
  Heading,
  Text,
  Alert,
  AlertIcon,
  chakra,
} from "@chakra-ui/react";

const Link = chakra(RouterLink);

function RegistrationForm() {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/users/users/register`,
        { first_name, last_name, email, username, password },
        { withCredentials: true }
      );
      console.log(response.data);
      navigate("/login");
    } catch (error) {
      console.error(error);
      setErrorMessage("Registration failed");
    }
  };

  return (
    <Flex
      as="form"
      onSubmit={handleSubmit}
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      bg="gray.50"
      minHeight="100vh"
    >
      <Box
        p={8}
        boxShadow="lg"
        borderRadius="lg"
        bg="white"
        maxWidth="400px"
        width="100%"
      >
        <Heading size="lg" mb={4}>
          Create Account
        </Heading>
        {errorMessage && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            {errorMessage}
          </Alert>
        )}
        <VStack spacing={4}>
          <FormControl id="firstName">
            <FormLabel>First Name</FormLabel>
            <Input
              type="text"
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
              borderRadius="md"
            />
          </FormControl>
          <FormControl id="lastName">
            <FormLabel>Last Name</FormLabel>
            <Input
              type="text"
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
              borderRadius="md"
            />
          </FormControl>
          <FormControl id="email">
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              borderRadius="md"
            />
          </FormControl>
          <FormControl id="username">
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              borderRadius="md"
            />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              borderRadius="md"
            />
          </FormControl>
          <Button
            type="submit"
            colorScheme="teal"
            size="lg"
            fontSize="md"
            width="100%"
          >
            Register
          </Button>
        </VStack>
        <Text fontSize="lg" color="gray.500" mt={4}>
          Already have an account?{" "}
          <Link to="/login" color="teal.500">
            Log in
          </Link>
        </Text>
      </Box>
    </Flex>
  );
}

export default RegistrationForm;
