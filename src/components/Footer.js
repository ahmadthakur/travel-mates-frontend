import { Box, Container, SimpleGrid, Stack, Text, Flex, Link, Icon } from "@chakra-ui/react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";

function Footer() {
  return (
    <Box bg={"gray.100"}py={10}>
      <Container maxW="container.xl">
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={8}>
          <Stack align="flex-start">
            <Text fontWeight="bold" fontSize="lg" mb={2}>Company</Text>
            <Link as={RouterLink} to="/about">About Us</Link>
            <Link as={RouterLink} to="/contact">Contact</Link>
          </Stack>
          <Stack align="flex-start">
            <Text fontWeight="bold" fontSize="lg" mb={2}>Explore</Text>
            <Link as={RouterLink} to="/">Destinations</Link>
            <Link as={RouterLink} to="/plan/trip">Plan a Trip</Link>
          </Stack>
          <Stack align="flex-start">
            <Text fontWeight="bold" fontSize="lg" mb={2}>Account</Text>
            <Link as={RouterLink} to="/dashboard">Dashboard</Link>
            <Link as={RouterLink} to="/login">Login</Link>
            <Link as={RouterLink} to="/register">Register</Link>
          </Stack>
          <Stack align="flex-start">
            <Text fontWeight="bold" fontSize="lg" mb={2}>Admin</Text>
            <Link as={RouterLink} to="/admin/login">Admin Login</Link>
          </Stack>
        </SimpleGrid>

        <Box borderTopWidth={1} borderColor="gray.700" pt={8} mt={8}>
          <Flex 
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align="center"
          >
            <Text fontSize="sm">
              © {new Date().getFullYear()} Travel Mates. All rights reserved.
            </Text>
            <Stack direction="row" spacing={6} mt={{ base: 4, md: 0 }}>
              <Link href="https://www.facebook.com" isExternal>
                <Icon as={FaFacebook} boxSize={6} />
              </Link>
              <Link href="https://www.twitter.com" isExternal>
                <Icon as={FaTwitter} boxSize={6} />
              </Link>
              <Link href="https://www.instagram.com" isExternal>
                <Icon as={FaInstagram} boxSize={6} />
              </Link>
              <Link href="https://www.linkedin.com" isExternal>
                <Icon as={FaLinkedin} boxSize={6} />
              </Link>
            </Stack>
          </Flex>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;