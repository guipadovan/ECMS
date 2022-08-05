import {
  FaBriefcase,
  FaCartPlus,
  FaCashRegister,
  FaCog,
  FaHome,
  FaList,
  FaPaperclip,
  FaPercentage,
  FaPlus,
  FaServicestack,
  FaShoppingCart,
  FaUsers
} from 'react-icons/all';

export const links = () => [
  {path: '/app/dashboard', name: 'Dashboard', icon: FaHome},
  {path: '/app/config', name: 'Config', icon: FaCog},
  {
    path: '/app/users', name: 'Users', icon: FaUsers, children: [
      {path: '/app/users', name: 'List', icon: FaList},
      {path: '/app/roles', name: 'Roles', icon: FaBriefcase},
      {path: '/app/roles/new', name: 'New Role', icon: FaPlus}
    ]
  },
  {
    path: '/app/posts', name: 'Posts', icon: FaPaperclip, children: [
      {path: '/app/posts', name: 'List', icon: FaList},
      {path: '/app/posts/new', name: 'New Post', icon: FaPlus}
    ]
  },
  {
    path: '/app/store', name: 'Store', icon: FaShoppingCart, children: [
      {path: '/app/store/purchases', name: 'Purchases', icon: FaCartPlus},
      {path: '/app/store/products', name: 'Products', icon: FaList},
      {path: '/app/store/coupons', name: 'Coupons', icon: FaPercentage},
      {path: '/app/store/servers', name: 'Servers', icon: FaServicestack},
      {path: '/app/store/gateways', name: 'Gateways', icon: FaCashRegister}
    ]
  }
]