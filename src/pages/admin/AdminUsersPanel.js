import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Box,
  Heading,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
  Container,
  VStack,
  HStack,
  Text,
  useColorModeValue,
  useBreakpointValue,
} from "@chakra-ui/react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaTrash, FaPlane, FaBell } from "react-icons/fa";

function AdminUsersPanel() {
  const [users, setUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const cancelRef = useRef();
  const toast = useToast();

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const buttonSize = useBreakpointValue({ base: "sm", md: "md" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/users/users`,
        { withCredentials: true }
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error fetching users",
        description: "Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/users/users/${userId}`,
        { withCredentials: true }
      );
      toast({
        title: "User deleted",
        description: "The user has been successfully deleted.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error deleting user",
        description: "Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setIsOpen(false);
  };

  const openDeleteDialog = (user) => {
    setUserToDelete(user);
    setIsOpen(true);
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="xl" color={textColor}>
          Users
        </Heading>
        <Box overflowX="auto" bg={bgColor} borderRadius="lg" boxShadow="md">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Full Name</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map((user) => (
                <Tr key={user.id}>
                  <Td>{user.username}</Td>
                  <Td>{user.email}</Td>
                  <Td>{`${user.first_name} ${user.last_name}`}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <Button
                        colorScheme="red"
                        size={buttonSize}
                        onClick={() => openDeleteDialog(user)}
                        leftIcon={<FaTrash />}
                      >
                        Delete
                      </Button>
                      <Link to={`/admin/users/${user.id}/trips`}>
                        <Button
                          colorScheme="teal"
                          size={buttonSize}
                          leftIcon={<FaPlane />}
                        >
                          Trips
                        </Button>
                      </Link>
                      <Link to={`/admin/users/${user.id}/notifications`}>
                        <Button
                          colorScheme="purple"
                          size={buttonSize}
                          leftIcon={<FaBell />}
                        >
                          Notifications
                        </Button>
                      </Link>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete User
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete {userToDelete?.username}? This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => handleDelete(userToDelete?.id)}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
}

export default AdminUsersPanel;