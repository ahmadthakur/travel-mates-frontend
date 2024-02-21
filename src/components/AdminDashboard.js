import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  VStack,
  Button,
  Heading,
  Text,
  useToast,
  Center,
  Spinner,
  StackDivider,
  Spacer,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [data, setData] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/admin/admin/dashboard`,
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
        `${process.env.REACT_APP_SERVER_URL}/admin/admin/logout`,
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
      <Box w="400px" p={4} boxShadow="lg" rounded="md" bg="white">
        <VStack spacing={5} align="start">
          <Heading size="lg">Welcome, {data.admin.username}!</Heading>
        </VStack>
        <VStack
          divider={<StackDivider borderColor="gray.200" />}
          spacing={4}
          align="stretch"
          mt={5}
        >
          <Button onClick={() => navigate("/admin/users")} colorScheme="blue">
            Users
          </Button>

          <Button
            onClick={() => navigate("/accommodations")}
            colorScheme="blue"
          >
            Accommodations
          </Button>
          <Button
            onClick={() => navigate("/admin/destinations")}
            colorScheme="blue"
          >
            Destinations
          </Button>

          <Spacer />
          <Button onClick={handleLogout} colorScheme="teal" size="sm">
            Logout
          </Button>
        </VStack>
      </Box>
    </Center>
  );
}

export default AdminDashboard;
