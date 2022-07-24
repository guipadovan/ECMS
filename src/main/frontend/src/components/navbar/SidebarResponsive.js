import {HamburgerIcon} from '@chakra-ui/icons';
import {
  Box,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  IconButton,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import {NavLink, useLocation} from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import SideNavItem from './SideNavItem';

function SidebarResponsive(props) {

  const {routes} = props;
  const location = useLocation();

  const {auth} = useAuth();

  const mainPanel = React.useRef();
  const activeRoute = (routeName) => {
    return location.pathname === routeName;
  };

  const activeBg = useColorModeValue('gray.100', 'gray.900');
  const activeColor = useColorModeValue('gray.700', 'white');

  const createLinks = (routes, nav, loggedIn) => {
    return routes.map((route) => {
      if (route.children)
        return createLinks(route.children, nav, route.loggedIn);

      if (route.nav && route.nav.nav === nav) {
        if (nav === 'user' && ((loggedIn && !auth.user) || ((route.name === 'Sign In' || route.name === 'Sign Up') && auth.user)))
          return null;

        return (
          <NavLink to={route.path} key={'side' + route.name}>
            <SideNavItem icon={route.nav.icon} active={activeRoute(route.path)} bg={activeBg} color={activeColor}>
              {route.name}
            </SideNavItem>
          </NavLink>
        );
      }

      return null;
    });
  };

  const brand = (
    <Box pt={'35px'} mb='8px'>
      <Text fontSize='2xl' ml='2' fontWeight='bold'>
        ECMS
      </Text>
      <Divider/>
    </Box>
  );

  const {isOpen, onOpen, onClose} = useDisclosure();
  const btnRef = React.useRef();
  return (
    <Flex display={{base: 'flex', md: 'none'}} ref={mainPanel} alignItems='center'>
      <IconButton size='md' fontSize='lg' aria-label={`Open sidebar menu`} ref={btnRef} variant='ghost'
                  color='current' onClick={onOpen} icon={<HamburgerIcon/>}/>
      <Drawer isOpen={isOpen} onClose={onClose} placement={'left'} finalFocusRef={btnRef}
              blockScrollOnMount={true}>
        <DrawerOverlay/>
        <DrawerContent w='250px' maxW='250px'
                       bg={useColorModeValue('white', 'gray.800')}>
          <DrawerCloseButton _focus={{boxShadow: 'none'}} _hover={{boxShadow: 'none'}}/>
          <DrawerBody maxW='250px' px='1rem'>
            <Box maxW='100%'>
              <Box>{brand}</Box>
              <Stack direction='column' mb='40px'>
                <Box>
                  {createLinks(routes, 'main')}
                  <Text color={activeColor} fontWeight='bold' mb={{xl: '12px'}} mx='auto'
                        ps={{base: '10px', xl: '16px'}} pe={{base: '10px', xl: '16px'}} py='12px'>ACCOUNT</Text>
                  {createLinks(routes, 'user')}
                </Box>
              </Stack>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}

export default SidebarResponsive;