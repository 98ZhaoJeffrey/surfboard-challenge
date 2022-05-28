import React, { useEffect, useState } from "react";
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
  Button,
  MenuButton,
  Menu,
  MenuItem,
  MenuList,
  HStack,
  useClipboard,
  useToast
} from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import {  
  MdKeyboardArrowRight,
  MdKeyboardArrowDown,
  MdTopic
} from "react-icons/md";
import { useAuth } from "../contexts/AuthProvider";
import { useSocket } from "../contexts/SocketProvider";
import Window from "../components/Window";
import TopicsModal from "../components/TopicsModal";
import AddTopicForm from "../components/AddTopicForm";

export default function Meeting() {
  const sidebar = useDisclosure();
  const topics = useDisclosure();
  const addModal = useDisclosure();
  const { user, setUser } = useAuth()
  const socket = useSocket();

  const [meetingTopics, setMeetingTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const { onCopy } = useClipboard(`Join the room with code: ${user.roomcode}`);
  const toast = useToast();

  useEffect(() => {
    const getData = async () => {
      const body = JSON.stringify({
        'code': user.roomcode,
      });
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: 'cors',
        body: body,
      };

      const response = await fetch('http://127.0.0.1:5000/room/topics', options);
      const result = await response.json();
      setMeetingTopics(result['data']['topics'])

      if(result['data']['topics'] !== []){
        setSelectedTopic(result['data']['topics'][0])
      }
    }
    getData();
  }, [])

  useEffect(() => {
    socket.on('topics', (data) => {
      setMeetingTopics(data['topics'])

      if(data['topics'] !== []){
        setSelectedTopic(data['topics'][0])
      }
    });

    socket.on('errors', (data) => {
      toast({
        title: 'Error',
        description: data.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
    });
    })
    return () => {
      socket.off('topics');
      socket.off('errors')
    }
  }, [])

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
        {user.id === user.hostId &&
          <Button w='100%' my='2' onClick={addModal.onOpen}>
            Add topic
          </Button>
        }
          {meetingTopics.map((topic) =>{ return (
              <NavItem py="2" key={topic.id} onClick={() => setSelectedTopic(topic)}>
                  {topic.title}
              </NavItem>
          )})}
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
        <Menu>
          <MenuButton as='button'>
            <HStack>
              <Avatar
                ml="4"
                size="sm"
                name={user.name}
                bg='gray.300'
                cursor="pointer"
              />
               <Text fontSize="sm">{user.name}</Text>
              <Box display={{ base: 'none', md: 'flex' }}>
                <MdKeyboardArrowDown />
              </Box>
            </HStack>
          </MenuButton>
          <MenuList>
            <MenuItem onClick={onCopy}>Invite users</MenuItem>
            <MenuItem onClick={() => setUser(null)}>Logout</MenuItem>
          </MenuList>
        </Menu>
        </Flex>
        <Box as="main" px="4" h='90vh'>
          <Window topic={selectedTopic}/>
          <TopicsModal 
            disclosure={addModal} 
            title="Add topic" 
            id="add" 
            children={<AddTopicForm/>}
          />
        </Box>
      </Box>
    </Box>
  );
};
