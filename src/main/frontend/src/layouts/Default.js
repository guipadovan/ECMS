import React from 'react';
import {Box, Heading, useColorModeValue} from '@chakra-ui/react';
import Footer from '../components/Footer';
import Navbar from '../components/navigation/Navbar';
import {Outlet} from 'react-router';
import UserBar from '../components/navigation/UserBar';

export default function DefaultLayout({disableHeader}) {

  const gradientBg = useColorModeValue(
    'linear-gradient(rgba(0, 0, 0, 0.2) 78%, #EDF2F7)',
    'linear-gradient(rgba(0, 0, 0, 0.7) 50%, rgb(34, 42, 55))'
  );
  const coverGradient = useColorModeValue(
    'linear-gradient(var(--chakra-colors-blue-500) 80%, var(--chakra-colors-gray-100))',
    'linear-gradient(var(--chakra-colors-blue-500), rgb(34, 42, 55))'
  );

  return (
    <Box minH={'100vh'} align={'center'} justify={'center'} w={'100%'}>
      <Navbar/>
      <Box h={{base: '400px', md: '475px'}} w={'100%'} zIndex={'3'} bg={coverGradient}>
        <Box h={'100%'} w={'100%'}
             bg={'url(https://asset.vg247.com/minecraft_the_wild_update_02.jpg/BROK/resize/1920x1920%3E/format/jpg/quality/80/minecraft_the_wild_update_02.jpg) no-repeat'}
             bgPos={'center center'} bgSize={'cover'} opacity={'0.9'} position={'relative'} display={'block'}
             zIndex={'1'}
             _before={{
               bg: gradientBg,
               height: '100%',
               content: '""',
               top: '0',
               left: '0',
               zIndex: '3',
               display: 'block',
               bottom: '-5px',
               position: 'absolute',
               width: '100%',
             }}
             _after={{
               bg: 'linear-gradient(rgba(0, 0, 0, 0.7), transparent)',
               height: '227px',
               content: '""',
               top: '0',
               left: '0',
               zIndex: '3',
               display: 'block',
               bottom: 'auto',
               position: 'absolute',
               width: '100%',
             }}></Box>
      </Box>
      {disableHeader ? null : (
        <Box h={'250px'} w={'230px'} mt={{base: '-325px', md: '-400px'}} zIndex={'5'} position={'relative'}
             justifyContent={'center'}>
          <Heading size={'2xl'} p={'95px 0 80px 0'} color={'white'}>ecms</Heading>
        </Box>
      )}
      <Box w='100%' position={'relative'} zIndex={'10'} mt={disableHeader ? '100px' : '-45px'}>
        {disableHeader ? null : <UserBar/>}
        <Outlet/>
      </Box>
      <Box px='24px' mx='auto' width='1044px' maxW='100%'>
        <Footer></Footer>
      </Box>
    </Box>
  );
}
