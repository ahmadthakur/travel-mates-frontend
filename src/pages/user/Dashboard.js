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
  Container,
  Spinner,
  Flex,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Badge,
  Wrap,
  WrapItem,
  useColorModeValue,
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaCalendarAlt, FaBed, FaStickyNote } from "react-icons/fa";

function Dashboard({ navbar, footer }) {
  const [data, setData] = useState(null);
  const [trips, setTrips] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const bgColor = useColorModeValue("gray.50", "gray.800");
  const cardBgColor = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");

  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/users/users/dashboard`,
          { withCredentials: true }
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to load user data. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchData();
  }, [toast]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
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
      } catch (error) {
        console.error("Error fetching trips:", error);
        toast({
          title: "Error",
          description: "Failed to load trips. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchTrips();
  }, [toast]);

  const handleDelete = async (tripId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/api/trips/trips/${tripId}`,
        { withCredentials: true }
      );
      setTrips(trips.filter((trip) => trip.id !== tripId));
      toast({
        title: "Trip deleted",
        description: "The trip has been successfully deleted.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to delete trip:", error);
      toast({
        title: "Error",
        description: "Failed to delete trip. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEdit = (tripId) => {
    navigate(`/edit-trip/${tripId}`);
  };

  if (!data) {
    return (
      <Flex height="100vh" alignItems="center" justifyContent="center">
        <Spinner size="xl" color="teal.500" thickness="4px" />
      </Flex>
    );
  }

  return (
    <>
      {navbar}
      <Box bg={bgColor} minHeight="100vh" py={8} px={4} paddingBlockStart={{ base: 20, md: 40 }}>
        <Container maxW="container.xl">
          <VStack spacing={8} align="stretch">
            <Stack direction={{ base: "column", md: "row" }} alignItems="center" justifyContent="space-between" spacing={4}>
              <Flex alignItems="center">
                <Avatar
                  name={`${data.user.first_name} ${data.user.last_name}`}
                  size={{ base: "lg", md: "xl" }}
                  bg="teal.500"
                  mr={4}
                />
                <VStack align="start" spacing={1}>
                  <Heading as="h1" size={{ base: "lg", md: "xl" }} color={textColor}>
                    Welcome, {data.user.username}!
                  </Heading>
                  <Text color="gray.500" fontSize={{ base: "sm", md: "md" }}>Manage your trips and explore new destinations</Text>
                </VStack>
              </Flex>
              <Button colorScheme="teal" onClick={() => navigate("/destinations")} size={{ base: "sm", md: "md" }}>
                Plan New Trip
              </Button>
            </Stack>

            <Box bg={cardBgColor} p={{ base: 4, md: 6 }} borderRadius="lg" boxShadow="md">
              <Heading as="h2" size={{ base: "md", md: "lg" }} mb={4} color={textColor}>
                Your Upcoming Trips
              </Heading>
              {trips.length > 0 ? (
                isMobile ? (
                  <VStack spacing={4} align="stretch">
                    {trips.map((trip) => (
                      <Box key={trip.id} p={4} borderWidth={1} borderRadius="md">
                        <Flex alignItems="center" mb={2}>
                          <Icon as={FaMapMarkerAlt} color="teal.500" mr={2} />
                          <Text fontWeight="medium">{trip.destination?.name || 'N/A'}</Text>
                        </Flex>
                        <Text fontSize="sm" mb={1}><strong>Trip Name:</strong> {trip.trip_name}</Text>
                        <Flex alignItems="center" mb={1}>
                          <Icon as={FaCalendarAlt} color="teal.500" mr={2} />
                          <Text fontSize="sm">{trip.start_date} - {trip.end_date}</Text>
                        </Flex>
                        <Flex alignItems="center" mb={2}>
                          <Icon as={FaBed} color="teal.500" mr={2} />
                          <Text fontSize="sm">{trip.trip_accommodation}</Text>
                        </Flex>
                        <Flex justifyContent="space-between">
                          <Button size="sm" leftIcon={<EditIcon />} onClick={() => handleEdit(trip.id)}>
                            Edit
                          </Button>
                          <Button size="sm" leftIcon={<DeleteIcon />} onClick={() => handleDelete(trip.id)} colorScheme="red">
                            Delete
                          </Button>
                        </Flex>
                      </Box>
                    ))}
                  </VStack>
                ) : (
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Destination</Th>
                        <Th>Trip Name</Th>
                        <Th>Dates</Th>
                        <Th>Accommodation</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {trips.map((trip) => (
                        <Tr key={trip.id}>
                          <Td>
                            <Flex alignItems="center">
                              <Icon as={FaMapMarkerAlt} color="teal.500" mr={2} />
                              <Text fontWeight="medium">{trip.destination?.name || 'N/A'}</Text>
                            </Flex>
                          </Td>
                          <Td>{trip.trip_name}</Td>
                          <Td>
                            <Flex alignItems="center">
                              <Icon as={FaCalendarAlt} color="teal.500" mr={2} />
                              <Text>{trip.start_date} - {trip.end_date}</Text>
                            </Flex>
                          </Td>
                          <Td>
                            <Flex alignItems="center">
                              <Icon as={FaBed} color="teal.500" mr={2} />
                              <Text>{trip.trip_accommodation}</Text>
                            </Flex>
                          </Td>
                          <Td>
                            <Menu>
                              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} size="sm">
                                Actions
                              </MenuButton>
                              <MenuList>
                                <MenuItem icon={<EditIcon />} onClick={() => handleEdit(trip.id)}>
                                  Edit
                                </MenuItem>
                                <MenuItem icon={<DeleteIcon />} onClick={() => handleDelete(trip.id)}>
                                  Delete
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                )
              ) : (
                <Text color="gray.500">You don't have any upcoming trips. Start planning your next adventure!</Text>
              )}
            </Box>

            <Box bg={cardBgColor} p={{ base: 4, md: 6 }} borderRadius="lg" boxShadow="md">
              <Heading as="h2" size={{ base: "md", md: "lg" }} mb={4} color={textColor}>
                Trip Statistics
              </Heading>
              <Wrap spacing={4}>
                <WrapItem>
                  <Badge colorScheme="teal" p={2} borderRadius="md">
                    Total Trips: {trips.length}
                  </Badge>
                </WrapItem>
                <WrapItem>
                  <Badge colorScheme="blue" p={2} borderRadius="md">
                    Upcoming Trips: {trips.filter(trip => new Date(trip.start_date) > new Date()).length}
                  </Badge>
                </WrapItem>
                <WrapItem>
                  <Badge colorScheme="purple" p={2} borderRadius="md">
                    Completed Trips: {trips.filter(trip => new Date(trip.end_date) < new Date()).length}
                  </Badge>
                </WrapItem>
              </Wrap>
            </Box>
          </VStack>
        </Container>
      </Box>
      {footer}
    </>
  );
}

export default Dashboard;