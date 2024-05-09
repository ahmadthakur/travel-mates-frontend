import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";

const About = ({ navbar, footer }) => {
  return (
    <>
      {navbar}
      <Box
        padding="5"
        bg="gray.100"
        minHeight="100vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Box mt="100px" width="50%">
          <Heading as="h1" size="2xl" mb="5" textAlign="center">
            About Me
          </Heading>
          <Text fontSize="xl" textAlign="center">
            I am Ahmad Thakur, a software engineering student from Virtual University.
          </Text>
        </Box>
      </Box>
      {footer}
    </>
  );
};

export default About;