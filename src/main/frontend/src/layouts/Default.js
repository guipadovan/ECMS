import React from 'react';
import {Box, Portal} from '@chakra-ui/react';
import Footer from '../components/Footer';
import Navbar from '../components/navbar/Navbar';
import {Outlet} from 'react-router';

export default function DefaultLayout() {

  const navRef = React.useRef();
  return (
    <Box minH={'100vh'} align={'center'} justify={'center'} w={'100%'} ref={navRef}>
      <Portal containerRef={navRef}>
        <Navbar/>
      </Portal>
      <Box w='100%' pt={'125px'}>
        <Outlet/>
      </Box>
      <Box px='24px' mx='auto' width='1044px' maxW='100%'>
        <Footer></Footer>
      </Box>
    </Box>
  );
}
