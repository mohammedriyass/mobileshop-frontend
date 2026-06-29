import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();


    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
}

export default ProtectedRoute;