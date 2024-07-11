import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  Heading,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  Container,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import axios from "axios";

const AdminTripsPanel = () => {
  const { userId } = useParams();
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");

  const [formData, setFormData] = useState({
    destination_id: "",
    start_date: "",
    end_date: "",
    notes: "",
  });

  const fetchTrips = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/trips/trips/${userId}`,
        { withCredentials: true }
      );
      setTrips(response.data);
    } catch (error) {
      console.error("Failed to fetch trips:", error);
      showToast("Error fetching trips", "error");
    }
  }, [userId]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const showToast = (title, status, description = "") => {
    toast({
      title,
      description,
      status,
      duration: 5000,
      isClosable: true,
    });
  };

  const handleEdit = (trip) => {
    setSelectedTrip(trip);
    setFormData({
      destination_id: trip.destination_id,
      start_date: trip.start_date,
      end_date: trip.end_date,
      notes: trip.notes,
    });
    onOpen();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/api/trips/admin/trips/${selectedTrip.id}`,
        { ...formData, id: selectedTrip.id },
        { withCredentials: true }
      );
      showToast("Trip updated", "success", "The trip has been successfully updated.");
      fetchTrips();
      onClose();
    } catch (error) {
      console.error("Failed to update trip:", error);
      showToast("Error updating trip", "error");
    }
  };

  const handleDelete = async (tripId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/api/trips/admin/trips/${tripId}`,
        { withCredentials: true }
      );
      setTrips(trips.filter((trip) => trip.id !== tripId));
      showToast("Trip deleted", "success", "The trip has been successfully deleted.");
    } catch (error) {
      console.error("Failed to delete trip:", error);
      showToast("Error deleting trip", "error");
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading color={textColor}>User's Trips (User ID: {userId})</Heading>
        <Box overflowX="auto" bg={bgColor} borderRadius="lg" boxShadow="md">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Destination ID</Th>
                <Th>Start Date</Th>
                <Th>End Date</Th>
                <Th>Notes</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {trips.map((trip) => (
                <Tr key={trip.id}>
                  <Td>{trip.destination_id}</Td>
                  <Td>{trip.start_date}</Td>
                  <Td>{trip.end_date}</Td>
                  <Td>{trip.notes}</Td>
                  <Td>
                    <Button
                      leftIcon={<EditIcon />}
                      colorScheme="teal"
                      size="sm"
                      mr={2}
                      onClick={() => handleEdit(trip)}
                    >
                      Edit
                    </Button>
                    <Button
                      leftIcon={<DeleteIcon />}
                      colorScheme="red"
                      size="sm"
                      onClick={() => handleDelete(trip.id)}
                    >
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Trip</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              {Object.entries(formData).map(([key, value]) => (
                <FormControl key={key}>
                  <FormLabel>{key.replace('_', ' ').toUpperCase()}</FormLabel>
                  <Input
                    name={key}
                    value={value}
                    onChange={handleInputChange}
                  />
                </FormControl>
              ))}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleUpdate}>
              Save
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default AdminTripsPanel;