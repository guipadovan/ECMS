import routes from './routes';
import {useRoutes} from 'react-router-dom';
import useAuth from './hooks/useAuth';
import useRefreshToken from './hooks/useRefreshToken';
import {useEffect} from 'react';

export default function App() {
  const {auth} = useAuth();
  const refresh = useRefreshToken();

  useEffect(() => {
    refresh().catch(() => {

    });
  }, []);

  const routing = useRoutes(routes(auth?.user));

  return (
    <>
      {routing}
    </>
  );
}