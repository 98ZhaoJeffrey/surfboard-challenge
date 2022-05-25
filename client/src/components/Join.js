import { useRef } from 'react';
import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Button,
    Heading,
    useToast
  } from '@chakra-ui/react';
  
  export default function Join() {

    const nameRef = useRef(null);
    const codeRef = useRef(null);
    const toast = useToast();

    const handleSubmit = async (e) => {
      e.preventDefault();
      const body = JSON.stringify({
        'name': nameRef.current.value,
        'code': codeRef.current.value,
      });
  
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: 'cors',
        body: body,
      };
  
      const response = await fetch('http://127.0.0.1:5000/room/join', options);
      const result = await response.json()
      toast({
        title: result.status,
        description: result.data.message,
        status: result.status.toLowerCase(),
        duration: 9000,
        isClosable: true,
      });
    }

    return (
      <Flex
        h={'auto'}
        align={'center'}
        justify={'center'}
        bg='gray.50'>
          <Box
            w='100%'
            rounded={'lg'}
            bg={'white'}
            boxShadow={'lg'}
            p={8}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={6}>
              <Heading fontSize={'2xl'} alignSelf='center'>Join a meeting</Heading>
                <FormControl id="name">
                  <FormLabel>Name</FormLabel>
                  <Input type="text" ref={nameRef}/>
                </FormControl>
                <FormControl id="code">
                  <FormLabel>Room code</FormLabel>
                  <Input type="text" ref={codeRef}/>
                </FormControl>
                  <Button
                      colorScheme='purple'
                      type='submit'
                  >
                    Join Room
                  </Button>
              </Stack>
            </form>
          </Box>
      </Flex>
    );
  }
  