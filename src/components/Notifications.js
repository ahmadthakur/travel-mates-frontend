import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  VStack,
  Heading,
  Text,
  Flex,
  Badge,
  useToast,
  Container,
  Icon,
  Avatar,
  Divider,
  Skeleton,
} from "@chakra-ui/react";
import { FaBell, FaCheckCircle, FaClock } from "react-icons/fa";

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/notifications`, {
        withCredentials: true,
      });
      setNotifications(response.data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast({
        title: "Error",
        description: "Failed to fetch notifications. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/notifications/${notificationId}/read`,
        {},
        { withCredentials: true }
      );
      setNotifications(
        notifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
      toast({
        title: "Success",
        description: "Notification marked as read.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark notification as read. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Container maxW="container.lg" py={8}>
      <Heading size="xl" mb={6}>
        <Flex align="center">
          <Icon as={FaBell} mr={2} color="teal.500" />
          Notifications
        </Flex>
      </Heading>
      {loading ? (
        <VStack spacing={4} align="stretch">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} height="100px" />
          ))}
        </VStack>
      ) : notifications.length === 0 ? (
        <Box textAlign="center" py={10} bg="gray.50" borderRadius="lg">
          <Icon as={FaBell} boxSize={10} color="gray.400" mb={4} />
          <Heading size="md">No notifications</Heading>
          <Text mt={2} color="gray.500">
            You're all caught up!
          </Text>
        </Box>
      ) : (
        <VStack spacing={4} align="stretch">
          {notifications.map((notification) => (
            <Box
              key={notification.id}
              p={5}
              shadow="md"
              borderWidth="1px"
              borderRadius="lg"
              bg={notification.read ? "gray.50" : "white"}
              transition="all 0.2s"
              _hover={{ shadow: "lg" }}
            >
              <Flex>
                <Avatar src={notification.avatar || "https://bit.ly/broken-link"} mr={4} />
                <Box flex={1}>
                  <Flex justify="space-between" align="center" mb={2}>
                    <Heading fontSize="lg" color="teal.600">
                      {notification.title}
                    </Heading>
                    <Badge colorScheme={notification.read ? "gray" : "teal"} variant="subtle">
                      {notification.read ? "Read" : "New"}
                    </Badge>
                  </Flex>
                  <Text color="gray.600" mb={2}>
                    {notification.message}
                  </Text>
                  <Flex justify="space-between" align="center">
                    <Text fontSize="sm" color="gray.500">
                      <Icon as={FaClock} mr={1} />
                      {formatDate(notification.createdAt)}
                    </Text>
                    {!notification.read && (
                      <Button
                        size="sm"
                        colorScheme="teal"
                        variant="outline"
                        leftIcon={<FaCheckCircle />}
                        onClick={() => markAsRead(notification.id)}
                      >
                        Mark as read
                      </Button>
                    )}
                  </Flex>
                </Box>
              </Flex>
            </Box>
          ))}
        </VStack>
      )}
    </Container>
  );
}

export default NotificationsPage;