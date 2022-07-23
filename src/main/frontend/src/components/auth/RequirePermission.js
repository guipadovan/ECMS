import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const RequirePermission = ({ permission, children }) => {
  const { auth } = useAuth();
  const location = useLocation();

  return (
    auth?.user?.permissions?.find(role => permission?.includes(role))
      ? { children }
      : auth?.user
        ? null
        : <Navigate to='/signin' state={{ from: location }} replace />
  );
};

export default RequirePermission;