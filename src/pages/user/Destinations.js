import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Image,
  Text,
  Button,
  SimpleGrid,
  Center,
  Flex,
} from "@chakra-ui/react";
import Hero from "../../components/Hero";

function Destinations(props) {
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
    <>
      {props.navbar}
      <Hero
        title="Your Journey Starts Here"
        subtitle="Explore some of the best destinations in the world"
      />
      <Center mt={8} mx="auto" px={{ base: 5, md: 8 }} maxW="1200px" w="100%">
        <Text fontSize="4xl" fontWeight="bold">
          Popular Destinations
        </Text>
      </Center>
      <Center mb={12}>
        <Text fontSize="lg" fontWeight="normal">
          Discover your next adventure
        </Text>
      </Center>

      <Center mb={8}>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          {destinations.map((destination) => (
            <Box
              key={destination.id}
              borderRadius="lg"
              overflow="hidden"
              p={5}
              boxShadow="lg"
              maxW="300px"
              as={Flex}
              direction="column"
              justifyContent="space-between"
              onClick={() => handleMoreInfoClick(destination)}
              _hover={{
                transform: "scale(1.05)",
                transition: "transform 0.2s",
              }}
            >
              <Image
                src={destination.image_url}
                alt={destination.name}
                width="100%"
                height="200px"
                borderRadius="md"
                objectFit="cover"
                mb={4}
              />
              <Text fontSize="xl" fontWeight="bold" mb={2} color="black">
                {destination.name}
              </Text>
              <Flex direction="column" justifyContent="space-between" flex="1">
                <Box overflowY="auto" maxH="180px">
                  <Text color="gray.600">{destination.description}</Text>
                </Box>
              </Flex>
            </Box>
          ))}
        </SimpleGrid>
      </Center>
    </>
  );
}

export default Destinations;
