import {useNavigate} from 'react-router';
import {
  Badge,
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  SlideFade,
  Stack,
  useColorModeValue,
  VStack
} from '@chakra-ui/react';
import {FaBell, FaPowerOff, FaShoppingCart, FaSignInAlt, FaUserPlus} from 'react-icons/all';
import {ColorModeSwitcher} from '../ColorModeSwitcher';
import apiPrivate from '../../services/axios';
import React from 'react';
import {useAuth} from "../../features/auth";

const LoggedIn = () => {

  const {auth, setAuth} = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <VStack spacing={1}>
        <HStack spacing={1} justifyContent={'left'} w={'100%'}>
          <Badge variant={'solid'} colorScheme={'red'}>ADMIN</Badge>
          <Heading size={'md'}>{auth?.user?.sub}</Heading>
        </HStack>
        <HStack spacing={1} justifyContent={'left'} w={'100%'}>
          <Button variant={'link'} colorScheme='blue' size='sm'
                  onClick={() => navigate('/profile/' + auth?.user?.sub)}>
            Profile
          </Button>
          <Button variant={'link'} colorScheme='blue' size='sm' onClick={() => navigate('/app/dashboard')}>
            Dashboard
          </Button>
        </HStack>
      </VStack>
      <Stack direction={'row'} align={'center'} h={'100%'} spacing={{base: 1, md: 2}}>
        <IconButton size='md' fontSize='lg' color='current' marginLeft='0' variant={'ghost'}
                    aria-label={'notifications'}>
          <Icon as={FaBell}></Icon>
        </IconButton>
        <ColorModeSwitcher/>
        <Button size='md' bg={'green.400'} color={'white'} colorScheme='green' _hover={{bg: 'green.500'}}
                leftIcon={<FaShoppingCart/>} display={{base: 'none', md: 'inherit'}}>
          Cart
        </Button>
        <IconButton size='md' fontSize='lg' bg={'green.400'} color={'white'} colorScheme='green' w={'30px'}
                    _hover={{bg: 'green.500'}} aria-label={'cart'} display={{base: 'inherit', md: 'none'}}>
          <Icon as={FaShoppingCart}></Icon>
        </IconButton>
        <Button size='md' bg={'red.500'} color={'white'} colorScheme='red' _hover={{bg: 'red.600'}}
                leftIcon={<FaPowerOff/>} display={{base: 'none', md: 'inherit'}}
                onClick={() =>
                  apiPrivate.get('/auth/logout').then(() => {
                    setAuth({});
                    navigate('/home');
                  })}>
          Logout
        </Button>
        <IconButton size='md' fontSize='lg' bg={'red.500'} color={'white'} colorScheme='red'
                    _hover={{bg: 'red.600'}} aria-label={'logout'} display={{base: 'inherit', md: 'none'}}>
          <Icon as={FaPowerOff}></Icon>
        </IconButton>
      </Stack>
    </>
  );
}

const UserBar = () => {
  const {auth} = useAuth();
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.800');

  return (
    <Box rounded={'lg'} bg={bgColor} boxShadow={'lg'} p={0} w={'100%'} mt={'32px'}
         maxWidth={{base: '80%', xl: '1044px'}} mb={6} minH={'90px'}>
      <SlideFade in={true} offsetY='20px'>
        <Stack w={'100%'} direction={'row'} p={5} px={{base: 3, sm: 5}} h={{base: 'fit-content', md: '90px'}}
               spacing={{base: 0, md: 3}}>
          <HStack overflow={'hidden'} pt={'120px'} pb={'40px'} mt={'-90px'} display={{base: 'none', md: 'inherit'}}>
            <Image src={'https://mc-heads.net/body/' + auth?.user?.sub + '/100'}/>
          </HStack>
          <Stack direction={'row'} w={'100%'} justifyContent={'space-between'}>
            {auth?.user ? <LoggedIn/>
              : (
                <>
                  <VStack spacing={'3px'} pb={'4px'} align={'start'} textAlign={'left'}>
                    <Heading lineHeight={'1'} fontSize={'2xl'}>Welcome Guest!</Heading>
                    <Heading lineHeight={'1.2'} fontSize={'lg'} color={'whiteAlpha.400'}
                             _light={{color: 'blackAlpha.600'}} fontWeight={'400'}>
                      To use all our features login or register
                    </Heading>
                  </VStack>
                  <Stack direction={{base: 'column', md: 'row'}} spacing={2} align={'center'}>
                    <Button size='md' bg={'blue.400'} color={'white'} colorScheme='blue' _hover={{bg: 'blue.500'}}
                            leftIcon={<FaSignInAlt/>}
                            onClick={() =>
                              navigate('/auth/signin')
                            }>
                      Sign in
                    </Button>
                    <Button size='md' bg={'blue.400'} color={'white'} colorScheme='blue' _hover={{bg: 'blue.500'}}
                            leftIcon={<FaUserPlus/>}
                            onClick={() =>
                              navigate('/auth/signup')
                            }>
                      Sign up
                    </Button>
                  </Stack>
                </>
              )}
          </Stack>
        </Stack>
      </SlideFade>
    </Box>
  );
}

export default UserBar;