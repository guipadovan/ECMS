import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import {NavLink, useLocation} from 'react-router-dom';
import SideNavItem from './SideNavItem';
import {
  FaBriefcase,
  FaCartPlus,
  FaCog,
  FaHome,
  FaList,
  FaPaperclip,
  FaPercentage,
  FaPlus,
  FaServicestack,
  FaShoppingCart,
  FaUsers,
  FiSearch
} from 'react-icons/all';
import SideNavDropdown from "./SideNavDropdown";

const links = () => [
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
      {path: '/app/store/gateways', name: 'Gateways', icon: FaServicestack}
    ]
  }
]

export default function DashboardSidebar(props) {

  const location = useLocation();

  const activeRoute = (routeName) => {
    return location.pathname === routeName;
  };

  const activeBg = useColorModeValue('gray.100', 'blackAlpha.400');
  const activeColor = useColorModeValue('gray.700', 'white');
  const navbarBg = useColorModeValue('white', 'gray.800');

  const createLinks = (links, dropdown) => {
    return links.map((route) => {
      if (route.children) {
        return (
          <SideNavDropdown key={'side' + route.name} bg={activeBg} color={activeColor}
                           active={location.pathname.substring(4).includes(route.path.substring(4))} icon={route.icon}
                           label={route.name}>
            {createLinks(route.children, true)}
          </SideNavDropdown>
        )
      }

      return (
        <Box width={'100%'} key={'side' + route.name}>
          <NavLink to={route.path}>
            <SideNavItem icon={route.icon} active={activeRoute(route.path)} bg={activeBg} color={activeColor}
                         transform={'none'} p='6px' borderRadius={dropdown ? '0' : '7px'}>
              {route.name}
            </SideNavItem>
          </NavLink>
        </Box>
      );
    });
  };

  return (
    <Box as='nav' pos='fixed' top='0' left='0' zIndex='sticky' h='full' overflowX='hidden'
         overflowY='overlay' bg={navbarBg} borderColor='blackAlpha.300' borderRightWidth='1px' w='250px'
         sx={
           {
             '::-webkit-scrollbar': {
               width: '10px',
             },
             '::-webkit-scrollbar-track': {
               my: '1px',
             },
             '::-webkit-scrollbar-thumb': {
               bg: activeBg,
               borderRadius: '5vw',
               border: '0.3vw solid',
               borderColor: navbarBg
             }
           }
         }
         {...props}>
      <Stack direction='column' mb='8px'>
        <Box>
          <Flex py='2' justifyContent={'center'} display={'flex'} flexWrap={'wrap'}>
            <Text fontSize='2xl' color={activeColor} fontWeight='semibold' pb={'5px'}>
              ECMS
            </Text>
          </Flex>
          <Flex direction='column' as='nav' fontSize='sm' color='gray.600' aria-label='Main Navigation'>
            <InputGroup display='flex' mb={'10px'}>
              <InputLeftElement color='gray.500' _dark={{color: 'blue.500'}}>
                <FiSearch/>
              </InputLeftElement>
              <Input placeholder='Search' fontWeight={'500'} color={useColorModeValue('black', 'gray.400')}
                     lineHeight={'40px'}/>
            </InputGroup>
            <VStack spacing={'8px'}>
              {createLinks(links(), false)}
            </VStack>
          </Flex>
        </Box>
      </Stack>
    </Box>
  );
};