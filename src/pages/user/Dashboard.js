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
  SimpleGrid,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

function Dashboard() {
  const [data, setData] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/users/users/dashboard`,
          { withCredentials: true }
        );
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchTrips = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/trips/trips`,
        { withCredentials: true }
      );
      const tripsWithDestinations = await Promise.all(
        response.data.map(async (trip) => {
          try {
            const destinationResponse = await axios.get(
              `${process.env.REACT_APP_SERVER_URL}/api/destinations/destinations/${trip.destination_id}`
            );
            return { ...trip, destination: destinationResponse.data };
          } catch (error) {
            console.error("Error fetching destination data:", error);
            return trip;
          }
        })
      );
      setTrips(tripsWithDestinations);
    };

    fetchTrips();
  }, []);

  const handleDelete = async (tripId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/api/trips/trips/${tripId}`,
        { withCredentials: true }
      );
      setTrips(trips.filter((trip) => trip.id !== tripId));
      toast({
        title: "Trip deleted.",
        description: "The trip has been successfully deleted.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to delete trip:", error);
    }
  };

  const handleEdit = (tripId) => {
    navigate(`/edit-trip/${tripId}`);
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
    <Center height="100vh" bg="gray.100">
      <VStack spacing={8} align="start">
        <Avatar
          name={`${data.user.first_name} ${data.user.last_name}`}
          size="xl"
          bg="teal.500"
        />
        <Heading as="h1" size="xl" color="teal.800">
          Welcome, {data.user.username}!
        </Heading>
        <Text fontSize="lg" color="gray.600">
          Your email is {data.user.email}
        </Text>
        <Heading as="h2" size="lg" color="teal.600">
          Your Trips
        </Heading>
        <SimpleGrid columns={3} spacing={8}>
          {trips.map((trip) => (
            <Box
              key={trip.id}
              bg="white"
              p={4}
              shadow="md"
              borderWidth="1px"
              borderRadius="md"
            >
              <Heading as="h3" size="md" color="teal.700">
                {trip.destination.name}
              </Heading>
              <Text mt={3} fontSize="sm" color="gray.500">
                {trip.start_date} - {trip.end_date}
              </Text>
              <Text mt={3} fontSize="sm" color="gray.500">
                Notes: {trip.notes}
              </Text>
              <Button
                leftIcon={<EditIcon />}
                colorScheme="teal"
                mt={3}
                onClick={() => handleEdit(trip.id)}
              >
                Edit
              </Button>
              <Button
                leftIcon={<DeleteIcon />}
                colorScheme="red"
                mt={3}
                onClick={() => handleDelete(trip.id)}
              >
                Delete
              </Button>
            </Box>
          ))}
        </SimpleGrid>
      </VStack>
    </Center>
  );
}

export default Dashboard;
