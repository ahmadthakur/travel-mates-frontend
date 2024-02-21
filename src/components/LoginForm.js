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

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/users/users/login`,
        { username, password },
        { withCredentials: true }
      );
      console.log(response.data);
      localStorage.setItem("isLoggedIn", "true");

      navigate("/");
    } catch (error) {
      console.error(error);
      setErrorMessage("User does not exist or password is incorrect");
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
        maxHeight="600px"
        overflowY="auto"
      >
        <Heading size="lg" mb={4}>
          Welcome Back
        </Heading>

        {errorMessage && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            {errorMessage}
          </Alert>
        )}

        <VStack spacing={4}>
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
            Log In
          </Button>
        </VStack>
        <Text fontSize="lg" color="gray.500" mt={4}>
          Don't have an account?{" "}
          <Link to="/register" color="teal.500">
            Sign up
          </Link>
        </Text>
      </Box>
      <Link
        to="/admin/login"
        style={{ fontSize: "small", marginTop: "10px" }}
        colorScheme="teal"
      >
        Admin Login
      </Link>
    </Flex>
  );
}

export default LoginForm;
