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
  Textarea,
  useToast
} from '@chakra-ui/react';
import DatePicker from './DatePicker/DatePicker';
import { useSocket } from '../contexts/SocketProvider';

export default function EditTopicForm(props) {
  const [descriptionValue, setDescriptionValue] = useState(props.description);
  const topicRef = useRef(null);
  const [date, setDate] = useState(new Date(props.date));
  const [hours, setHours] = useState(props.hours);
  const [minutes, setMinutes] = useState(props.minutes);
  const toast = useToast();
  const socket = useSocket();

  const handleSubmit = async (e) => {
    try{
      if(!topicRef.current.value) return;
      e.preventDefault();
      console.log(date.toUTCString())
      socket.emit('edit_topic', {
        'topic_id': props.topicId,
        'title': topicRef.current.value,
        'description': descriptionValue,
        'time_started': date.toUTCString(),
        'time_estimate':{
          'hours': parseInt(hours),
          'minutes': parseInt(minutes)
        }
      });
      toast({
        title: 'Success',
        description: 'Editted topic',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    }
    catch (error){
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again later.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
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
              <FormControl id="topic">
                <FormLabel>Topic Name</FormLabel>
                <Input type="text" ref={topicRef} defaultValue={props.title}/>
              </FormControl>
              <FormControl id="description">
                <FormLabel>Description</FormLabel>
                <Textarea 
                    placeholder="Topic's description" 
                    resize='vertical' 
                    value={descriptionValue}
                    onChange={(e) => setDescriptionValue(e.target.value)}
                />
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
                colorScheme='purple'
                type='submit'
                w='100%'
              >
                Edit topic
              </Button>  
            </Stack>
          </form>
        </Box>
    </Flex>
  );
}
