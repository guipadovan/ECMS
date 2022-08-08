import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import {useLocation} from 'react-router-dom';
import {FiSearch} from 'react-icons/all';
import {links} from '../services/navLinks';
import createSidebarItems from '../../../services/createSidebarItems';

export const DashboardSidebar = ({...rest}) => {

  const location = useLocation();

  const activeRoute = (routeName) => {
    return location.pathname === routeName;
  };

  const activeBg = useColorModeValue('gray.100', 'blackAlpha.400');
  const activeColor = useColorModeValue('gray.700', 'white');
  const navbarBg = useColorModeValue('white', 'gray.800');

  return (
    <Box as='nav' pos='fixed' top='0' left='0' zIndex='sticky' h='full' overflowX='hidden'
         overflowY='overlay' bg={navbarBg} borderColor='blackAlpha.300' borderRightWidth='1px' w='250px'
         sx={
           {
             '::-webkit-scrollbar': {
               width: '10px',
             },
             '::-webkit-scrollbar-track': {
               my: '1px',
             },
             '::-webkit-scrollbar-thumb': {
               bg: activeBg,
               borderRadius: '5vw',
               border: '0.3vw solid',
               borderColor: navbarBg
             }
           }
         }
         {...rest}>
      <Stack direction='column' mb='8px'>
        <Box>
          <Flex py='2' justifyContent={'center'} display={'flex'} flexWrap={'wrap'}>
            <Text fontSize='2xl' color={activeColor} fontWeight='semibold' pb={'5px'}>
              ECMS
            </Text>
          </Flex>
          <Flex direction='column' as='nav' fontSize='sm' color='gray.600' aria-label='Main Navigation'>
            <InputGroup display='flex' mb={'10px'}>
              <InputLeftElement color='gray.500' _dark={{color: 'blue.500'}}>
                <FiSearch/>
              </InputLeftElement>
              <Input placeholder='Search' fontWeight={'500'} color={useColorModeValue('black', 'gray.400')}
                     lineHeight={'40px'}/>
            </InputGroup>
            <VStack spacing={'8px'}>
              {createSidebarItems(links(), false, activeBg, activeColor, activeRoute, location)}
            </VStack>
          </Flex>
        </Box>
      </Stack>
    </Box>
  );
};