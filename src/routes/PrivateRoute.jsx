import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // 1. Wait for the AuthContext to finish checking local storage
    if (loading) {
        return (
            <div className="min-h-[70vh] flex justify-center items-center">
                <div className="flex flex-col items-center gap-4">
                    <span className="w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></span>
                    <p className="text-slate-400 font-medium tracking-widest animate-pulse">VERIFYING...</p>
                </div>
            </div>
        );
    }

    // 2. If a user exists, render the requested page
    if (user) {
        return children;
    }

    // 3. If no user, redirect to login AND save the URL they tried to access
    return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;