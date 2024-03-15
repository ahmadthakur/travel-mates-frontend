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
import { useState, useEffect } from "react";
import axios from "axios";

function AdminAccommodationsPanel() {
  const [accommodations, setAccommodations] = useState([]);
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);
  const toast = useToast();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [maxGuests, setMaxGuests] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [price, setPrice] = useState("");

  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();
  const {
    isOpen: isOpenNew,
    onOpen: onOpenNew,
    onClose: onCloseNew,
  } = useDisclosure();

  const fetchAccommodations = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/accommodations/accommodations`
      );
      setAccommodations(response.data);
      console.log(accommodations);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAccommodations();
  }, []);

  const handleEdit = (accommodation) => {
    setSelectedAccommodation(accommodation);
    setName(accommodation.name);
    setDescription(accommodation.description);
    setMaxGuests(accommodation.maxGuests);
    setCity(accommodation.city);
    setCountry(accommodation.country);
    setImageUrl(accommodation.imageUrl);
    setPrice(accommodation.price);
    onOpenEdit();
  };

  const handleNew = () => {
    setSelectedAccommodation(null);
    setName("");
    setDescription("");
    setMaxGuests("");
    setCity("");
    setCountry("");
    setImageUrl("");
    setPrice("");
    onOpenNew();
  };

  const handleCreate = async (newAccommodation) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/accommodations/accommodations`,
        newAccommodation,
        { withCredentials: true }
      );
      toast({
        title: "Accommodation created.",
        description: "Accommodation successfully created.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      fetchAccommodations();
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred.",
        description: "An error occurred while creating the accommodation.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handleUpdate = async (updatedAccommodation) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/api/accommodations/accommodations/${updatedAccommodation.id}`,
        updatedAccommodation,
        { withCredentials: true }
      );
      toast({
        title: "Accommodation updated.",
        description: "Accommodation successfully updated.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      fetchAccommodations();
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred.",
        description: "An error occurred while updating the accommodation.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/api/accommodations/accommodations/${id}`,
        { withCredentials: true }
      );
      toast({
        title: "Accommodation deleted.",
        description: "Accommodation successfully deleted.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      fetchAccommodations();
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred.",
        description: "An error occurred while deleting the accommodation.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Box m={4} p={5}>
      <Heading mb={4}>Accommodations</Heading>
      <Button onClick={handleNew} colorScheme="blue">
        Create New Accommodation
      </Button>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Description</Th>
            <Th>Max Guests</Th>
            <Th>City</Th>
            <Th>Country</Th>
            <Th>Image URL</Th>
            <Th>Price</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {accommodations.map((accommodation) => (
            <Tr key={accommodation.id}>
              <Td>{accommodation.name}</Td>
              <Td>{accommodation.description}</Td>
              <Td>{accommodation.maxGuests}</Td>
              <Td>{accommodation.city}</Td>
              <Td>{accommodation.country}</Td>
              <Td>{accommodation.imageUrl}</Td>
              <Td>{accommodation.price}</Td>
              <Td>
                <HStack spacing={3}>
                  <Button
                    onClick={() => handleEdit(accommodation)}
                    colorScheme="teal"
                    leftIcon={<EditIcon />}
                    width="100px"
                  >
                    Edit
                  </Button>

                  <Button
                    onClick={async () => {
                      await handleDelete(accommodation.id);
                      const updatedAccommodations = accommodations.filter(
                        (a) => a.id !== accommodation.id
                      );
                      setAccommodations(updatedAccommodations);
                    }}
                    colorScheme="red"
                    leftIcon={<DeleteIcon />}
                    width="100px"
                  >
                    Delete
                  </Button>
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Modal isOpen={isOpenEdit} onClose={onCloseEdit}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Accommodation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                placeholder="Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Input
                placeholder="Description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Max Guests</FormLabel>
              <Input
                placeholder="Max Guests"
                value={maxGuests}
                onChange={(event) => setMaxGuests(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>City</FormLabel>
              <Input
                placeholder="City"
                value={city}
                onChange={(event) => setCity(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Country</FormLabel>
              <Input
                placeholder="Country"
                value={country}
                onChange={(event) => setCountry(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Image URL</FormLabel>
              <Input
                placeholder="Image URL"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Price</FormLabel>
              <Input
                placeholder="Price"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={async () => {
                const updatedAccommodation = {
                  id: selectedAccommodation.id,
                  name,
                  description,
                  maxGuests,
                  city,
                  country,
                  imageUrl,
                  price,
                };
                await handleUpdate(updatedAccommodation);
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
      <Modal isOpen={isOpenNew} onClose={onCloseNew}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Accommodation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                placeholder="Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Input
                placeholder="Description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Max Guests</FormLabel>
              <Input
                placeholder="Max Guests"
                value={maxGuests}
                onChange={(event) => setMaxGuests(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>City</FormLabel>
              <Input
                placeholder="City"
                value={city}
                onChange={(event) => setCity(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Country</FormLabel>
              <Input
                placeholder="Country"
                value={country}
                onChange={(event) => setCountry(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Image URL</FormLabel>
              <Input
                placeholder="Image URL"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Price</FormLabel>
              <Input
                placeholder="Price"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={async () => {
                const newAccommodation = {
                  name,
                  description,
                  maxGuests,
                  city,
                  country,
                  imageUrl,
                  price,
                };
                await handleCreate(newAccommodation);
                onCloseNew();
              }}
            >
              Save
            </Button>
            <Button variant="ghost" onClick={onCloseNew}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default AdminAccommodationsPanel;
