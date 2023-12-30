import {
  Box,
  Stack,
  Link,
  Heading,
  useBreakpointValue,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { HamburgerIcon } from "@chakra-ui/icons";

function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isSmallScreen = useBreakpointValue({ base: true, md: false });

  return (
    <Box as="nav" bg="white" padding={5}>
      <Stack
        direction={isSmallScreen ? "column" : "row"}
        spacing={8}
        align="center"
        justifyContent="center"
      >
        <Heading size="lg" color="black">
          Travel Mates
        </Heading>
        {isSmallScreen ? (
          <>
            <IconButton
              icon={<HamburgerIcon />}
              onClick={onOpen}
              color="white"
            />
            <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
              <DrawerOverlay>
                <DrawerContent>
                  <DrawerCloseButton />
                  <DrawerHeader>Menu</DrawerHeader>
                  <DrawerBody>
                    <Link
                      as={RouterLink}
                      to="/"
                      onClick={onClose}
                      color="black"
                    >
                      Home
                    </Link>
                    <Link
                      as={RouterLink}
                      to="/about"
                      onClick={onClose}
                      color="black"
                    >
                      About
                    </Link>
                    <Link
                      as={RouterLink}
                      to="/contact"
                      onClick={onClose}
                      color="black"
                    >
                      Contact
                    </Link>
                    <Link
                      as={RouterLink}
                      to="/dashboard"
                      onClick={onClose}
                      color="black"
                    >
                      Profile
                    </Link>
                  </DrawerBody>
                </DrawerContent>
              </DrawerOverlay>
            </Drawer>
          </>
        ) : (
          <>
            <Link as={RouterLink} to="/" color="black">
              Home
            </Link>
            <Link as={RouterLink} to="/about" color="black">
              About
            </Link>
            <Link as={RouterLink} to="/contact" color="black">
              Contact
            </Link>
            <Link as={RouterLink} to="/dashboard" color="black">
              Profile
            </Link>
          </>
        )}
      </Stack>
    </Box>
  );
}

export default Navbar;
