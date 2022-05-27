import {
    Box,
    Heading,
    Text,
    Flex,
    IconButton,
    Input 
} from '@chakra-ui/react';
import { MdEdit } from 'react-icons/md';
import Countdown from 'react-countdown';

const Completionist = () => <Text>The topic is finished</Text>

const Topic = (props) => {
    
    return (
        <Box w='100%' h='100%'>
            <Flex flexDirection='row' alignItems='center' my='4'>
                <Heading as='h2'>
                    {props.title}
                </Heading>
                <IconButton ml='4' colorScheme='purple' icon={<MdEdit/>}/>
            </Flex>
            <Flex flexDirection='row' alignItems='center' my='4'>
                <Text color='gray.500'>{props.description}</Text>
                <IconButton size='sm' ml='2' mt='2' colorScheme='teal' variant='ghost' icon={<MdEdit/>}/>
            </Flex>
            <Flex>
                <Text mr='2'>Time:</Text>
                { props.start > Date.now() ?
                    <Text >This topic hasn't started yet.
                    </Text> :
                    <Countdown date={props.start + props.duration * 1000}>
                        <Completionist/>
                    </Countdown>   
                }
            </Flex>
            <Text>Start Time: {new Date(props.start).toLocaleString()}</Text>
        </Box>
    );
};

export default Topic;