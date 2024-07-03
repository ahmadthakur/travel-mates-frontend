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
  Stack,
  useToast,
  Text,
  MenuDivider,
  Container,
  VStack,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { FaRegBell } from "react-icons/fa";
import {
  FiChevronDown,
  FiUser,
  FiSettings,
  FiLogOut,
  FiLogIn,
  FiUserPlus,
} from "react-icons/fi";
import { UserAuthContext } from "../utils/UserAuthContext";
import axios from "axios";

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { isAuthenticated, setIsAuthenticated } = useContext(UserAuthContext);
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const savedUser = JSON.parse(localStorage.getItem("user"));

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/users/users/logout`,
        {},
        { withCredentials: true }
      );
      localStorage.removeItem("user");
      setIsAuthenticated(false);
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
      if (isAuthenticated) {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_SERVER_URL}/api/notifications/notifications/`,
            { withCredentials: true }
          );
          setNotifications(response.data);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchNotifications();
  }, [isAuthenticated]);

  return (
    <Box
      bg={"gray.100"}
      px={4}
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={20}
      boxShadow="sm"
    >
      <Container maxW="container.xl">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <IconButton
            size="md"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Open Menu"
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems="center">
            <Link to="/">
              <Text fontSize="xl" fontWeight="bold" color="teal.500">
                Travel Mates
              </Text>
            </Link>
            <HStack as="nav" spacing={4} display={{ base: "none", md: "flex" }}>
              <NavLink
                to="/"
                style={({ isActive }) => ({
                  color: isActive ? "teal.500" : "inherit",
                })}
              >
                Home
              </NavLink>
              <NavLink
                to="/about"
                style={({ isActive }) => ({
                  color: isActive ? "teal.500" : "inherit",
                })}
              >
                About
              </NavLink>
              <NavLink
                to="/contact"
                style={({ isActive }) => ({
                  color: isActive ? "teal.500" : "inherit",
                })}
              >
                Contact
              </NavLink>
            </HStack>
          </HStack>

          <Flex alignItems="center" gap={4} >
            {isAuthenticated ? (
              <>
                <Menu>
                  <MenuButton
                    as={IconButton}
                    aria-label="Notifications"
                    icon={<FaRegBell />}
                    variant="ghost"
                    colorScheme="teal"
                    position="relative"
                  >
                    {notifications.length > 0 && (
                      <Box
                        position="absolute"
                        top="-1px"
                        right="-1px"
                        px={2}
                        py={1}
                        fontSize="xs"
                        fontWeight="bold"
                        lineHeight="none"
                        color="white"
                        transform="translate(50%,-50%)"
                        bg="red.500"
                        rounded="full"
                        zIndex={10}
                      >
                        {notifications.length}
                      </Box>
                    )}
                  </MenuButton>
                  <MenuList
                    zIndex={2}
                    maxH="300px"
                    overflowY="auto"
                    width="300px"
                    boxShadow="xl"
                  >
                    <Text
                      fontWeight="bold"
                      p={3}
                      borderBottom="1px"
                      borderColor="gray.200"
                    >
                      Notifications
                    </Text>
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <MenuItem
                          key={notification.id}
                          _hover={{ bg: "gray.100" }}
                        >
                          <VStack align="start" spacing={1} width="100%"  zIndex={10}>
                            <Text fontSize="sm" fontWeight="medium">
                              {notification.message}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              {formatTimeAgo(notification.createdAt)}
                            </Text>
                          </VStack>
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem>No new notifications</MenuItem>
                    )}
                    {notifications.length > 0 && (
                      <Box borderTop="1px" borderColor="gray.200" p={2}>
                        <Button size="sm" width="100%" variant="ghost">
                          View All Notifications
                        </Button>
                      </Box>
                    )}
                  </MenuList>
                </Menu>
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded="full"
                    variant="link"
                    cursor="pointer"
                    minW={0}
                  >
                    <HStack>
                      <Avatar
                        size="sm"
                        name={`${savedUser.user.first_name} ${savedUser.user.last_name}`}
                        src={savedUser.user.avatar}
                      />
                      <VStack
                        display={{ base: "none", md: "flex" }}
                        alignItems="flex-start"
                        spacing="1px"
                        ml="2"
                      >
                        <Text fontSize="sm">
                          {savedUser.user.first_name} {savedUser.user.last_name}
                        </Text>
                        <Text fontSize="xs" color="gray.600">
                          {savedUser.user.email}
                        </Text>
                      </VStack>
                      <Box display={{ base: "none", md: "flex" }}>
                        <FiChevronDown />
                      </Box>
                    </HStack>
                  </MenuButton>
                  <MenuList zIndex={2} boxShadow="xl">
                    <MenuItem as={Link} to="/dashboard" icon={<FiUser />}>
                      Profile
                    </MenuItem>
                    <MenuItem as={Link} to="/settings" icon={<FiSettings />}>
                      Settings
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem onClick={handleLogout} icon={<FiLogOut />}>
                      Logout
                    </MenuItem>
                  </MenuList>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  as={Link}
                  to="/login"
                  colorScheme="teal"
                  variant="ghost"
                  leftIcon={<FiLogIn />}
                >
                  Login
                </Button>
                <Button
                  as={Link}
                  to="/register"
                  colorScheme="teal"
                  leftIcon={<FiUserPlus />}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Flex>
        </Flex>

        {isOpen && (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as="nav" spacing={4}>
              <NavLink to="/" onClick={onClose}>
                Home
              </NavLink>
              <NavLink to="/about" onClick={onClose}>
                About
              </NavLink>
              <NavLink to="/contact" onClick={onClose}>
                Contact
              </NavLink>
            </Stack>
          </Box>
        )}
      </Container>
    </Box>
  );
}

function formatTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
}
