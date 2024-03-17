import { Box, Flex, Text, Icon, Link } from "@chakra-ui/react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";

function Footer() {
  return (
    <Box bg="black" py={4}>
      <Flex justify="center" align="center" direction="column">
        <Text fontSize="sm" color="white">
          © 2022 Travel Mates. All rights reserved.
        </Text>
        <Flex mt={2}>
          <RouterLink to="/" style={{ color: "white" }}>
            Home
          </RouterLink>
          <RouterLink
            to="/contact"
            style={{ color: "white", marginLeft: "10px" }}
          >
            Contact
          </RouterLink>
          <RouterLink
            to="/about"
            style={{ color: "white", marginLeft: "10px" }}
          >
            About
          </RouterLink>
          <RouterLink
            to="/admin/login"
            style={{ color: "white", marginLeft: "10px" }}
          >
            Admin login
          </RouterLink>
        </Flex>
        <Flex mt={2}>
          <Link href="https://www.facebook.com" isExternal>
            <Icon as={FaFacebook} color="white" boxSize={6} />
          </Link>
          <Link href="https://www.twitter.com" isExternal ml={2}>
            <Icon as={FaTwitter} color="white" boxSize={6} />
          </Link>
          <Link href="https://www.instagram.com" isExternal ml={2}>
            <Icon as={FaInstagram} color="white" boxSize={6} />
          </Link>
          <Link href="https://www.linkedin.com" isExternal ml={2}>
            <Icon as={FaLinkedin} color="white" boxSize={6} />
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
}

export default Footer;
