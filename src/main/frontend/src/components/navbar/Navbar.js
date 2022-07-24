import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import SidebarResponsive from './SidebarResponsive';
import React from 'react';
import {NavLink, useLocation} from 'react-router-dom';
import {ColorModeSwitcher} from '../ColorModeSwitcher';
import {FaUser} from 'react-icons/all';
import routes from '../../routes';
import MenuHeader from './MenuHeader';
import useAuth from '../../hooks/useAuth';

export default function Navbar(props) {

  const {...rest} = props;

  const {auth} = useAuth();

  let location = useLocation();
  const activeRoute = (routeName) => {
    return location.pathname === routeName;
  };

  let textColor = useColorModeValue('gray.700', 'gray.200');
  let navbarBg = useColorModeValue('linear-gradient(to left, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 110.84%)', 'gray.800');
  let navbarShadow = useColorModeValue('0px 7px 23px rgba(0, 0, 0, 0.15)', '1px 1px 8px  rgba(0, 0, 0, 0.15)');

  const brand = (
    <Link href={`${process.env.PUBLIC_URL}/#/`} target='_blank' display='flex' lineHeight='100%'
          fontWeight='bold' justifyContent='center' alignItems='center' color={textColor}>
      <Text fontSize='lg' ml={'10px'}>ECMS</Text>
    </Link>
  );

  const createLinks = (routes, nav, loggedIn) => {
    return routes.map((route) => {
      if (route.children)
        return createLinks(route.children, nav, route.loggedIn);

      if (route.nav) {
        if (route.nav.nav === 'main' && nav === 'main')
          return (
            <NavLink to={route.path} key={route.name}>
              <Button fontSize='md' ms='0px' px='0px' me={{sm: '2px', md: '0px'}} color={textColor}
                      variant='transparent-with-icon' leftIcon={<Icon as={route.nav.icon} color={'inherit'}/>}
                      iconSpacing={'3px'}
                      _after={{
                        content: `""`, position: 'absolute', width: '0', height: '3px', bg: 'none',
                        top: '80%', borderRadius: '15px', transition: 'width 0.1s',
                      }}
                      sx={!activeRoute(route.path) ? ({
                        '&:hover::after': {
                          width: '20px',
                          bg: 'blue.500',
                        },
                      }) : ({
                        '&:after': {
                          width: '30px',
                          bg: 'blue.500',
                        },
                      })}>
                <Text>{route.name}</Text>
              </Button>
            </NavLink>
          );
        else if (route.nav.nav === 'user' && nav === 'user' && ((loggedIn && auth.user) || (!loggedIn && !auth.user)))
          return (
            <MenuItem as={NavLink} to={route.path} key={route.name} pl={'20px'} pt={'0.3rem'} pb={'0.3rem'}>
              <Icon as={route.nav.icon} boxSize={'18px'} mr={'5px'} align={'center'}/>{route.name}
            </MenuItem>
          );
      }

      return null;
    });
  };

  return (
    <Flex position='fixed' top='16px' left='50%' transform='translate(-50%, 0px)' background={navbarBg}
          boxShadow={navbarShadow} borderRadius='15px' px='16px' py='22px' mx='auto' width='1044px'
          maxW='90%' alignItems='center'>
      <Flex w='100%' justifyContent={{sm: 'start', lg: 'space-between'}}>
        {brand}
        <Box ms={{base: 'auto', lg: '0px'}} display={{base: 'flex', lg: 'none'}}>
          <SidebarResponsive routes={routes()} {...rest} />
        </Box>

        <HStack display={{base: 'none', md: 'flex'}} spacing={'5'}>
          {createLinks(routes(), 'main')}
        </HStack>

        <Box>
          <ColorModeSwitcher></ColorModeSwitcher>
          <Menu autoSelect={false}>
            <MenuButton as={IconButton} size='md' fontSize='lg' color='current' marginLeft='0' variant={'ghost'}>
              <Icon as={FaUser}></Icon>
            </MenuButton>
            <MenuList bg={useColorModeValue('white', 'gray.800')} alignItems={'center'} fontSize={'sm'}
                      fontWeight={'semibold'} border={0} pt={0}
                      boxShadow={'1px 1px 10px 1px rgba(0, 0, 0, 0.25)'}>
              <MenuHeader/>
              <MenuGroup title={'Account'} textAlign={'left'} mb={'0'} fontSize={'15px'}>
                {createLinks(routes(), 'user')}
              </MenuGroup>
            </MenuList>
          </Menu>
        </Box>
      </Flex>
    </Flex>
  );
}