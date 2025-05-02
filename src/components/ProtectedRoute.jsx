import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return null; 
    }
    
    if (isAuthenticated) {
        return <Outlet />;
    }
    
    return <Navigate to="/login" />;
}

export default ProtectedRoute;