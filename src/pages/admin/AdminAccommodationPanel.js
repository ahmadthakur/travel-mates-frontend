import React, { useState, useEffect, useCallback } from "react";
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
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon, AddIcon } from "@chakra-ui/icons";
import axios from "axios";

const initialFormState = {
  name: "",
  description: "",
  maxGuests: "",
  city: "",
  country: "",
  imageUrl: "",
  price: "",
};

function AccommodationModal({ isOpen, onClose, isEdit, initialData, onSave }) {
  const [formData, setFormData] = useState(initialData || initialFormState);

  useEffect(() => {
    setFormData(initialData || initialFormState);
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isEdit ? "Edit" : "Create New"} Accommodation</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            {Object.keys(initialFormState).map((key) => (
              <FormControl key={key}>
                <FormLabel>{key.charAt(0).toUpperCase() + key.slice(1)}</FormLabel>
                <Input 
                  name={key} 
                  value={formData[key] || ''} 
                  onChange={handleInputChange} 
                />
              </FormControl>
            ))}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function AdminAccommodationsPanel() {
  const [accommodations, setAccommodations] = useState([]);
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);
  const toast = useToast();
  const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure();
  const { isOpen: isOpenNew, onOpen: onOpenNew, onClose: onCloseNew } = useDisclosure();

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");

  const fetchAccommodations = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/accommodations/accommodations`);
      setAccommodations(response.data);
    } catch (error) {
      console.error("Error fetching accommodations:", error);
      showToast("Error fetching accommodations", "error");
    }
  }, []);

  useEffect(() => {
    fetchAccommodations();
  }, [fetchAccommodations]);

  const showToast = (title, status) => {
    toast({
      title,
      status,
      duration: 5000,
      isClosable: true,
    });
  };

  const handleEdit = (accommodation) => {
    setSelectedAccommodation(accommodation);
    onOpenEdit();
  };

  const handleNew = () => {
    setSelectedAccommodation(null);
    onOpenNew();
  };

  const handleCreate = async (newAccommodation) => {
    try {
      await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/accommodations/accommodations`, newAccommodation, { withCredentials: true });
      showToast("Accommodation created successfully", "success");
      fetchAccommodations();
    } catch (error) {
      console.error("Error creating accommodation:", error);
      showToast("Error creating accommodation", "error");
    }
  };

  const handleUpdate = async (updatedAccommodation) => {
    try {
      await axios.put(`${process.env.REACT_APP_SERVER_URL}/api/accommodations/accommodations/${updatedAccommodation.id}`, updatedAccommodation, { withCredentials: true });
      showToast("Accommodation updated successfully", "success");
      fetchAccommodations();
    } catch (error) {
      console.error("Error updating accommodation:", error);
      showToast("Error updating accommodation", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_SERVER_URL}/api/accommodations/accommodations/${id}`, { withCredentials: true });
      showToast("Accommodation deleted successfully", "success");
      setAccommodations(accommodations.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Error deleting accommodation:", error);
      showToast("Error deleting accommodation", "error");
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading color={textColor}>Accommodations</Heading>
        <Button leftIcon={<AddIcon />} colorScheme="teal" onClick={handleNew}>
          Create New Accommodation
        </Button>
        <Box overflowX="auto" bg={bgColor} borderRadius="lg" boxShadow="md">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>City</Th>
                <Th>Country</Th>
                <Th>Max Guests</Th>
                <Th>Price</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {accommodations.map((accommodation) => (
                <Tr key={accommodation.id}>
                  <Td>{accommodation.name}</Td>
                  <Td>{accommodation.city}</Td>
                  <Td>{accommodation.country}</Td>
                  <Td>{accommodation.maxGuests}</Td>
                  <Td>{accommodation.price}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <Button size="sm" leftIcon={<EditIcon />} colorScheme="teal" onClick={() => handleEdit(accommodation)}>
                        Edit
                      </Button>
                      <Button size="sm" leftIcon={<DeleteIcon />} colorScheme="red" onClick={() => handleDelete(accommodation.id)}>
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
      <AccommodationModal 
        isOpen={isOpenEdit} 
        onClose={onCloseEdit} 
        isEdit={true} 
        initialData={selectedAccommodation} 
        onSave={handleUpdate}
      />
      <AccommodationModal 
        isOpen={isOpenNew} 
        onClose={onCloseNew} 
        isEdit={false} 
        initialData={initialFormState} 
        onSave={handleCreate}
      />
    </Container>
  );
}

export default AdminAccommodationsPanel;