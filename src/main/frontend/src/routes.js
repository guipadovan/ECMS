import { Navigate, Outlet } from 'react-router-dom';
import DefaultLayout from './layouts/Default';
import Dashboard from './views/dashboard/Dashboard';
import Profile from './views/dashboard/user/Profile';
import SignIn from './views/auth/SignIn';
import SignUp from './views/auth/SignUp';
import AddNews from './views/dashboard/admin/AddNews';
import News from './views/dashboard/admin/News';
import Home from './views/Home';
import { BsBoxArrowInRight, FaCog, FaHome, FaNewspaper, FaShoppingCart, FaUserAlt, FaUserPlus } from 'react-icons/all';

const routes = (isLoggedIn) => [
  {
    path: '/app',
    element: isLoggedIn ? <DefaultLayout /> : <Navigate to='/signin' />,
    loggedIn: true,
    children: [
      { path: '/app/profile', element: <Profile />, nav: { nav: 'user', name: 'Profile', icon: FaUserAlt } },
      { path: '/app/dashboard', element: <Dashboard />, nav: { nav: 'user', name: 'Dashboard', icon: FaCog } },
      { path: '/app/', element: <Navigate to='/app/dashboard' /> },
      {
        path: 'news',
        element: <Outlet />,
        loggedIn: true,
        children: [
          { path: '/app/news/', element: <News />, nav: { nav: 'admin', name: 'News', icon: FaNewspaper } },
          { path: '/app/news/add', element: <AddNews /> },
        ],
      },
    ],
  },
  {
    path: '/',
    element: <DefaultLayout />,
    loggedIn: false,
    children: [
      { path: '/home', element: <Home />, nav: { nav: 'main', name: 'Home', icon: FaHome } },
      { path: '/store', element: <Home />, nav: { nav: 'main', name: 'Store', icon: FaShoppingCart } },
      {
        path: '/signin',
        element: !isLoggedIn ? <SignIn /> : <Navigate to='/home' />,
        nav: { nav: 'user', name: 'Sign In', icon: BsBoxArrowInRight },
      },
      {
        path: '/signup',
        element: !isLoggedIn ? <SignUp /> : <Navigate to='/home' />,
        nav: { nav: 'user', name: 'Sign Up', icon: FaUserPlus },
      },
      { path: '/*', element: <Navigate to='/home' /> },
    ],
  },
];

export default routes;