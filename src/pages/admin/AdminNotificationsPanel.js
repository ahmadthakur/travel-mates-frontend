import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Heading,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  HStack,
  Container,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon, AddIcon } from "@chakra-ui/icons";
import { useParams } from "react-router-dom";
import axios from "axios";

function AdminNotificationsPanel() {
  const { UserID } = useParams();
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const toast = useToast();

  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [isRead, setIsRead] = useState(false);

  const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure();
  const { isOpen: isOpenNew, onOpen: onOpenNew, onClose: onCloseNew } = useDisclosure();

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/notifications/notifications/${UserID}`,
        { withCredentials: true }
      );
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      showToast("Error fetching notifications", "error");
    }
  }, [UserID]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const showToast = (title, status, description) => {
    toast({
      title,
      description,
      status,
      duration: 5000,
      isClosable: true,
    });
  };

  const handleEdit = (notification) => {
    setSelectedNotification(notification);
    setUserId(notification.userId);
    setMessage(notification.message);
    setIsRead(notification.isRead);
    onOpenEdit();
  };

  const handleNew = () => {
    setSelectedNotification(null);
    setUserId(UserID);
    setMessage("");
    setIsRead(false);
    onOpenNew();
  };

  const handleCreate = async () => {
    try {
      const newNotification = { userId: UserID, message, isRead };
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/notifications/notifications`,
        newNotification,
        { withCredentials: true }
      );
      showToast("Notification created", "success", "Notification successfully created.");
      fetchNotifications();
      onCloseNew();
    } catch (error) {
      console.error("Error creating notification:", error);
      showToast("Error", "error", "An error occurred while creating the notification.");
    }
  };

  const handleUpdate = async () => {
    try {
      const updatedNotification = { id: selectedNotification.id, userId: UserID, message, isRead };
      await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/api/notifications/${updatedNotification.id}`,
        updatedNotification,
        { withCredentials: true }
      );
      showToast("Notification updated", "success", "Notification successfully updated.");
      fetchNotifications();
      onCloseEdit();
    } catch (error) {
      console.error("Error updating notification:", error);
      showToast("Error", "error", "An error occurred while updating the notification.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/api/notifications/${id}`,
        { withCredentials: true }
      );
      showToast("Notification deleted", "success", "Notification successfully deleted.");
      fetchNotifications();
    } catch (error) {
      console.error("Error deleting notification:", error);
      showToast("Error", "error", "An error occurred while deleting the notification.");
    }
  };

  const NotificationModal = ({ isOpen, onClose, isEdit }) => (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isEdit ? "Edit" : "Create New"} Notification</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Message</FormLabel>
            <Input
              placeholder="Message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={isEdit ? handleUpdate : handleCreate}>
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading color={textColor}>Notifications for User ID: {UserID}</Heading>
        <Button leftIcon={<AddIcon />} colorScheme="teal" onClick={handleNew}>
          Create New Notification
        </Button>
        <Box overflowX="auto" bg={bgColor} borderRadius="lg" boxShadow="md">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>User ID</Th>
                <Th>Message</Th>
                <Th>Is Read</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {notifications.map((notification) => (
                <Tr key={notification.id}>
                  <Td>{notification.userId}</Td>
                  <Td>{notification.message}</Td>
                  <Td>{notification.isRead ? "Yes" : "No"}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <Button size="sm" leftIcon={<EditIcon />} colorScheme="teal" onClick={() => handleEdit(notification)}>
                        Edit
                      </Button>
                      <Button size="sm" leftIcon={<DeleteIcon />} colorScheme="red" onClick={() => handleDelete(notification.id)}>
                        Delete
                      </Button>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>
      <NotificationModal isOpen={isOpenEdit} onClose={onCloseEdit} isEdit={true} />
      <NotificationModal isOpen={isOpenNew} onClose={onCloseNew} isEdit={false} />
    </Container>
  );
}

export default AdminNotificationsPanel;