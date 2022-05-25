import {
    Box,
    Tabs, 
    TabList, 
    TabPanels, 
    Tab, 
    TabPanel 
} from '@chakra-ui/react';
import Join from '../components/Join';
import Create from '../components/Create';

const Home = () => {
    return(
        <Box w={{'base': '90%', 'sm': '70%', 'md': '45%' }}>
            <Tabs isFitted variant='enclosed'>
                <TabList>
                    <Tab>Join</Tab>
                    <Tab>Create</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <Join/>
                    </TabPanel>
                    <TabPanel>
                        <Create/>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    );
};

export default Home;