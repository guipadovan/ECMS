import {HamburgerIcon} from '@chakra-ui/icons';
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  IconButton,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import React, {useRef} from 'react';
import {useLocation} from 'react-router-dom';
import createSidebarItems from '../../services/createSidebarItems';

const DefaultSidebar = ({routes}) => {

  const location = useLocation();

  const activeRoute = (routeName) => {
    return location.pathname === routeName;
  };

  const mainPanel = useRef();
  const activeBg = useColorModeValue('gray.100', 'gray.900');
  const activeColor = useColorModeValue('gray.700', 'white');

  const {isOpen, onOpen, onClose} = useDisclosure();
  const btnRef = useRef();

  return (
    <Flex display={{base: 'flex', md: 'none'}} ref={mainPanel} alignItems='center'>
      <IconButton size='md' fontSize='lg' aria-label={`Open sidebar menu`} ref={btnRef} variant='ghost'
                  color='current' onClick={onOpen} icon={<HamburgerIcon/>}/>
      <Drawer isOpen={isOpen} onClose={onClose} placement={'left'} finalFocusRef={btnRef}
              blockScrollOnMount={true}>
        <DrawerOverlay/>
        <DrawerContent w='250px' maxW='250px'
                       bg={useColorModeValue('white', 'gray.800')}>
          <Flex py='2' justifyContent={'center'} display={'flex'} flexWrap={'wrap'}>
            <Text fontSize='2xl' color={activeColor} fontWeight='semibold' pb={'5px'}>
              ECMS
            </Text>
          </Flex>
          <DrawerCloseButton _focus={{boxShadow: 'none'}} _hover={{boxShadow: 'none'}}/>
          <DrawerBody maxW='250px' px='1rem'>
            <Box maxW='100%'>
              <VStack spacing={'8px'}>
                {createSidebarItems(routes, false, activeBg, activeColor, activeRoute, location)}
              </VStack>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}

export default DefaultSidebar;