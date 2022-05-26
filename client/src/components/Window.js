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


const Window = () => {

    return (
        <Box>
            <Tabs isFitted variant='enclosed'>
                <TabList>
                    <Tab>Topic</Tab>
                    <Tab>Chat</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel >
                        <Topic 
                            title='My Title' 
                            description='My cool descripition'
                            start={new Date('2022-05-27 03:42:24')}
                            duration={5000}
                        />
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