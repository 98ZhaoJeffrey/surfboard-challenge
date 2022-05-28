import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Text
} from '@chakra-ui/react';
import { useSocket } from '../contexts/SocketProvider';

const DeleteTopicForm = (props) => {
    const socket = useSocket();

    const handleSubmit = async (e) => {
        try{
        e.preventDefault();
        socket.emit('delete_topic', {
            'topic_id': props.topicId
        });
        }
        catch (error){
            console.log(error);
        }
    }

    return (
        <Flex
            h={'auto'}
            align={'center'}
            justify={'center'}
            bg={'gray.50'}
        >
            <Box
                w='100%'
                rounded={'lg'}
                bg={'white'}
                boxShadow={'lg'}
                p={8}>
                <form onSubmit={handleSubmit}>
                <Stack spacing={4}>
                    <Text>Are you sure you want to delete 
                        <Text as="span" color="teal" fontWeight='700'> {props.title}</Text>? 
                        This can't be undone.
                    </Text>
                    <Button colorScheme='red' type='submit' variant='outline'>Delete</Button> 
                </Stack>
                </form>
            </Box>
      </Flex>
    )

};

export default DeleteTopicForm;