import React, { useState, useEffect } from "react";
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
  Container,
  VStack,
  useColorModeValue,
  Textarea,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon, AddIcon } from "@chakra-ui/icons";
import axios from "axios";

const initialFormState = {
  name: "",
  country: "",
  city: "",
  description: "",
  attractions: "",
  recommended_activities: "",
  image_url: "",
  latitude: "",
  longitude: "",
};

function AdminDestinationsPanel() {
  const [destinations, setDestinations] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const toast = useToast();
  const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure();
  const { isOpen: isOpenNew, onOpen: onOpenNew, onClose: onCloseNew } = useDisclosure();

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/destinations/destinations`);
      setDestinations(response.data);
    } catch (error) {
      console.error("Error fetching destinations:", error);
      showToast("Error fetching destinations", "error");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => setFormData(initialFormState);

  const showToast = (title, status) => {
    toast({
      title,
      status,
      duration: 5000,
      isClosable: true,
    });
  };

  const handleEdit = (destination) => {
    setSelectedDestination(destination);
    setFormData(destination);
    onOpenEdit();
  };

  const handleNew = () => {
    resetForm();
    onOpenNew();
  };

  const handleCreate = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/destinations/destinations`, formData, { withCredentials: true });
      showToast("Destination created successfully", "success");
      fetchDestinations();
      onCloseNew();
    } catch (error) {
      console.error("Error creating destination:", error);
      showToast("Error creating destination", "error");
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_SERVER_URL}/api/destinations/destinations`, { ...formData, id: selectedDestination.id }, { withCredentials: true });
      showToast("Destination updated successfully", "success");
      fetchDestinations();
      onCloseEdit();
    } catch (error) {
      console.error("Error updating destination:", error);
      showToast("Error updating destination", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_SERVER_URL}/api/destinations/destinations/${id}`, { withCredentials: true });
      showToast("Destination deleted successfully", "success");
      setDestinations(destinations.filter((d) => d.id !== id));
    } catch (error) {
      console.error("Error deleting destination:", error);
      showToast("Error deleting destination", "error");
    }
  };

  const DestinationModal = ({ isOpen, onClose, isEdit }) => (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isEdit ? "Edit" : "Create New"} Destination</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            {Object.keys(initialFormState).map((key) => (
              <FormControl key={key}>
                <FormLabel>{key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}</FormLabel>
                {key === 'description' || key === 'attractions' || key === 'recommended_activities' ? (
                  <Textarea name={key} value={formData[key]} onChange={handleInputChange} />
                ) : (
                  <Input name={key} value={formData[key]} onChange={handleInputChange} />
                )}
              </FormControl>
            ))}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={isEdit ? handleUpdate : handleCreate}>
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading color={textColor}>Destinations</Heading>
        <Button leftIcon={<AddIcon />} colorScheme="teal" onClick={handleNew}>
          Create New Destination
        </Button>
        <Box overflowX="auto" bg={bgColor} borderRadius="lg" boxShadow="md">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Country</Th>
                <Th>City</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {destinations.map((destination) => (
                <Tr key={destination.id}>
                  <Td>{destination.name}</Td>
                  <Td>{destination.country}</Td>
                  <Td>{destination.city}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <Button size="sm" leftIcon={<EditIcon />} colorScheme="teal" onClick={() => handleEdit(destination)}>
                        Edit
                      </Button>
                      <Button size="sm" leftIcon={<DeleteIcon />} colorScheme="red" onClick={() => handleDelete(destination.id)}>
                        Delete
                      </Button>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>
      <DestinationModal isOpen={isOpenEdit} onClose={onCloseEdit} isEdit={true} />
      <DestinationModal isOpen={isOpenNew} onClose={onCloseNew} isEdit={false} />
    </Container>
  );
}

export default AdminDestinationsPanel;