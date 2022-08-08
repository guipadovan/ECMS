import {Box, Button, Flex, HStack, useColorModeValue,} from '@chakra-ui/react';
import DefaultSidebar from './DefaultSidebar';
import React from 'react';
import {NavLink, useLocation} from 'react-router-dom';
import {FaEnvelope, FaHome, FaServer, FaShoppingCart, FaUsers} from 'react-icons/all';

const links = () => [
  {path: '/home', name: 'Home', icon: FaHome},
  {path: '/team', name: 'Team', icon: FaUsers},
  {path: '/store', name: 'Store', icon: FaShoppingCart},
  {path: '/status', name: 'Status', icon: FaServer},
  {path: '/contact', name: 'Contact', icon: FaEnvelope},
]
const Navbar = () => {

  let location = useLocation();

  const activeRoute = (routeName) => {
    return location.pathname === routeName;
  };

  const bgColor = useColorModeValue('rgba(255, 255, 255, 0.2)', 'rgba(26, 32, 44, 0.7)')

  const createLinks = (routes) => {
    return routes.map((route) => {
      if (route.children)
        return createLinks(route.children);

      const active = activeRoute(route.path);

      if (route.name !== 'Store')
        return (
          <NavLink to={route.path} key={route.name}>
            <Button fontSize='lg' me={{sm: '2px', md: '0px'}} color={active ? 'white' : 'gray.300'} variant='ghost'
                    _hover={{bg: 'transparent'}} _focus={{bg: 'transparent'}} _active={{bg: 'transparent'}}
                    _after={{
                      content: `''`, position: 'absolute', width: '0', height: '3px', bg: 'none',
                      top: '80%', borderRadius: '15px', transition: 'width 0.1s',
                    }}
                    sx={!active ? ({
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
              {route.name}
            </Button>
          </NavLink>
        );

      return (
        <NavLink to={route.path} key={route.name}>
          <Button fontSize='lg' me={{sm: '2px', md: '0px'}} color={'white'} variant='solid' boxShadow={'none'}
                  colorScheme={'blue'} bg={active ? 'blue.400' : 'blue.300'} _hover={{bg: 'blue.400'}}
                  _active={{bg: 'blue.400'}} _focus={{boxShadow: 'none'}} px={6} rounded={'md'}>
            {route.name}
          </Button>
        </NavLink>
      );
    });
  }

  return (
    <Flex position='absolute' background={bgColor} p={4} width='100%' alignItems='center'
          zIndex={'15'} top={'16px'} maxW={{base: '94%', xl: '1044px'}} w={'100%'} left={'50%'}
          transform='translate(-50%, 0px)'
          rounded={'xl'} boxShadow={'lg'}>
      <Flex w='100%' justifyContent={{base: 'space-between', md: 'center'}}>
        <Box ms={{base: 'auto', lg: '0px'}} display={{base: 'flex', md: 'none'}}>
          <DefaultSidebar routes={links()}/>
        </Box>

        <HStack display={{base: 'none', md: 'flex'}} spacing={2}>
          {createLinks(links())}
        </HStack>
      </Flex>
    </Flex>
  );
}

export default Navbar;