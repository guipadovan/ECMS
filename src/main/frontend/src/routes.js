import { Navigate, Outlet } from 'react-router-dom';
import DefaultLayout from './layouts/Default';
import Dashboard from './views/dashboard/Dashboard';
import Profile from './views/dashboard/user/Profile';
import SignIn from './views/auth/SignIn';
import SignUp from './views/auth/SignUp';
import AddPost from './views/dashboard/admin/AddPost';
import Posts from './views/dashboard/admin/Posts';
import Home from './views/Home';
import { BsBoxArrowInRight, FaCog, FaHome, FaNewspaper, FaShoppingCart, FaUserAlt, FaUserPlus } from 'react-icons/all';
import DashboardLayout from './layouts/Dashboard';

const routes = (isLoggedIn) => [
  {
    path: '/app',
    //element: isLoggedIn ? <DashboardLayout /> : <Navigate to='/signin' />,
    element: <DashboardLayout />,
    loggedIn: true,
    children: [
      { path: '/app/', element: <Navigate to='/app/dashboard' />, name: 'Home' },
      { path: '/app/dashboard', element: <Dashboard />, name: 'Dashboard', nav: { nav: 'user', icon: FaCog } },
      { path: '/app/profile', element: <Profile />, name: 'Profile', nav: { nav: 'user', icon: FaUserAlt } },
      {
        path: '/app/posts',
        element: <Outlet />,
        loggedIn: true,
        children: [
          { path: '/app/posts/', element: <Posts />, name: 'Posts', nav: { nav: 'admin', icon: FaNewspaper } },
          { path: '/app/posts/new', element: <AddPost />, name: 'New Post', nav: { nav: 'admin', icon: FaNewspaper } },
        ],
      },
    ],
  },
  {
    path: '/',
    element: <DefaultLayout />,
    loggedIn: false,
    children: [
      { path: '/home', element: <Home />, name: 'Home', nav: { nav: 'main', icon: FaHome } },
      { path: '/store', element: <Home />, name: 'Store', nav: { nav: 'main', icon: FaShoppingCart } },
      {
        path: '/signin',
        element: !isLoggedIn ? <SignIn /> : <Navigate to='/home' />, name: 'Sign In',
        nav: { nav: 'user', icon: BsBoxArrowInRight },
      },
      {
        path: '/signup',
        element: !isLoggedIn ? <SignUp /> : <Navigate to='/home' />, name: 'Sign Up',
        nav: { nav: 'user', icon: FaUserPlus },
      },
      { path: '/*', element: <Navigate to='/home' /> },
    ],
  },
];

export default routes;