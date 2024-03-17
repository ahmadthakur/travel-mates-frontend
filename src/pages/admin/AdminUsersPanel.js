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
} from "@chakra-ui/react";
import axios from "axios";
import { Link } from "react-router-dom";

function AdminUsersPanel() {
  const [users, setUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef();
  const toast = useToast();

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
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/users/users/${userId}`,
        { withCredentials: true }
      );

      toast({
        title: "User deleted.",
        description: "The user has been successfully deleted.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });

      fetchUsers();

      onClose();
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred.",
        description: "Unable to delete the user. Please try again.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handleUpdate = async (user) => {
    try {
      await axios.put(`/api/users/${user.id}`, user);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <Box m={4} p={5} height="100vh">
      <Heading mb={4}>Users</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Full Name</Th>

            <Th>Delete</Th>
            <Th>Trips</Th>
            <Th>Notifications</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user) => {
            const handleDeleteClick = () => {
              setIsOpen(true);
            };

            const handleDeleteConfirm = () => {
              handleDelete(user.id);
              setIsOpen(false);
            };

            return (
              <Tr key={user.id}>
                <Td>{user.username}</Td>
                <Td>{user.email}</Td>
                <Td>{user.first_name + " " + user.last_name}</Td>

                <Td>
                  <Button colorScheme="red" onClick={handleDeleteClick}>
                    Delete
                  </Button>
                  <AlertDialog
                    isOpen={isOpen}
                    leastDestructiveRef={cancelRef}
                    onClose={onClose}
                  >
                    <AlertDialogOverlay>
                      <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                          Delete User
                        </AlertDialogHeader>

                        <AlertDialogBody>
                          Are you sure? You can't undo this action afterwards.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                          <Button ref={cancelRef} onClick={onClose}>
                            Cancel
                          </Button>
                          <Button
                            colorScheme="red"
                            onClick={handleDeleteConfirm}
                            ml={3}
                          >
                            Delete
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialogOverlay>
                  </AlertDialog>
                </Td>
                <Td>
                  <Link to={`/admin/users/${user.id}/trips`}>
                    <Button colorScheme="teal">Trips</Button>
                  </Link>
                </Td>
                <Td>
                  <Link to={`/admin/users/${user.id}/notifications`}>
                    <Button colorScheme="purple">Notifications</Button>
                  </Link>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Box>
  );
}

export default AdminUsersPanel;
