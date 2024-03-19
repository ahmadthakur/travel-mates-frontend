import React, { ReactNode } from "react";
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  useToast,
} from "@chakra-ui/react";
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
  FiUser,
  FiLogOut,
} from "react-icons/fi";
import { IconType } from "react-icons";
import { ReactText } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Sidebar({element}) {

   
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
       {element}
      </Box>
    </>
  );
}

const SidebarContent = ({ onClose, ...rest }) => {

    const toast = useToast();
    const navigate = useNavigate();
    
    const handleLogout = async () => {
        try {
          await axios.post(
            `${process.env.REACT_APP_SERVER_URL}/admin/admin/logout`,
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

  return (
    <Box
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Logo
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {/* {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon}>
          {link.name}
        </NavItem>
      ))} */}

      <NavLink to="/admin">
        <NavItem icon={FiHome}>Home</NavItem>
      </NavLink>

      <NavLink to="/admin/users">
        <NavItem icon={FiUser}>Users</NavItem>
      </NavLink>

      <NavLink to="/admin/accommodations">
        <NavItem icon={FiHome}>Accommodations</NavItem>
      </NavLink>

      <NavLink to="/admin/destinations">
        <NavItem icon={FiCompass}>Destinations</NavItem>
      </NavLink>

      <NavItem icon={FiLogOut} onClick={handleLogout}>
        Logout
      </NavItem>
    </Box>
  );
};

const NavItem = ({ icon, children, ...rest }) => {
  return (
    <Box
      as="a"
      href="#"
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "cyan.400",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  );
};

const MobileNav = ({ onOpen, ...rest }) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
        Logo
      </Text>
    </Flex>
  );
};
