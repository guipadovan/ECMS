import routes from './routes';
import { useRoutes } from 'react-router-dom';
import { isAuthenticated } from './services/auth';

export default function App() {
  const routing = useRoutes(routes(isAuthenticated()));

  return (
    <>
      {routing}
    </>
  );
}