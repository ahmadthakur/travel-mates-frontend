import React from "react";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
} from "@chakra-ui/react";

const Contact = ({ navbar, footer }) => {
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
            Contact Us
          </Heading>
          <FormControl id="email" mb="4">
            <FormLabel>Email address</FormLabel>
            <Input type="email" />
          </FormControl>
          <FormControl id="message" mb="4">
            <FormLabel>Message</FormLabel>
            <Textarea />
          </FormControl>
          <Button colorScheme="blue" width="full">
            Submit
          </Button>
        </Box>
      </Box>
      {footer}
    </>
  );
};

export default Contact;
