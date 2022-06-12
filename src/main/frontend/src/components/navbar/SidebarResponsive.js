import { HamburgerIcon } from '@chakra-ui/icons';
import {
  Box,
  Button, Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Icon,
  IconButton,
  Link,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import IconBox from '../icons/IconBox';
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../../services/auth';

function SidebarResponsive(props) {

  const { routes } = props;
  const location = useLocation();

  const mainPanel = React.useRef();
  const activeRoute = (routeName) => {
    return location.pathname === routeName;
  };

  const activeBg = useColorModeValue('gray.100', 'gray.800');
  const inactiveBg = useColorModeValue('white', 'gray.700');
  const activeColor = useColorModeValue('gray.700', 'white');
  const inactiveColor = 'gray.400';

  const createLinks = (routes, nav, loggedIn) => {
    return routes.map((route) => {
      if (route.children)
        return createLinks(route.children, nav, route.loggedIn);

      if (route.nav && route.nav.nav === nav) {
        if (nav === 'user' && ((loggedIn && !isAuthenticated()) || ((route.nav.name === 'Sign In' || route.nav.name === 'Sign Up') && isAuthenticated())))
          return null;

        return (
          <NavLink to={route.path} key={'side' + route.nav.name}>
            {activeRoute(route.path) ? (
              <Button boxSize='initial' justifyContent='flex-start' alignItems='center' bg={activeBg}
                      mb={{ xl: '12px' }} mx={{ xl: 'auto' }} ps={{ base: '10px', xl: '16px' }} py='12px'
                      borderRadius='15px' _hover={{ bg: { activeBg } }} w='100%'
                      _active={{ bg: 'inherit', transform: 'none', borderColor: 'transparent' }}
                      _focus={{ boxShadow: 'none' }} transform={'translate(5px)'}>
                <Flex>
                  <IconBox bg='blue.500' color='white' h='30px' w='30px' me='12px'><Icon
                    as={route.nav.icon}></Icon></IconBox>
                  <Text color={activeColor} my='auto' fontSize='sm'>{route.nav.name}</Text>
                </Flex>
              </Button>
            ) : (
              <Button boxSize='initial' justifyContent='flex-start' alignItems='center' bg='transparent'
                      mb={{ xl: '12px' }} mx={{ xl: 'auto' }} py='12px' ps={{ base: '10px', xl: '16px' }}
                      borderRadius='15px' _hover={{ bg: 'inherit' }} w='100%'
                      _active={{ bg: 'inherit', transform: 'none', borderColor: 'transparent' }}
                      _focus={{ boxShadow: 'none' }}>
                <Flex>
                  <IconBox bg={inactiveBg} color='blue.500' h='30px' w='30px' me='12px'><Icon
                    as={route.nav.icon}></Icon></IconBox>
                  <Text color={inactiveColor} my='auto' fontSize='sm'>{route.nav.name}</Text>
                </Flex>
              </Button>
            )}
          </NavLink>
        );
      }

      return null;
    });
  };

  const brand = (
    <Box pt={'35px'} mb='8px'>
      <Link href={`${process.env.PUBLIC_URL}/#/`} target='_blank' display='flex' lineHeight='100%'
            fontWeight='bold' justifyContent='center' alignItems='center' mb={'15px'}>
        <Text fontSize='md' mt='3px'>ECMS</Text>
      </Link>
      <Divider />
    </Box>
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  return (
    <Flex display={{ base: 'flex', md: 'none' }} ref={mainPanel} alignItems='center'>
      <IconButton size='md' fontSize='lg' aria-label={`Open sidebar menu`} ref={btnRef} variant='ghost'
                  color='current' onClick={onOpen} icon={<HamburgerIcon />} />
      <Drawer isOpen={isOpen} onClose={onClose} placement={'left'} finalFocusRef={btnRef}
              blockScrollOnMount={true}>
        <DrawerOverlay />
        <DrawerContent w='250px' maxW='250px' ms={{ sm: '16px' }} my={{ sm: '16px' }} borderRadius={{ sm: '16px' }}>
          <DrawerCloseButton _focus={{ boxShadow: 'none' }} _hover={{ boxShadow: 'none' }} />
          <DrawerBody maxW='250px' px='1rem'>
            <Box maxW='100%'>
              <Box>{brand}</Box>
              <Stack direction='column' mb='40px'>
                <Box>
                  {createLinks(routes, 'main')}
                  <Text color={activeColor} fontWeight='bold' mb={{ xl: '12px' }} mx='auto'
                        ps={{ base: '10px', xl: '16px' }} pe={{ base: '10px', xl: '16px' }} py='12px'>ACCOUNT</Text>
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