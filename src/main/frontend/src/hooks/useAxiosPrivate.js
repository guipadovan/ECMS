import useRefreshToken from './useRefreshToken';
import apiPrivate from '../services/axios';
import {useEffect} from 'react';
import {useAuth} from '../features/auth';

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const {auth} = useAuth();

  useEffect(() => {

    const reqInterceptor = apiPrivate.interceptors.request.use(
      async config => {
        if (!config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${auth?.token}`;
        }
        return config;
      }, error => Promise.reject(error));

    const resInterceptor = apiPrivate.interceptors.response.use(
      res => res,
      async error => {
        const prevRequest = error?.config;
        if ((error?.response?.status !== 401 || error?.response?.status !== 403 || error?.response?.status !== 400)
          && prevRequest?.sent) {
          prevRequest.sent = true;
          const token = await refresh();
          prevRequest.headers.Authorization = `Bearer ${token}`;
          return apiPrivate(prevRequest);
        }
        return Promise.reject(error);
      });

    return () => {
      apiPrivate.interceptors.request.eject(reqInterceptor);
      apiPrivate.interceptors.response.eject(resInterceptor);
    };
  }, [auth, refresh]);

  return apiPrivate;
};

export default useAxiosPrivate;