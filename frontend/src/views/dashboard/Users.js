import {
  Box,
  SlideFade,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
  useColorModeValue
} from '@chakra-ui/react';
import {useEffect, useState} from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {Card} from '../../features/dashboard';
import {getUsers} from "../../features/user";

const Users = () => {

  const axiosPrivate = useAxiosPrivate();
  const [pagination, setPagination] = useState();
  const [users, setUsers] = useState();

  useEffect(() => {
    getUsers(0, setUsers, setPagination, axiosPrivate);
  }, []);

  const bgColor = useColorModeValue('gray.200', 'blackAlpha.400');
  const activeBg = useColorModeValue('gray.100', 'blackAlpha.400');
  const navbarBg = useColorModeValue('white', 'gray.800');

  return (
    <Card label={'Users'}>
      {!users ? (
        <SlideFade in={true} offsetY='20px'>
          <Box w={'full'} align={'center'} mt={'10px'}>
            <Spinner thickness='4px' speed='0.65s' emptyColor={bgColor} color='blue.500' size='xl'/>
          </Box>
        </SlideFade>
      ) : (
        <SlideFade in={true} offsetY='20px'>
          <TableContainer sx={
            {
              '::-webkit-scrollbar': {
                height: '10px',
              },
              '::-webkit-scrollbar-track': {
                mx: '1px',
              },
              '::-webkit-scrollbar-thumb': {
                bg: activeBg,
                borderRadius: '5vw',
                border: '2px solid',
                borderColor: navbarBg
              }
            }
          }>
            <Table variant='simple'>
              <Thead>
                <Tr>
                  <Th>Username</Th>
                  <Th>E-mail</Th>
                  <Th>Roles</Th>
                  <Th>Joined in</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody _last={{borderBottom: '0'}}>
                {users}
              </Tbody>
            </Table>
          </TableContainer>
          <Box w={'full'} align={'center'} mt={'30px'}>
            {pagination}
          </Box>
        </SlideFade>
      )}
    </Card>
  );
}

export default Users;