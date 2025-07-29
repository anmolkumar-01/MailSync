import { Outlet, Navigate } from 'react-router';

const ProtectedRoute = ({ isAllowed, fallback = '/' }) => {

    if (!isAllowed) {
        return <Navigate to={fallback} replace />;
    }

    return <Outlet/>;
};

export default ProtectedRoute;