import React from "react";
import { Box, Heading, Text, VStack, Container, Icon, Flex, SimpleGrid } from "@chakra-ui/react";
import { FaGraduationCap, FaCode, FaPlane, FaMapMarkedAlt } from "react-icons/fa";

const About = ({ navbar, footer }) => {
  return (
    <>
      {navbar}
      <Box
        bg="gray.50"
        minHeight="100vh"
        py={{ base: 16, md: 20 }}
        px={4}
        paddingBlockStart={{ base: 20, md: 40 }}
      >
        <Container maxW="container.xl">
          <VStack spacing={10} align="stretch">
            <Box textAlign="center">
              <Heading as="h1" size="2xl" mb={4} color="teal.600">
                About Travel Mates
              </Heading>
              <Text fontSize="xl" color="gray.600">
                Your Ultimate Companion for Trip Planning and Exploration
              </Text>
            </Box>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
              <Box>
                <Heading as="h2" size="lg" mb={4} color="teal.500">
                  Project Overview
                </Heading>
                <Text fontSize="md" color="gray.700">
                  Travel Mates is a comprehensive travel planning platform developed as a final year project for Virtual University. It aims to simplify the process of planning trips, discovering new destinations, and managing travel itineraries.
                </Text>
              </Box>
              <Box>
                <Heading as="h2" size="lg" mb={4} color="teal.500">
                  Key Features
                </Heading>
                <VStack align="start" spacing={3}>
                  <Flex align="center">
                    <Icon as={FaMapMarkedAlt} color="teal.500" mr={2} />
                    <Text color="gray.700">Destination discovery and information</Text>
                  </Flex>
                  <Flex align="center">
                    <Icon as={FaPlane} color="teal.500" mr={2} />
                    <Text color="gray.700">Trip planning and itinerary management</Text>
                  </Flex>
                  <Flex align="center">
                    <Icon as={FaCode} color="teal.500" mr={2} />
                    <Text color="gray.700">User-friendly interface with responsive design</Text>
                  </Flex>
                </VStack>
              </Box>
            </SimpleGrid>

            <Box>
              <Heading as="h2" size="lg" mb={4} color="teal.500">
                About the Developer
              </Heading>
              <Flex align="center" mb={4}>
                <Icon as={FaGraduationCap} color="teal.500" boxSize={6} mr={4} />
                <VStack align="start" spacing={1}>
                  <Text fontSize="lg" fontWeight="bold" color="gray.700">
                    Ahmad Thakur
                  </Text>
                  <Text color="gray.600">
                    Software Engineering Student, Virtual University
                  </Text>
                </VStack>
              </Flex>
              <Text fontSize="md" color="gray.700">
                As a passionate software engineering student, Ahmad developed Travel Mates to demonstrate his skills in web development, user experience design, and backend integration. This project showcases the practical application of academic knowledge in creating a real-world solution for travel enthusiasts.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4} color="teal.500">
                Technical Details
              </Heading>
              <Text fontSize="md" color="gray.700">
                Travel Mates is built using modern web technologies, including React for the frontend, Node.js and Express for the backend, and SQLite for the database. The application integrates various APIs to provide real-time weather information, mapping services, and destination details.
              </Text>
            </Box>
          </VStack>
        </Container>
      </Box>
      {footer}
    </>
  );
};

export default About;