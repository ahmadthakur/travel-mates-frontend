import { useContext, useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useColorModeValue,
  Stack,
  useToast,
  Text,
  MenuDivider,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, BellIcon } from "@chakra-ui/icons";
import { UserAuthContext } from "../utils/UserAuthContext";
import axios from "axios";

export default function Simple() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { setIsAuthenticated } = useContext(UserAuthContext);
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const savedUser = JSON.parse(localStorage.getItem("user"));

  const handleLogout = async () => {
    localStorage.removeItem("user");
      savedUser.user = null;
      setIsAuthenticated(false);
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

    fetchNotifications();
  }, []);

  return (
    <>
      <Box
        bg={useColorModeValue("gray.100", "gray.900")}
        px={4}
        position="fixed"
        top={0}
        my={4}
        left={4}
        right={4}
        zIndex={1}
        shadow="lg"
        borderRadius="xl"
      >
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Link to="/">
              <Box>Travel Mates</Box>
            </Link>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              <NavLink to={"/"}>Home</NavLink>
              <NavLink to={"/about"}>About</NavLink>
              <NavLink to={"/contact"}>Contact</NavLink>
            </HStack>
          </HStack>

          <Flex alignItems={"center"} gap={4}>
            {/* Notifications Menu */}
            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
              >
                <BellIcon />
              </MenuButton>
              <MenuList>
                {notifications.map((notification) => {
                  const notificationDate = new Date(notification.createdAt);
                  const now = new Date();
                  const diffInSeconds = Math.abs(
                    (now - notificationDate) / 1000
                  );
                  let timeAgo = "";

                  if (diffInSeconds < 60) {
                    timeAgo = `${Math.round(diffInSeconds)}s`;
                  } else if (diffInSeconds < 3600) {
                    timeAgo = `${Math.round(diffInSeconds / 60)}m`;
                  } else if (diffInSeconds < 86400) {
                    timeAgo = `${Math.round(diffInSeconds / 3600)}h`;
                  } else {
                    timeAgo = `${Math.round(diffInSeconds / 86400)}d`;
                  }

                  return (
                    <>
                      <Flex key={notification.id} bg="white" m={2} p={4} justifyContent="space-between">
                        <Text fontSize="md" fontWeight="normal">
                          {notification.message}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {timeAgo}
                        </Text>
                      </Flex>
                    <MenuDivider />
                    </>
                  
                  );
                })}
              </MenuList>
            </Menu>

            {/* User Menu */}
            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
              >
                <Avatar
                  size={"sm"}
                  name={`${savedUser.user.first_name} ${savedUser.user.last_name}`}
                />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              <NavLink to={"/"}>Home</NavLink>
              <NavLink to={"/about"}>About</NavLink>
              <NavLink to={"/contact"}>Contact</NavLink>
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
