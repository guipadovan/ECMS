import {api} from '../../../services/axios';
import {Box, Button, Heading, HStack, Icon, IconButton, Stack, Td, Text, Tooltip, Tr} from '@chakra-ui/react';
import {FaArrowRight, FaCommentDots, FaLock, FaLockOpen, FaPencilAlt} from 'react-icons/all';
import {PostHeader} from '../components/PostHeader';
import {PostText} from '../components/PostText';
import {dateFormat} from '../../../services/date';
import {Pagination} from '../components/Pagination';
import {Post} from '../components/Post';
import {deletePost, switchPostLock} from './updatePost';
import {PostDeleteButton} from '../components/PostDeleteButton';

const postsRequest = async (page, size) => {
  return await api.get('/post/posts', {
    params: {
      title: '',
      page: page,
      size: size,
    },
  });
}

export const getPosts = (page, setPosts, setPagination, axiosPrivate, navigate) => {
  postsRequest(page, 10)
    .then(response => {

      setPosts(response.data.content.map((post, i) => {
        const border = response.data.content.length === i + 1 ? '0' : 'solid 1px';

        return (
          <Tr key={post.id}>
            <Td p={'10px'} borderBottom={border}>{post.id}</Td>
            <Td maxWidth={'210px'} overflow={'hidden'} textOverflow={'ellipsis'} p={'10px'} borderBottom={border}>
              <Tooltip bg={'blue.500'} color={'white'} label={post.title} placement={'top'} hasArrow>
                {post.title}
              </Tooltip>
            </Td>
            <Td p={'10px'} borderBottom={border}>{post.author.username}</Td>
            <Td p={'10px'} borderBottom={border}>
              <Tooltip bg={'blue.500'} color={'white'} placement={'top'}
                       label={dateFormat(post.postedAt, 'dd/MM/yyyy hh:mm')} hasArrow>
                {dateFormat(post.postedAt, 'dd/MM/yyyy')}
              </Tooltip>
            </Td>
            <Td p={'10px'} borderBottom={border}>
              <Tooltip bg={'blue.500'} color={'white'} placement={'top'}
                       label={'Updated by ' + post.lastUpdatedBy.username + ' at ' +
                         dateFormat(post.updatedAt, 'dd/MM/yyyy hh:mm')} hasArrow>
                {dateFormat(post.updatedAt, 'dd/MM/yyyy')}
              </Tooltip>
            </Td>
            <Td p={'10px'} borderBottom={border}>{post.comments.length}</Td>
            <Td p={'10px'} borderBottom={border}>
              <HStack spacing={'4px'}>
                <IconButton size='sm' colorScheme={'gray'}
                            onClick={() => {
                              switchPostLock(axiosPrivate, post.id).then(() => {
                                getPosts(page, setPosts, setPagination, axiosPrivate, navigate);
                              });
                            }} icon={post.locked ? <FaLock/> : <FaLockOpen/>} aria-label={'lock/unlock post'}/>
                <IconButton size='sm' color={'white'} bg={'blue.400'} colorScheme={'blue'}
                            _hover={{bg: 'blue.500'}}
                            onClick={() => navigate('/app/posts/update/' + post.id)}
                            icon={<FaPencilAlt/>} aria-label={'edit post'}/>
                <PostDeleteButton action={() => {
                  deletePost(axiosPrivate, post.id).then(() => {
                    getPosts(page, setPosts, setPagination, axiosPrivate, navigate);
                  })
                }}/>
              </HStack>
            </Td>
          </Tr>
        )
      }));

      setPagination(<Pagination first={response.data.first} last={response.data.last}
                                current={response.data.number} totalPages={response.data.totalPages}
                                handlePrevious={() =>
                                  getPosts(page - 1, setPosts, setPagination, axiosPrivate, navigate)}
                                handleNext={() =>
                                  getPosts(page + 1, setPosts, setPagination, axiosPrivate, navigate)}
                                handleNumbers={(number) =>
                                  getPosts(number, setPosts, setPagination, axiosPrivate, navigate)}/>
      );
    })
    .catch(() => {
      setPosts(
        <Box p={8} rounded={'lg'}>
          <Heading size={'xl'}>Empty!</Heading>
          <Heading size={'md'}>There are no posts yet :(</Heading>
        </Box>
      );
    })
}

export const getHomePosts = (page, setLastPage, setPosts, navigate) => {
  postsRequest(page, 5)
    .then(response => {
      setLastPage(response.data.last);

      const posts = response.data.content.map(post => {
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
              <Button size='md' bg={'blue.400'} color={'white'} colorScheme='blue' _hover={{bg: 'blue.500'}}
                      rightIcon={<FaArrowRight/>}
                      onClick={() => navigate('/post/' + post.id)}>
                View Post
              </Button>
            </Stack>
          </Box>
        );
      });

      if (page !== 0) setPosts(prevState => [...prevState, posts]); else setPosts(posts);
    })
    .catch(() => {
      setPosts(
        <Box p={8} rounded={'lg'}>
          <Heading size={'xl'}>404</Heading>
          <Heading size={'md'}>Post not found</Heading>
        </Box>
      );
    });
}

export const getPostRequest = async (id) => {
  return await api.get('/post/' + id);
}

export const getPost = (id, setPost, setComments, setLoading, setValid) => {
  getPostRequest(id)
    .then(response => {
      setLoading(false);

      setPost(<Post post={response.data}/>);

      setComments(response.data.comments.map(comment => {
        return <Post post={comment} comment={true} key={comment.id}/>
      }));
    })
    .catch(() => {
      setLoading(false);
      setValid(false);
      setPost(
        <Box p={8} rounded={'lg'}>
          <Heading size={'xl'}>404</Heading>
          <Heading size={'md'}>Post not found</Heading>
        </Box>
      );
    });
}