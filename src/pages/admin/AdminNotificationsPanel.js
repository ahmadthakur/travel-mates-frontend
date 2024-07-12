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
  Switch,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon, AddIcon } from "@chakra-ui/icons";
import { useParams } from "react-router-dom";
import axios from "axios";

const initialFormState = {
  message: "",
  isRead: false,
};

function NotificationModal({ isOpen, onClose, isEdit, initialData, onSave }) {
  const [formData, setFormData] = useState(initialData || initialFormState);

  useEffect(() => {
    setFormData(initialData || initialFormState);
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'isRead' ? checked : value
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isEdit ? "Edit" : "Create New"} Notification</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>Message</FormLabel>
            <Input
              name="message"
              placeholder="Message"
              value={formData.message}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl display="flex" alignItems="center">
            <FormLabel mb="0">Is Read</FormLabel>
            <Switch
              name="isRead"
              isChecked={formData.isRead}
              onChange={handleInputChange}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function AdminNotificationsPanel() {
  const { UserID } = useParams();
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const toast = useToast();
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
    onOpenEdit();
  };

  const handleNew = () => {
    setSelectedNotification(null);
    onOpenNew();
  };

  const handleCreate = async (newNotification) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/notifications/notifications`,
        { ...newNotification, userId: UserID },
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

  const handleUpdate = async (updatedNotification) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/api/notifications/${selectedNotification.id}`,
        { ...updatedNotification, id: selectedNotification.id, userId: UserID },
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
      <NotificationModal 
        isOpen={isOpenEdit} 
        onClose={onCloseEdit} 
        isEdit={true} 
        initialData={selectedNotification}
        onSave={handleUpdate}
      />
      <NotificationModal 
        isOpen={isOpenNew} 
        onClose={onCloseNew} 
        isEdit={false} 
        initialData={null}
        onSave={handleCreate}
      />
    </Container>
  );
}

export default AdminNotificationsPanel;