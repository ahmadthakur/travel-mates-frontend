import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, List, ListItem, Heading, Text } from "@chakra-ui/react";

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/notifications", {
          withCredentials: true,
        });
        setNotifications(response.data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchData();
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      await axios.post(
        `/api/notifications/${notificationId}/read`,
        {},
        { withCredentials: true }
      );
      setNotifications(
        notifications.filter(
          (notification) => notification.id !== notificationId
        )
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  if (notifications.length === 0) {
    return <Heading size="md">No notifications</Heading>;
  }

  return (
    <List spacing={3}>
      {notifications.map((notification) => (
        <ListItem key={notification.id}>
          <Box p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">{notification.title}</Heading>
            <Text mt={4}>{notification.message}</Text>
            <Button
              mt={4}
              colorScheme="blue"
              onClick={() => markAsRead(notification.id)}
            >
              Mark as read
            </Button>
          </Box>
        </ListItem>
      ))}
    </List>
  );
}

export default NotificationsPage;
