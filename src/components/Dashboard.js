import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  VStack,
  Button,
  Heading,
  Text,
  useToast,
  Avatar,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [data, setData] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/users/dashboard`,
          { withCredentials: true }
        );
        setData(response.data);
      } catch (error) {
        console.error(error);
        // Handle error here
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/users/logout`,
        {},
        { withCredentials: true }
      );
      toast({
        title: "Logged out successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast({
        title: "Logout failed.",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (!data) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <Spinner
          size="xl"
          speed="0.65s"
          color="blue.500"
          emptyColor="gray.200"
          thickness="4px"
        />
        <Text mt={4} fontSize="lg" fontWeight="semibold" color="gray.500">
          Loading...
        </Text>
      </Box>
    );
  }

  return (
    <Center height="100vh">
      <VStack spacing={5} align="start">
        <Avatar
          name={`${data.user.first_name} ${data.user.last_name}`}
          size="xl"
        />
        <Heading>Welcome, {data.user.username}!</Heading>
        <Text>Your email is {data.user.email}</Text>
        <Button onClick={handleLogout} colorScheme="teal">
          Logout
        </Button>
      </VStack>
    </Center>
  );
}

export default Dashboard;
