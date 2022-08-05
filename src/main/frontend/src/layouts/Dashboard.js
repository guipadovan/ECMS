import React from 'react';
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import {FaHome, FaUser} from 'react-icons/all';
import {ColorModeSwitcher} from '../components/ColorModeSwitcher';
import {Outlet, useLocation} from 'react-router';
import {ChevronRightIcon, HamburgerIcon} from '@chakra-ui/icons';
import routes from '../services/routes';
import {NavLink} from 'react-router-dom';
import {DashboardSidebar, MenuHeader} from '../features/dashboard';

export default function DashboardLayout() {
  const sidebar = useDisclosure();
  const location = useLocation();

  const createBreadcrumbs = (routes) => {
    return routes.map((route) => {
      if (route.children)
        return createBreadcrumbs(route.children);

      if (location.pathname.includes(route.path))
        return (
          <BreadcrumbItem>
            <NavLink to={route.path}>{route.name}</NavLink>
          </BreadcrumbItem>
        );

      if (route.path === location.pathname)
        return (
          <BreadcrumbItem>
            <NavLink to={route.path}>{route.name}</NavLink>
          </BreadcrumbItem>
        );

      return null;
    });
  };

  return (
    <Box minH={'97vh'} align={'center'} justify={'center'} w={'100%'}>
      <DashboardSidebar m={'4'} borderRadius={'lg'} px={'16px'} py={'8px'} display={{base: 'none', md: 'unset'}}
                        boxShadow={'1px 1px 8px rgba(0, 0, 0, 0.15)'} w='240px' h={'95%'} borderRightWidth={'0'}/>
      <Drawer isOpen={sidebar.isOpen} onClose={sidebar.onClose} placement='left'>
        <DrawerOverlay/>
        <DrawerContent maxW='250px' px='1rem'>
          <DashboardSidebar px={'16px'} py={'8px'} w='full' borderRight='none'/>
        </DrawerContent>
      </Drawer>
      <Box w='100%'>
        <Box ml={{base: 0, md: '256px'}} transition='.3s ease'>
          <Flex align='center' justify='space-between' w='96%' px='4' bg='white'
                boxShadow={'1px 1px 8px rgba(0, 0, 0, 0.15)'}
                _dark={{bg: 'gray.800'}} m={'16px'} borderRadius={'6px'} h='14'>

            <Breadcrumbs breadcrumbs={createBreadcrumbs(routes())}/>

            <Flex align='center'>
              <IconButton size='md' fontSize='lg' aria-label={`Menu`} variant='ghost'
                          display={{base: 'inline-flex', md: 'none'}}
                          color='current' onClick={sidebar.onOpen} icon={<HamburgerIcon/>}/>
              <ColorModeSwitcher></ColorModeSwitcher>
              <UserMenu/>
            </Flex>
          </Flex>

          <Box px='16px' mx='auto' mb={'16px'} width='1044px' maxW='100%' align={'start'}>
            <Outlet/>
            <Box mt={4} ml={8}>
              <Text>© ECMS. All rights reserved</Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

function UserMenu() {
  return <Menu autoSelect={false}>
    <MenuButton as={IconButton} size='md' fontSize='lg' color='current' marginLeft='0' variant={'ghost'}>
      <Icon as={FaUser}></Icon>
    </MenuButton>
    <MenuList bg={useColorModeValue('white', 'gray.800')} alignItems={'center'} fontSize={'sm'}
              fontWeight={'semibold'} border={0} pt={0}
              boxShadow={'1px 1px 10px 1px rgba(0, 0, 0, 0.25)'}>
      <MenuHeader/>
      <Box pt={'8px'}>
        <MenuGroup textAlign={'left'} mb={'0'} fontSize={'15px'}>
          <MenuItem as={NavLink} to='/home/' key='home' pl={'20px'} pt={'0.3rem'} pb={'0.3rem'}>
            <Icon as={FaHome} boxSize={'18px'} mr={'5px'} align={'center'}/>Home
          </MenuItem>
        </MenuGroup>
      </Box>
    </MenuList>
  </Menu>;
}

function Breadcrumbs(props: { breadcrumbs: any }) {
  return <Breadcrumb fontWeight='medium' fontSize='sm' separator={<ChevronRightIcon color='gray.500'/>}>
    {props.breadcrumbs}
  </Breadcrumb>;
}