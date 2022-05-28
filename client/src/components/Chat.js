import { useEffect, useRef, useState} from 'react';
import {
    Box,
    Flex,
    Button,
    Input,
    InputRightElement,
    InputGroup,
    VStack,
    HStack,
    Divider,
    Text
} from '@chakra-ui/react';
import Message from './Message';
import { useSocket } from '../contexts/SocketProvider';
import { useAuth } from '../contexts/AuthProvider';

const Chat = () => {
    const inputRef = useRef(null);
    const socket = useSocket();
    const { user } = useAuth();

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if(socket == null) return;

        socket.on('join_chat', (data) => {
            setMessages(prev => [...prev, data])
        });

        socket.on('send_message', (data) => {
            setMessages(prev => [...prev, data]);
        });

        return () => {
            socket.off('join_chat')
            socket.off('send_message')
        }
    }, [])

    const sendMessage = () => {
        const message = inputRef.current.value;
        if(message){
            socket.emit('message', {
                'code': user.roomcode,
                'name': user.name,
                'id': user.id,
                'message': message
            })
            inputRef.current.value = '';
        }
    }

    useEffect(() => {
        console.log(messages)
    }, [messages])

    return (
        <Flex w='100%' h='full' flexDirection='column' id='chat'>
            <VStack overflow='auto' w='100%'>
                {messages.map((message, id) => {
                    if (message.user_id === 'admin'){
                        return (
                            <HStack key={id} w='100%'>
                                <Divider />
                                    <Text 
                                        fontSize="sm" 
                                        whiteSpace="nowrap" 
                                        color="muted"
                                    >
                                        {message.message}
                                    </Text>
                                <Divider />
                            </HStack>
                        )
                    }
                    return (
                        <Message 
                            key={id} 
                            message={message.message} 
                            sender={user.id === message.user_id}
                            name={message.name}
                        />
                    )
                })}
            </VStack>
            <Box mt='auto'>
                <InputGroup size='lg' w='full' mt='auto'>
                    <Input
                        ref={inputRef} 
                        pr='16' 
                        placeholder='Your message'
                        onKeyDown={(event) => {
                            event.key === 'Enter' && sendMessage();
                        }}
                    />
                    <InputRightElement width='16'>
                        <Button 
                            colorScheme='blue' 
                            onClick={sendMessage}
                        >
                            Send
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </Box>
        </Flex>
    );
};

export default Chat;