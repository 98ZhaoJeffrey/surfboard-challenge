import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';

const PrivateRoute = ({children}) => {
    const { user } = useAuth();
    return user != null ? children : <Navigate to='/'/>    
};

export default PrivateRoute;