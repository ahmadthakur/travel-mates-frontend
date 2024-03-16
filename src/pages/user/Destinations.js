import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Image,
  Text,
  Button,
  SimpleGrid,
  Center,
  Flex,
} from "@chakra-ui/react";

function Destinations() {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/destinations/destinations`,
          { withCredentials: true }
        );
        setDestinations(response.data);
      } catch (error) {
        console.error(error);
        // Handle error here
      }
    };

    fetchDestinations();
  }, []);

  const navigate = useNavigate();

  const handleMoreInfoClick = (destination) => {
    navigate(`/destination/${destination.id}`, { state: { destination } });
    console.log(destination);
  };

  return (
    <Center>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
        {destinations.map((destination) => (
          <Box
            key={destination.id}
            borderRadius="lg"
            overflow="hidden"
            p={5}
            bg="gray.100" // Set the background color to slightly grey
            boxShadow="md" // Add a shadow to the card
            maxW="300px"
            as={Flex}
            direction="column"
            justifyContent="space-between"
          >
            <Image
              src={destination.image_url}
              alt={destination.name}
              width="100%"
              height="200px" // Adjust the height of the image
              borderRadius="md"
              objectFit="cover"
              mb={4} // Add some margin below the image
            />
            <Text fontSize="xl" fontWeight="bold" mb={2} color="black">
              {destination.name}
            </Text>
            <Flex direction="column" justifyContent="space-between" flex="1">
              {" "}
              {/* Add flex="1" */}
              <Box overflowY="auto" maxH="180px">
                <Text color="gray.600">{destination.description}</Text>
              </Box>
              <Button
                colorScheme="teal"
                mt={4}
                onClick={() => handleMoreInfoClick(destination)}
              >
                More Information
              </Button>
            </Flex>
          </Box>
        ))}
      </SimpleGrid>
    </Center>
  );
}

export default Destinations;
