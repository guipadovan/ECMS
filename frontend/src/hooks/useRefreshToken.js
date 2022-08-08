import jwtDecode from 'jwt-decode';
import {useAuth} from '../features/auth';
import apiPrivate from '../services/axios';

const useRefreshToken = () => {
  const {setAuth} = useAuth();

  return async () => {
    const res = await apiPrivate.get('/auth/refresh', {
      withCredentials: true,
    });

    setAuth(() => {
      return {user: jwtDecode(res.data.token), token: res.data.token};
    });

    return res.data.token;
  };
};

export default useRefreshToken;