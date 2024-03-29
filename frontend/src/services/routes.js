import {Navigate, Outlet} from 'react-router-dom';
import DefaultLayout from '../layouts/Default';
import Dashboard from '../views/dashboard/Dashboard';
import Profile from '../views/Profile';
import SignIn from '../views/SignIn';
import SignUp from '../views/SignUp';
import AddPost from '../views/dashboard/AddPost';
import Posts from '../views/dashboard/Posts';
import Home from '../views/Home';
import {BsBoxArrowInRight, FaCog, FaHome, FaNewspaper, FaShoppingCart, FaUserAlt, FaUserPlus} from 'react-icons/all';
import DashboardLayout from '../layouts/Dashboard';
import Post from '../views/Post';
import UpdatePost from '../views/dashboard/UpdatePost';
import Users from "../views/dashboard/Users";

const routes = (isLoggedIn) => [
  {
    path: '/app',
    //element: isLoggedIn ? <DashboardLayout /> : <Navigate to='/signin' />,
    element: <DashboardLayout/>,
    loggedIn: true,
    children: [
      {path: '/app/', element: <Navigate to='/app/dashboard'/>, name: 'Home'},
      {path: '/app/dashboard', element: <Dashboard/>, name: 'Dashboard', nav: {nav: 'user', icon: FaCog}},
      {path: '/app/users', element: <Users/>},
      {path: '/app/profile', element: <Profile/>, name: 'Profile', nav: {nav: 'user', icon: FaUserAlt}},
      {
        path: '/app/posts',
        element: <Outlet/>,
        loggedIn: true,
        children: [
          {path: '/app/posts', element: <Posts/>, name: 'Posts', nav: {nav: 'admin', icon: FaNewspaper}},
          {path: '/app/posts/new', element: <AddPost/>, name: 'New Post', nav: {nav: 'admin', icon: FaNewspaper}},
          {path: '/app/posts/update/:id', element: <UpdatePost/>}
        ],
      },
    ],
  },
  {
    path: '/',
    element: <DefaultLayout/>,
    loggedIn: false,
    children: [
      {path: '/home', element: <Home/>, name: 'Home', nav: {nav: 'main', icon: FaHome}},
      {path: '/store', element: <Home/>, name: 'Store', nav: {nav: 'main', icon: FaShoppingCart}},
      {path: '/post/:id', element: <Post/>,},
      {path: '/*', element: <Navigate to='/home'/>},
    ],
  },
  {
    path: '/auth',
    element: <DefaultLayout disableHeader={true}/>,
    loggedIn: false,
    children: [
      {
        path: '/auth/signin',
        element: !isLoggedIn ? <SignIn/> : <Navigate to='/home'/>, name: 'Sign In',
        nav: {nav: 'user', icon: BsBoxArrowInRight},
      },
      {
        path: '/auth/signup',
        element: !isLoggedIn ? <SignUp/> : <Navigate to='/home'/>, name: 'Sign Up',
        nav: {nav: 'user', icon: FaUserPlus},
      },
      {path: '/auth/', element: <Navigate to='/home'/>},
    ],
  },
];

export default routes;