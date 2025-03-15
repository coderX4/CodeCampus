import { useAuth } from './AuthContext';
import {Navigate} from "react-router-dom";
const ProtectedRoute = ({children}) =>  {
    const {isAuthenticated} = useAuth();
    if(!isAuthenticated){
        return <Navigate to="/home"></Navigate>
    }else {
        return children;
    }
}
export default ProtectedRoute