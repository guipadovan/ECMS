import { getUser, isAuthenticated, logout } from '../../services/auth';
import { HStack, Icon, IconButton, Image, Text, useColorModeValue } from '@chakra-ui/react';
import { FaPowerOff } from 'react-icons/all';
import { useNavigate } from 'react-router';

export default function MenuHeader() {

  const bgColor = useColorModeValue('blackAlpha.50', 'blackAlpha.100');
  const bgShadow = useColorModeValue('0px 2px 3px 0px rgba(0, 0, 0, 0.15)', '0px 1px 3px 0px rgba(0, 0, 0, 0.15)');

  let navigate = useNavigate();

  return (isAuthenticated() ? (
    <HStack alignItems={'center'} justifyContent={'space-between'} py={2} rounded={'6px 0 0'} bg={bgColor} boxShadow={bgShadow}>
      <HStack spacing={'2'}>
        <Image ml={'12px'} w={'30px'} h={'30px'} src={'https://mc-heads.net/head/' + getUser().sub + '/right'} />
        <Text>{getUser().sub}</Text>
      </HStack>
      <IconButton size='sm' fontSize='md' aria-label={`Logout`} variant='solid' bg={'red.500'} color={'white'}
                  borderRadius={'50%'} onClick={() => {
        logout();
        navigate('/home');
      }} icon={<Icon as={FaPowerOff} />} mr={'12px !important'}
                  _hover={{ bg: 'red.600' }} />
    </HStack>
  ) : (
    <HStack justifyContent={'space-between'} py={2} rounded={'6px 0 0'} bg={bgColor} boxShadow={bgShadow}>
      <Image ml={'12px'} w={'30px'} h={'30px'} src={'https://mc-heads.net/head/Guii/right'} />
      <Text mr={'12px !important'}>Not logged in</Text>
    </HStack>
  ));
}