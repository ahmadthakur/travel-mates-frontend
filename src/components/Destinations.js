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
          `${process.env.REACT_APP_SERVER_URL}/api/destinations`
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
            bg="transparent"
            maxW="300px" // Set the maximum width of the card
            as={Flex} // Make the Box a flex container
            direction="column" // Arrange the items in a column
            justifyContent="space-between" // Distribute the space between the items
          >
            <Image
              src={destination.image_url}
              alt={destination.name}
              width="100%" // Make the image take up the full width of the card
              height="250px" // Make the image square
              borderRadius="md" // Round the edges of the image
              objectFit="cover"
            />
            <Text fontSize="2xl" fontWeight="bold" mt={4} color="black">
              {destination.name}
            </Text>
            <Flex direction="column" justifyContent="space-between">
              <Box>
                <Text color="gray.600" mt={2} height="60px">
                  {destination.description}
                </Text>
              </Box>
              <Button
                colorScheme="blue"
                mt={6}
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
