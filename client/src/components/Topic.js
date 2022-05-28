import { useDisclosure } from '@chakra-ui/react';
import {
    Box,
    Heading,
    Text,
    Flex,
    IconButton,
} from '@chakra-ui/react';
import { MdEdit, MdDeleteForever } from 'react-icons/md';
import Countdown from 'react-countdown';
import EditTopicForm from './EditTopicForm';
import TopicsModal from './TopicsModal';
import DeleteTopicForm from './DeleteTopicForm';
import { useAuth } from '../contexts/AuthProvider';

const Completionist = () => <Text>The topic is finished</Text>

const Topic = (props) => {

    const editModal = useDisclosure();
    const deleteModal = useDisclosure();
    const { user } = useAuth()
    
    return (
        <Box w='100%' h='100%'>
            <Flex flexDirection='row' alignItems='center' my='4'>
                <Heading as='h2'>
                    {props.title}
                </Heading>
                { user.id === user.hostId &&
                <IconButton 
                    ml='4' 
                    colorScheme='purple' 
                    icon={<MdEdit/>}
                    onClick={editModal.onOpen}
                />}
            </Flex>
            <Text color='gray.500' my='4'>{props.description}</Text>
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
            <Text>
                Start Time: 
                {new Date(props.start).toLocaleString({ timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone})}
            </Text>
            <TopicsModal
                disclosure={editModal} 
                title={`Editting ${props.title}`} 
                id="edit" 
                children={<EditTopicForm
                    topicId={props.topicId} 
                    title={props.title}
                    date={props.start}
                    description={props.description}
                    hours={~~(props.duration / 3600)}
                    minutes={(props.duration % 3600) / 60 }
                />}
            />
            { user.id === user.hostId &&
            <IconButton mt='4'
                icon={<MdDeleteForever/>}
                aria-label='Delete topic'
                colorScheme='red'
                variant='outline'
                onClick={deleteModal.onOpen}
            /> }
            <TopicsModal
                disclosure={deleteModal} 
                title={`Delete ${props.title}?`} 
                id="delete" 
                children={<DeleteTopicForm
                    topicId={props.topicId} 
                    title={props.title}
                />}
            />
        </Box>
    );
};

export default Topic;