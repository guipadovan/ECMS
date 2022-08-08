import routes from './services/routes';
import {useRoutes} from 'react-router-dom';
import useRefreshToken from './hooks/useRefreshToken';
import {useEffect} from 'react';
import {useAuth} from './features/auth';

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