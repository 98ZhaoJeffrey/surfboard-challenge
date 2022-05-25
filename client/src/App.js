import {
  Center
} from '@chakra-ui/react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import Home from './pages/Home';

function App() {
  return (
    <Center w='100vw' height='100vh'>
      <Router>
          <Routes>
            <Route path="/" element={<Home/>} />
          </Routes>
      </Router>
    </Center>
  );
}

export default App;
