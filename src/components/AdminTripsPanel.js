import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  Heading,
  Text,
  Table,
  Tbody,
  Thead,
  Td,
  Tr,
  Th,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import axios from "axios";

const AdminTripsPanel = () => {
  const { userId } = useParams();
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/trips/trips/${userId}`,
        { withCredentials: true }
      );
      setTrips(response.data);
    };

    fetchData();
  }, [userId]);

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
                <Button leftIcon={<EditIcon />} colorScheme="teal">
                  Edit
                </Button>
              </Td>
              <Td>
                <Button leftIcon={<DeleteIcon />} colorScheme="red">
                  Delete
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default AdminTripsPanel;
