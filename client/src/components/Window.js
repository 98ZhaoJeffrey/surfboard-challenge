import {
    Box,
    Tabs, 
    TabList, 
    TabPanels, 
    Tab, 
    TabPanel 
  } from '@chakra-ui/react';
import Topic from './Topic';
import Chat from './Chat';

const Window = (props) => {
    return (
        <Box>
            <Tabs isFitted variant='enclosed'>
                <TabList>
                    <Tab>Topic</Tab>
                    <Tab>Chat</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel >
                        {props.topic && <Topic
                            title={props.topic.title} 
                            description={props.topic.description}
                            start={new Date(props.topic.time_started).getTime()}
                            duration={props.topic.time_estimate}
                        />}
                    </TabPanel>
                    <TabPanel h='80vh'>
                        <Chat/>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    );
};

export default Window;