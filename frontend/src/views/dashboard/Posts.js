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
import {useNavigate} from 'react-router';
import {getPosts} from '../../features/post';
import {Card} from '../../features/dashboard';

const Posts = () => {

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [pagination, setPagination] = useState();
  const [posts, setPosts] = useState();

  useEffect(() => {
    getPosts(0, setPosts, setPagination, axiosPrivate, navigate);
  }, []);

  const bgColor = useColorModeValue('gray.200', 'blackAlpha.400');
  const activeBg = useColorModeValue('gray.100', 'blackAlpha.400');
  const navbarBg = useColorModeValue('white', 'gray.800');

  return (
    <Card label={'Posts'}>
      {!posts ? (
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
                  <Th>ID</Th>
                  <Th>Title</Th>
                  <Th>Author</Th>
                  <Th>Posted At</Th>
                  <Th>Updated At</Th>
                  <Th>Comments</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody _last={{borderBottom: '0'}}>
                {posts}
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

export default Posts;