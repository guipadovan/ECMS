import {Box, Button, HStack, Icon, SlideFade, Spinner, Stack, Text, useColorModeValue,} from '@chakra-ui/react';
import PostHeader from '../components/PostHeader';
import {api} from '../api/axios';
import {useEffect, useState} from 'react';
import PostText from '../components/PostText';
import {FaArrowRight, FaCommentDots} from 'react-icons/all';
import {useNavigate} from 'react-router';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [lastPage, setLastPage] = useState(false);
  const bgColor = useColorModeValue('white', 'gray.800');
  const navigate = useNavigate();

  const populate = async () => {
    const postRequest = await api.get('/post/posts', {
      params: {
        title: '',
        page: page,
        size: 5,
      },
    });

    setLastPage(postRequest.data.last);

    const posts = postRequest.data.content.map(post => {
      return (
        <Box key={post.id} marginBottom={6} bg={'blackAlpha.400'} _light={{bg: 'gray.100'}}
             rounded={'lg'} pb={1}>
          <PostHeader author={post.author} postedAt={post.postedAt} subtitle={post.subtitle}
                      title={post.title}/>
          <PostText text={post.text}></PostText>
          <Stack direction={{base: 'column', md: 'row'}} justifyContent={'space-between'} align={'center'}
                 mx={6} my={2} p={3} rounded={'lg'}>
            <HStack>
              <Icon as={FaCommentDots}/>
              <Text fontWeight={'500'}>{post.comments.length} Comments</Text>
            </HStack>
            <Button size="md" bg={'blue.400'} color={'white'} colorScheme="blue" _hover={{bg: 'blue.500'}}
                    rightIcon={<FaArrowRight/>}
                    onClick={() =>
                      navigate('/post/' + post.id)
                    }>
              View Post
            </Button>
          </Stack>
        </Box>
      );
    });

    setLoading(false);

    if (page !== 0) setPosts(prevState => [...prevState, posts]);
    else setPosts(posts);
  };

  useEffect(() => {
    populate();
  }, [page]);

  return (
    <Stack direction={{base: 'column', md: 'row'}} spacing={6}
           maxWidth={{base: '80%', md: '720px', xl: '1044px'}} justifyContent={'center'}>
      <Box rounded={'lg'} bg={bgColor} boxShadow={'lg'} p={5} w={{base: '100%', md: '70%'}}>
        <SlideFade in={true} offsetY="20px">
          {loading ? (
            <Box w={'full'} align={'center'} mt={'10px'}>
              <Spinner thickness="4px" speed="0.65s" emptyColor={bgColor} color="blue.500" size="xl"/>
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
          width="100%"
          height="500"
          sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
          title={'discord'}></iframe>
      </Box>
    </Stack>
  );
}
