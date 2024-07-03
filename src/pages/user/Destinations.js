import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Image,
  Text,
  SimpleGrid,
  Center,
  Container,
  Heading,
} from "@chakra-ui/react";
import { Element } from "react-scroll";
import Hero from "../../components/Hero";

function Destinations({ navbar, footer }) {
  const [destinations, setDestinations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/destinations/destinations`,
          { withCredentials: true }
        );
        setDestinations(response.data);
      } catch (error) {
        console.error("Failed to fetch destinations:", error);
        // Consider adding user-friendly error handling here
      }
    };
    fetchDestinations();
  }, []);

  const handleMoreInfoClick = (destination) => {
    navigate(`/destination/${destination.id}`, { state: { destination } });
  };

  return (
    <>
      {navbar}
      <Hero
        title="Your Journey Starts Here"
        subtitle="Explore some of the best destinations in the world"
      />
      <Element name="destinations">
        <Container maxW="1200px" py={16}>
          <Center flexDirection="column" mb={12}>
            <Heading as="h2" size="2xl" mb={2}>
              Popular Destinations
            </Heading>
            <Text fontSize="xl">Discover your next adventure</Text>
          </Center>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {destinations.map((destination) => (
              <Box
                key={destination.id}
                borderWidth={1}
                borderRadius="lg"
                overflow="hidden"
                boxShadow="md"
                transition="all 0.3s"
                _hover={{
                  transform: "translateY(-5px)",
                  boxShadow: "lg",
                }}
                onClick={() => handleMoreInfoClick(destination)}
                cursor="pointer"
              >
                <Image
                  src={destination.image_url}
                  alt={destination.name}
                  height="200px"
                  width="100%"
                  objectFit="cover"
                />
                <Box p={5}>
                  <Heading as="h3" size="md" mb={2}>
                    {destination.name}
                  </Heading>
                  <Text color="gray.600" noOfLines={3}>
                    {destination.description}
                  </Text>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Element>
      {footer}
    </>
  );
}

export default Destinations;