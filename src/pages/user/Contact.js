import React, { useState } from "react";
import {
  Box,
  Container,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  VStack,
  HStack,
  Text,
  useToast,
  Icon,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { FaEnvelope, FaUser, FaPhone, FaPaperPlane } from "react-icons/fa";

const Contact = ({ navbar, footer }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulating an API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message sent!",
        description: "We'll get back to you soon.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setFormData({ name: "", email: "", phone: "", message: "" });
    }, 2000);
  };

  return (
    <>
      {navbar}
      <Box bg="gray.50" minHeight="100vh" py={{ base: 16, md: 20 }} px={4} paddingBlockStart={{ base: 20, md: 40 }}>
        <Container maxW="container.md">
          <VStack spacing={8} align="stretch">
            <Box textAlign="center">
              <Heading as="h1" size="2xl" mb={2} color="teal.600">
                Contact Us
              </Heading>
              <Text color="gray.600">We'd love to hear from you!</Text>
            </Box>

            <Box bg="white" p={8} borderRadius="lg" boxShadow="md">
              <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                  <FormControl id="name" isRequired>
                    <FormLabel>Name</FormLabel>
                    <InputGroup>
                      <InputLeftElement children={<Icon as={FaUser} color="gray.500" />} />
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                      />
                    </InputGroup>
                  </FormControl>

                  <HStack spacing={4} width="100%">
                    <FormControl id="email" isRequired>
                      <FormLabel>Email</FormLabel>
                      <InputGroup>
                        <InputLeftElement children={<Icon as={FaEnvelope} color="gray.500" />} />
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Your email"
                        />
                      </InputGroup>
                    </FormControl>

                    <FormControl id="phone">
                      <FormLabel>Phone</FormLabel>
                      <InputGroup>
                        <InputLeftElement children={<Icon as={FaPhone} color="gray.500" />} />
                        <Input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Your phone (optional)"
                        />
                      </InputGroup>
                    </FormControl>
                  </HStack>

                  <FormControl id="message" isRequired>
                    <FormLabel>Message</FormLabel>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Your message"
                      rows={6}
                    />
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="teal"
                    size="lg"
                    width="full"
                    isLoading={isSubmitting}
                    loadingText="Submitting"
                    leftIcon={<FaPaperPlane />}
                  >
                    Send Message
                  </Button>
                </VStack>
              </form>
            </Box>
          </VStack>
        </Container>
      </Box>
      {footer}
    </>
  );
};

export default Contact;