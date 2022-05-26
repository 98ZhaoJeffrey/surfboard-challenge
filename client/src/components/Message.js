import {
    Flex,
    Box,
    Text,
    Avatar
} from '@chakra-ui/react';

const Message = (props) => {
    return (
        <Flex                 
            alignSelf={props.sender ? 'flex-end': 'flex-start'}
            alignItems='center'
            flexDirection={props.sender ? 'row': 'row-reverse'}
            w="auto"
            gap='4'
            py='2'
            px='4'
            maxWidth={{'base': '70vw', 'md':'40vw'}}
        >
            
            <Box
                minh="10%"
                py="4" 
                px="2" 
                rounded='md' 
                bg={props.sender ? 'purple.200' : 'teal.200'}
            >
                <Text overflowWrap="break-word">{props.message}</Text>
            </Box>
            <Avatar size='sm' name={props.name} description={`${props.name} profile picture`}/>
        </Flex>
    )
}

export default Message;