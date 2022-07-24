import useAuth from './useAuth';
import axios from '../api/axios';
import jwtDecode from 'jwt-decode';

const useRefreshToken = () => {
  const {setAuth} = useAuth();

  return async () => {
    const res = await axios.get('/auth/refresh', {
      withCredentials: true,
    });

    setAuth(() => {
      console.log(jwtDecode(res.data.token));
      return {user: jwtDecode(res.data.token), token: res.data.token};
    });

    return res.data.token;
  };
};

export default useRefreshToken;