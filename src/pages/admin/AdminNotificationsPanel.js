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
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function AdminNotificationsPanel() {
  const { UserID } = useParams();
  console.log(UserID);
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const toast = useToast();

  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [isRead, setIsRead] = useState(false);

  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();
  const {
    isOpen: isOpenNew,
    onOpen: onOpenNew,
    onClose: onCloseNew,
  } = useDisclosure();

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/notifications/notifications/${UserID}`,
        { withCredentials: true }
      );
      setNotifications(response.data);
      console.log(UserID);
    } catch (error) {
      console.error(error);
    }
  }, [UserID]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleEdit = (notification) => {
    setSelectedNotification(notification);
    setUserId(notification.userId);
    setMessage(notification.message);
    setIsRead(notification.isRead);
    onOpenEdit();
  };

  const handleNew = () => {
    setSelectedNotification(null);
    setUserId("");
    setMessage("");
    setIsRead(false);
    onOpenNew();
  };

  const handleCreate = async (newNotification) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/notifications/notifications`,
        newNotification,
        { withCredentials: true }
      );
      toast({
        title: "Notification created.",
        description: "Notification successfully created.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });

      fetchNotifications();
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred.",
        description: "An error occurred while creating the notification.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handleUpdate = async (updatedNotification) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/api/notifications/${updatedNotification.id}`,
        updatedNotification,
        { withCredentials: true }
      );
      toast({
        title: "Notification updated.",
        description: "Notification successfully updated.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      fetchNotifications();
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred.",
        description: "An error occurred while updating the notification.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/api/notifications/${id}`,
        { withCredentials: true }
      );
      toast({
        title: "Notification deleted.",
        description: "Notification successfully deleted.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      fetchNotifications();
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred.",
        description: "An error occurred while deleting the notification.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Box m={4} p={5} height="100vh">
      <Heading mb={4}>Notifications</Heading>
      <Button onClick={handleNew} colorScheme="blue">
        Create New Notification
      </Button>
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
              <Td>{notification.isRead}</Td>
              <Td>
                <HStack spacing={3}>
                  <Button
                    onClick={() => handleEdit(notification)}
                    colorScheme="teal"
                    leftIcon={<EditIcon />}
                    width="100px"
                  >
                    Edit
                  </Button>

                  <Button
                    onClick={async () => {
                      await handleDelete(notification.id);
                      const updatedNotifications = notifications.filter(
                        (n) => n.id !== notification.id
                      );
                      setNotifications(updatedNotifications);
                    }}
                    colorScheme="red"
                    leftIcon={<DeleteIcon />}
                    width="100px"
                  >
                    Delete
                  </Button>
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Modal isOpen={isOpenEdit} onClose={onCloseEdit}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Notification</ModalHeader>
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
            <Button
              colorScheme="blue"
              mr={3}
              onClick={async () => {
                const updatedNotification = {
                  id: selectedNotification.id,
                  userId: UserID,
                  message,
                  isRead,
                };
                await handleUpdate(updatedNotification);
                onCloseEdit();
              }}
            >
              Save
            </Button>
            <Button variant="ghost" onClick={onCloseEdit}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpenNew} onClose={onCloseNew}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Notification</ModalHeader>
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
            <Button
              colorScheme="blue"
              mr={3}
              onClick={async () => {
                const newNotification = {
                  userId: UserID,
                  message,
                  isRead,
                };
                await handleCreate(newNotification);
                console.log(newNotification);
                onCloseNew();
              }}
            >
              Save
            </Button>
            <Button variant="ghost" onClick={onCloseNew}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default AdminNotificationsPanel;
