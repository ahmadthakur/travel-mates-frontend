import { useState, useEffect } from "react";
import {
  Box,
  Button,
  List,
  ListItem,
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
  Text,
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

import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminDestinationsPanel() {
  const [destinations, setDestinations] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const toast = useToast();

  const [name, setName] = useState(
    selectedDestination ? selectedDestination.name : ""
  );
  const [country, setCountry] = useState(
    selectedDestination ? selectedDestination.country : ""
  );
  const [city, setCity] = useState(
    selectedDestination ? selectedDestination.city : ""
  );
  const [description, setDescription] = useState(
    selectedDestination ? selectedDestination.description : ""
  );
  const [attractions, setAttractions] = useState(
    selectedDestination ? selectedDestination.attractions : ""
  );
  const [recommended_activities, setRecommendedActivities] = useState(
    selectedDestination ? selectedDestination.recommended_activities : ""
  );
  const [image_url, setImageUrl] = useState(
    selectedDestination ? selectedDestination.image_url : ""
  );
  const [latitude, setLatitude] = useState(
    selectedDestination ? selectedDestination.latitude : ""
  );
  const [longitude, setLongitude] = useState(
    selectedDestination ? selectedDestination.longitude : ""
  );
  const navigate = useNavigate();
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

  const fetchDestinations = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/destinations/destinations`
      );
      setDestinations(response.data);
    } catch (error) {
      console.error(error);
      // Handle error here
    }
  };
  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleEdit = (destination) => {
    setSelectedDestination(destination);
    onOpenEdit();
  };

  const handleNew = () => {
    setSelectedDestination(null);
    onOpenNew();
  };

  const handleCreate = async (newDestination) => {
    try {
      await axios
        .post(
          `${process.env.REACT_APP_SERVER_URL}/api/destinations/destinations`,
          newDestination,
          { withCredentials: true }
        )
        .then((response) => {
          console.log(response);
          toast({
            title: "Destination created.",
            description: "Destination successfully created.",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
        });
      // Refresh destinations
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred.",
        description: "An error occurred while creating the destination.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });

      // Handle error here
    }
  };

  const handleUpdate = async (updatedDestination) => {
    try {
      await axios
        .put(
          `${process.env.REACT_APP_SERVER_URL}/api/destinations/destinations`,
          updatedDestination,
          { withCredentials: true }
        )
        .then((response) => {
          console.log(response);
          toast({
            title: "Destination updated.",
            description: "Destination successfully updated.",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
        });

      // Refresh destinations
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred.",
        description: "An error occurred while updating the destination.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });

      // Handle error here
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios
        .delete(
          `${process.env.REACT_APP_SERVER_URL}/api/destinations/destinations/${id}`,
          { withCredentials: true }
        )
        .then((response) => {
          console.log(response);
          toast({
            title: "Destination deleted.",
            description: "Destination successfully deleted.",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
        });
      // Refresh destinations
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred.",
        description: "An error occurred while deleting the destination.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      // Handle error here
    }
  };

  return (
    <Box m={4} p={5}>
      <Heading mb={4}>Destinations</Heading>
      <Button onClick={handleNew} colorScheme="blue">
        Create New Destination
      </Button>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>City</Th>
            <Th>Description</Th>
            <Th>Attractions</Th>
            <Th>Recommended Activities</Th>
            <Th>Latitude</Th>
            <Th>Longitude</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {destinations.map((destination) => (
            <Tr key={destination.id}>
              <Td>{destination.name}</Td>
              <Td>{destination.country}</Td>
              <Td>{destination.description}</Td>
              <Td>{destination.attractions}</Td>
              <Td>{destination.recommended_activities}</Td>
              <Td>{destination.latitude}</Td>
              <Td>{destination.longitude}</Td>
              <Td>
                <HStack spacing={3}>
                  <Button
                    onClick={() => handleEdit(destination)}
                    colorScheme="teal"
                    leftIcon={<EditIcon />}
                    width="100px"
                  >
                    Edit
                  </Button>

                  <Button
                    onClick={async () => {
                      await handleDelete(destination.id);
                      const updatedDestinations = destinations.filter(
                        (d) => d.id !== destination.id
                      );
                      setDestinations(updatedDestinations);
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
          <ModalHeader>Edit Destination</ModalHeader>
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
              <FormLabel>Country</FormLabel>
              <Input
                placeholder="Country"
                value={country}
                onChange={(event) => setCountry(event.target.value)}
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
              <FormLabel>Description</FormLabel>
              <Input
                placeholder="Description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Attractions</FormLabel>
              <Input
                placeholder="Attractions"
                value={attractions}
                onChange={(event) => setAttractions(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Recommended Activities</FormLabel>
              <Input
                placeholder="Recommended Activities"
                value={recommended_activities}
                onChange={(event) =>
                  setRecommendedActivities(event.target.value)
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel>Image URL</FormLabel>
              <Input
                placeholder="Image URL"
                value={image_url}
                onChange={(event) => setImageUrl(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Latitude</FormLabel>
              <Input
                placeholder="Latitude"
                value={latitude}
                onChange={(event) => setLatitude(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Longitude</FormLabel>
              <Input
                placeholder="Longitude"
                value={longitude}
                onChange={(event) => setLongitude(event.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={async () => {
                const updatedDestination = {
                  id: selectedDestination.id,
                  name,
                  country,
                  city,
                  description,
                  attractions,
                  recommended_activities,
                  image_url,
                  latitude,
                  longitude,
                };
                console.log("Updated destination:", updatedDestination);

                const response = await handleUpdate(updatedDestination);
                console.log("Response from handleUpdate:", response);

                // Fetch data from the server
                await fetchDestinations();

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
          <ModalHeader>Create New Destination</ModalHeader>
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
              <FormLabel>Country</FormLabel>
              <Input
                placeholder="Country"
                value={country}
                onChange={(event) => setCountry(event.target.value)}
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
              <FormLabel>Description</FormLabel>
              <Input
                placeholder="Description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Attractions</FormLabel>
              <Input
                placeholder="Attractions"
                value={attractions}
                onChange={(event) => setAttractions(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Recommended Activities</FormLabel>
              <Input
                placeholder="Recommended Activities"
                value={recommended_activities}
                onChange={(event) =>
                  setRecommendedActivities(event.target.value)
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel>Image URL</FormLabel>
              <Input
                placeholder="Image URL"
                value={image_url}
                onChange={(event) => setImageUrl(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Latitude</FormLabel>
              <Input
                placeholder="Latitude"
                value={latitude}
                onChange={(event) => setLatitude(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Longitude</FormLabel>
              <Input
                placeholder="Longitude"
                value={longitude}
                onChange={(event) => setLongitude(event.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={async () => {
                const newDestination = {
                  name,
                  country,
                  city,
                  description,
                  attractions,
                  recommended_activities,
                  image_url,
                  latitude,
                  longitude,
                };
                console.log(newDestination);
                await handleCreate(newDestination); // Make this asynchronous
                await fetchDestinations();
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

export default AdminDestinationsPanel;
