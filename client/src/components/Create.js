import { useState, useRef } from 'react';
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast
} from '@chakra-ui/react';
import DatePicker from './DatePicker/DatePicker';

export default function Create() {
  const nameRef = useRef(null);
  const topicRef = useRef(null);
  const [date, setDate] = useState(new Date());
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = JSON.stringify({
      'name': nameRef.current.value,
      'title': topicRef.current.value,
      'time_started': date.toUTCString(),
      'time_estimate':{
        'hours': parseInt(hours),
        'minutes': parseInt(minutes)
      }
    });

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: 'cors',
      body: body,
    };

    const response = await fetch('http://127.0.0.1:5000/room/create', options);
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
      bg={'gray.50'}>
        <Box
          w='100%'
          rounded={'lg'}
          bg={'white'}
          boxShadow={'lg'}
          p={8}>
          <form onSubmit={handleSubmit}>
           <Stack spacing={4}>
            <Heading fontSize={'2xl'} alignSelf='center'>Create a meeting</Heading>
              <FormControl id="name">
                <FormLabel>Name</FormLabel>
                <Input type="text" ref={nameRef}/>
              </FormControl>
              <FormControl id="topic">
                <FormLabel>First topic</FormLabel>
                <Input type="text" ref={topicRef}/>
              </FormControl>
              <FormControl id="Starting Time">
                <FormLabel>Starting Time</FormLabel>
                <DatePicker
                  selectedDate={date}
                  onChange={(d) => setDate(d)}
                  showPopperArrow={true}
                  isClearable={true}
                />
              </FormControl>
              <Flex flexDirection='row' gap={2}>
                <FormControl>
                  <FormLabel>Hours</FormLabel>
                  <NumberInput value={hours} min={0} max={23} onChange={(value) => setHours(value)}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl>
                  <FormLabel>Minutes</FormLabel>
                  <NumberInput value={minutes} min={0} max={59} onChange={(value) => setMinutes(value)}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </Flex>
              <Button
                colorScheme='teal'
                type='submit'
                w='100%'
              >
                Create Room
              </Button>  
            </Stack>
          </form>
        </Box>
    </Flex>
  );
}
