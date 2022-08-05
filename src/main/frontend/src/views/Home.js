import {Box, Button, SlideFade, Spinner, Stack, useColorModeValue,} from '@chakra-ui/react';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router';
import {getHomePosts} from '../features/post';

const Home = () => {

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [lastPage, setLastPage] = useState(false);
  const bgColor = useColorModeValue('white', 'gray.800');
  const navigate = useNavigate();

  useEffect(() => {
    getHomePosts(page, setLastPage, setPosts, navigate);
  }, [page]);

  return (
    <Stack direction={{base: 'column', md: 'row'}} spacing={6} justifyContent={'center'}
           maxWidth={{base: '80%', xl: '1044px'}}>
      <Box rounded={'lg'} bg={bgColor} boxShadow={'lg'} p={5} w={{base: '100%', md: '70%'}}>
        <SlideFade in={true} offsetY='20px'>
          {posts.length === 0 ? (
            <Box w={'full'} align={'center'} mt={'10px'}>
              <Spinner thickness='4px' speed='0.65s' emptyColor={bgColor} color='blue.500' size='xl'/>
            </Box>
          ) : (
            <Box>
              {posts}
              {lastPage ? null : (
                <Button w={'100%'} onClick={() => setPage(page + 1)}>
                  Load more
                </Button>
              )}
            </Box>
          )}
        </SlideFade>
      </Box>
      <Box rounded={'lg'} boxShadow={'lg'} w={{base: '100%', md: '30%'}} overflow={'hidden'} h={'fit-content'}>
        <iframe
          src={'https://discord.com/widget?id=607741467947171861&theme=dark'}
          width='100%'
          height='500'
          sandbox='allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts'
          title={'discord'}></iframe>
      </Box>
    </Stack>
  );
}

export default Home;
