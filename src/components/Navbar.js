import axios from "axios";
import {
  Box,
  Stack,
  Heading,
  Avatar,
  Text,
  useMediaQuery,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  VStack,
  useToast,
  Button,
  Spinner,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Modal,
} from "@chakra-ui/react";
import { HamburgerIcon, BellIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AiOutlineLogout } from "react-icons/ai";

function Navbar(isLoggedIn) {
  const [data, setData] = useState(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isSmallScreen] = useMediaQuery("(max-width: 600px)");
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/users/users/logout`,
        {},
        { withCredentials: true }
      );
      toast({
        title: "Logged out successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast({
        title: "Logout failed.",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleNotificationsOpen = () => setIsNotificationsOpen(true);
  const handleNotificationsClose = () => setIsNotificationsOpen(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/users/users/dashboard`,
          { withCredentials: true }
        );
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/notifications/notifications/`,
          { withCredentials: true }
        );
        setNotifications(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (isLoggedIn) {
      fetchNotifications();
    }
  }, [isLoggedIn]);

  if (!data) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <Spinner
          size="xl"
          speed="0.65s"
          color="blue.500"
          emptyColor="gray.200"
          thickness="4px"
        />
        <Text mt={4} fontSize="lg" fontWeight="semibold" color="gray.500">
          Loading...
        </Text>
      </Box>
    );
  }
  return (
    <Box as="nav" bg="white" p={5} position="sticky" top={0} zIndex={1}>
      <Stack
        direction="row"
        spacing={8}
        align="center"
        justifyContent="space-between"
      >
        <Link to="/">
          <Heading size="lg" color="teal.500">
            Travel Mates
          </Heading>
        </Link>

        {isLoggedIn &&
          data &&
          (isSmallScreen ? (
            <>
              <IconButton icon={<HamburgerIcon />} onClick={handleOpen} />
              <Drawer isOpen={isOpen} onClose={handleClose}>
                <DrawerOverlay>
                  <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerBody>
                      <VStack spacing={4} mt={4}>
                        <Link to="/dashboard">
                          <Avatar
                            name={`${data.user.first_name} ${data.user.last_name}`}
                            size="sm"
                            onClick={handleClose}
                          />
                        </Link>
                        <IconButton
                          aria-label="Logout"
                          icon={<AiOutlineLogout />}
                          onClick={handleLogout}
                        />
                        <IconButton
                          icon={<BellIcon />}
                          onClick={handleNotificationsOpen}
                        />
                      </VStack>
                    </DrawerBody>
                  </DrawerContent>
                </DrawerOverlay>
              </Drawer>
            </>
          ) : (
            <Stack direction="row" align="center" spacing={4}>
              <Link to="/dashboard">
                <Avatar
                  name={`${data.user.first_name} ${data.user.last_name}`}
                  size="sm"
                />
              </Link>
              <Text fontWeight="bold">{`${data.user.first_name} ${data.user.last_name}`}</Text>
              <IconButton
                icon={<BellIcon />}
                onClick={handleNotificationsOpen}
              />
              <Button onClick={handleLogout} colorScheme="teal">
                Logout
              </Button>
            </Stack>
          ))}
      </Stack>

      <Modal isOpen={isNotificationsOpen} onClose={handleNotificationsClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Notifications</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {notifications.map((notification) => (
              <Box
                key={notification.id}
                bg="white"
                m={2}
                p={4}
                borderRadius="md"
                boxShadow="md"
                border="1px solid"
                borderColor="gray.200"
              >
                <Text fontSize="lg" fontWeight="bold" mb={2}>
                  {notification.message}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {new Date(notification.createdAt).toLocaleDateString("en-GB")}
                </Text>
              </Box>
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Navbar;
