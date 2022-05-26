import React, { useState } from "react";
import {
  Avatar,
  Box,
  Collapse,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Icon,
  IconButton,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import {  
  MdKeyboardArrowRight,
  MdTopic
} from "react-icons/md";
import { useAuth } from "../contexts/AuthProvider";
  
  export default function Meeting({ children }) {
    const sidebar = useDisclosure();
    const topics = useDisclosure();
    const { user } = useAuth()
  
    const NavItem = (props) => {
      const { icon, children, ...rest } = props;
      return (
        <Flex
          align="center"
          px="4"
          pl="4"
          py="3"
          cursor="pointer"
          color="inherit"
          _hover={{
            bg: "gray.100",
            color: "gray.900",
          }}
          role="group"
          fontWeight="semibold"
          transition=".15s ease"
          {...rest}
        >
          {icon && (
            <Icon
              mx="2"
              boxSize="4"
              _groupHover={{
                color: "gray.600",
              }}
              as={icon}
            />
          )}
          {children}
        </Flex>
      );
    };
  
    const SidebarContent = (props) => (
      <Box
        as="nav"
        pos="fixed"
        top="0"
        left="0"
        zIndex="sticky"
        h="full"
        pb="10"
        overflowX="hidden"
        overflowY="auto"
        bg="white"
        borderColor="inherit"
        borderRightWidth="1px"
        w="60"
        {...props}
      >
        <Flex px="4" py="5" align="center">
          <Text
            fontSize="2xl"
            ml="2"
            fontWeight="semibold"
          >
            Chat
          </Text>
        </Flex>
        <Flex
          direction="column"
          as="nav"
          fontSize="sm"
          color="gray.600"
          aria-label="Main Navigation"
        >
          <NavItem icon={MdTopic}>
            Topics
            <IconButton
              onClick={topics.onToggle}
              as={MdKeyboardArrowRight}
              ml="auto"
              size='xs'
              transform={topics.isOpen && "rotate(90deg)"}
            />
          </NavItem>
          <Collapse in={topics.isOpen}>
                <NavItem py="2">
                    Topic 1
                </NavItem>
          </Collapse>
        </Flex>
      </Box>
    );
    return (
      <Box
        as="section"
        bg={"gray.50"}
        h="100%"
        w="100%"
      >
        <SidebarContent display={{ base: "none", md: "unset" }} />
        <Drawer
          isOpen={sidebar.isOpen}
          onClose={sidebar.onClose}
          placement="left"
        >
          <DrawerOverlay />
          <DrawerContent>
            <SidebarContent w="full" borderRight="none" />
          </DrawerContent>
        </Drawer>
        <Box ml={{ base: 0, md: 60 }} transition=".3s ease">
          <Flex
            as="header"
            flexDirection="row"
            alignItems="center"
            justifyContent="flex-end"
            px="4"
            bg="white"
            borderBottomWidth="1px"
            borderColor="inherit"
            h="10vh"
          >
            <IconButton
              aria-label="Menu"
              display={{ base: "inline-flex", md: "none" }}
              onClick={sidebar.onOpen}
              icon={<FiMenu />}
              size="sm"
            />
              <Avatar
                ml="4"
                size="sm"
                name={user.name}
                bg='gray.300'
                cursor="pointer"
              />
          </Flex>
          <Box as="main" px="4" h='90vh'>
            { children }
          </Box>
        </Box>
      </Box>
    );
  }
  