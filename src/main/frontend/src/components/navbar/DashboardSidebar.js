import {
  Box,
  Divider,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { NavLink, useLocation } from 'react-router-dom';
import SideNavItem from './SideNavItem';
import routes from '../../routes';
import { FiSearch } from 'react-icons/all';
import useAuth from '../../hooks/useAuth';

export default function DashboardSidebar(props) {

  const location = useLocation();

  const activeRoute = (routeName) => {
    return location.pathname === routeName;
  };

  const activeBg = useColorModeValue('gray.100', 'blackAlpha.400');
  const activeColor = useColorModeValue('gray.700', 'white');
  const navbarBg = useColorModeValue('white', 'gray.800');

  const createLinks = (routes, nav) => {
    return routes.map((route) => {
      if (route.children)
        return createLinks(route.children, nav, route.loggedIn);

      if (route.nav && route.nav.nav === nav) {
        if (nav === 'user' && (route.name === 'Sign In' || route.name === 'Sign Up'))
          return null;

        return (
          <NavLink to={route.path} key={'side' + route.name}>
            <SideNavItem icon={route.nav.icon} active={activeRoute(route.path)} bg={activeBg} color={activeColor}
                         transform={'none'} p='8px' borderRadius='7px'>
              {route.name}
            </SideNavItem>
          </NavLink>
        );
      }

      return null;
    });
  };

  return (
    <Box as='nav' pos='fixed' top='0' left='0' zIndex='sticky' h='full' overflowX='hidden'
         overflowY='auto' bg={navbarBg} borderColor='blackAlpha.300' borderRightWidth='1px' w='250px'
         {...props}>
      <Stack direction='column' mb='40px'>
        <Box>
          <Flex py='2' justifyContent={'center'} display={'flex'} flexWrap={'wrap'}>
            <Text fontSize='2xl' color={activeColor} fontWeight='semibold' pb={'5px'}>
              ECMS
            </Text>
            <Divider />
          </Flex>
          <Flex direction='column' as='nav' fontSize='sm' color='gray.600' aria-label='Main Navigation'>
            <InputGroup display='flex' mb={'10px'}>
              <InputLeftElement color='gray.500' _dark={{ color: 'blue.500' }}>
                <FiSearch />
              </InputLeftElement>
              <Input placeholder='Search' fontWeight={'500'} color={useColorModeValue('black', 'gray.400')}
                     lineHeight={'40px'} />
            </InputGroup>
            {createLinks(routes(), 'user')}
            {createLinks(routes(), 'admin')}
          </Flex>
        </Box>
      </Stack>
    </Box>
  );
};