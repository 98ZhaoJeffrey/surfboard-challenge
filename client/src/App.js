import {
  Center
} from '@chakra-ui/react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import Meeting from './pages/Meeting';
import Home from './pages/Home';
import { SocketProvider } from './contexts/SocketProvider';
import { AuthProvider } from './contexts/AuthProvider';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Center w='100vw' height='100vh'>
      <AuthProvider>
      <SocketProvider>
        <Router>
            <Routes>
              <Route path="/" element={<Home/>} />
              <Route path="/meeting" element={
                <PrivateRoute>
                  <Meeting/>
                </PrivateRoute>
              } />
            </Routes>
        </Router>
      </SocketProvider>
      </AuthProvider>
    </Center>
  );
}

export default App;
