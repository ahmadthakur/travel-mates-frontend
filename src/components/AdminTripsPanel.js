import React, { useEffect, useState } from "react";
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
  HStack,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import axios from "axios";

const AdminTripsPanel = () => {
  const { userId } = useParams();
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const toast = useToast();

  const [destinationId, setDestinationId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");

  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();

  const fetchTrips = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}/api/trips/trips/${userId}`,
      { withCredentials: true }
    );
    setTrips(response.data);
  };

  useEffect(() => {
    fetchTrips();
  }, [userId]);

  const handleEdit = (trip) => {
    setSelectedTrip(trip);
    setDestinationId(trip.destination_id);
    setStartDate(trip.start_date);
    setEndDate(trip.end_date);
    setNotes(trip.notes);
    onOpenEdit();
  };

  const handleUpdate = async (updatedTrip) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/api/trips/admin/trips/${updatedTrip.id}`,
        updatedTrip,
        { withCredentials: true }
      );
      toast({
        title: "Trip updated.",
        description: "The trip has been successfully updated.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      fetchTrips();
    } catch (error) {
      console.error("Failed to update trip:", error);
    }
  };

  const handleDelete = async (tripId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/api/trips/admin/trips/${tripId}`,
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

  return (
    <Box p={5}>
      <Heading mb={5}>User's Trips</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Destination ID</Th>
            <Th>Start Date</Th>
            <Th>End Date</Th>
            <Th>Notes</Th>
            <Th>Edit</Th>
            <Th>Delete</Th>
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
                  onClick={() => handleEdit(trip)}
                >
                  Edit
                </Button>
              </Td>
              <Td>
                <Button
                  leftIcon={<DeleteIcon />}
                  colorScheme="red"
                  onClick={() => handleDelete(trip.id)}
                >
                  Delete
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Modal isOpen={isOpenEdit} onClose={onCloseEdit}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Trip</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Destination ID</FormLabel>
              <Input
                placeholder="Destination ID"
                value={destinationId}
                onChange={(event) => setDestinationId(event.target.value)}
              />
              <FormLabel>Start Date</FormLabel>
              <Input
                placeholder="Start Date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
              />
              <FormLabel>End Date</FormLabel>
              <Input
                placeholder="End Date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
              />
              <FormLabel>Notes</FormLabel>
              <Input
                placeholder="Notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={async () => {
                const updatedTrip = {
                  id: selectedTrip.id,
                  destination_id: destinationId,
                  start_date: startDate,
                  end_date: endDate,
                  notes: notes,
                };
                await handleUpdate(updatedTrip);
                onCloseEdit();
              }}
            >
              Save
            </Button>
            <Button variant="ghost" onClick={onCloseEdit}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AdminTripsPanel;
