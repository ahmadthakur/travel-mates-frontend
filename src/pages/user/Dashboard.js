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
  Flex,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { FaMapMarkerAlt } from "react-icons/fa";

function Dashboard(props) {
  const [data, setData] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

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
    <>
      {props.navbar}
      <Center height="100vh" mt={20} mb={12}>
        <VStack spacing={8} align="start">
          <Avatar
            name={`${data.user.first_name} ${data.user.last_name}`}
            size="xl"
            bg="teal.500"
          />
          <Heading as="h1" size="xl" color="teal.800">
            Welcome, {data.user.username}!
          </Heading>

          <Heading as="h2" size="lg" color="teal.600">
            Your Trips
          </Heading>

          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Destination</Th>
                <Th>Booking ID</Th>
                <Th>Start Date</Th>
                <Th>End Date</Th>
                <Th>Notes</Th>
                <Th>Manage</Th>
              </Tr>
            </Thead>
            <Tbody>
              {trips.map((trip) => (
                <Tr key={trip.id}>
                  <Td> <Icon as={FaMapMarkerAlt} color="teal.700" boxSize={6} mr={4} />{trip.destination.name}</Td>
                  <Td>{trip.id}</Td>
                  <Td>{trip.start_date}</Td>
                  <Td>{trip.end_date}</Td>
                  <Td>{trip.notes}</Td>
                  <Td>
                    <Menu>
                      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                        Manage
                      </MenuButton>
                      <MenuList>
                        <MenuItem
                          icon={<EditIcon />}
                          onClick={() => handleEdit(trip.id)}
                        >
                          Edit
                        </MenuItem>
                        <MenuItem
                          icon={<DeleteIcon />}
                          onClick={() => handleDelete(trip.id)}
                        >
                          Delete
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </VStack>
      </Center>
    </>
  );
}

export default Dashboard;
