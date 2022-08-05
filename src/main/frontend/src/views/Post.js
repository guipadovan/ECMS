import {
  Box,
  Button,
  FormControl,
  Heading,
  HStack,
  SlideFade,
  Spinner,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import {useEffect, useState} from 'react';
import {useParams} from 'react-router';
import {Formik} from 'formik';
import RichTextArea, {serialize} from '../components/input/RichTextArea';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import {addComment, getPost} from '../features/post';
import {useAuth} from "../features/auth";

export default function PostView() {

  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(true);
  const [post, setPost] = useState();
  const [comments, setComments] = useState();
  const bgColor = useColorModeValue('white', 'gray.800');
  const {id} = useParams();
  const {auth} = useAuth();
  const axiosPrivate = useAxiosPrivate();

  const initialValues = {
    comment: [
      {
        type: 'paragraph',
        children: [{text: ''}],
      },
    ]
  };

  useEffect(() => {
    getPost(id, setPost, setComments, setLoading, setValid);
  }, []);

  return (
    <Stack direction={'column'} spacing={6} maxWidth={{base: '80%', xl: '1044px'}} justifyContent={'center'}>
      <Box rounded={'lg'} bg={bgColor} boxShadow={'lg'} p={5} w={'100%'}>
        <SlideFade in={true} offsetY='20px'>
          {loading ? (
            <Box w={'full'} align={'center'} mt={'10px'}>
              <Spinner thickness='4px' speed='0.65s' emptyColor={bgColor} color='blue.500' size='xl'/>
            </Box>
          ) : post}
        </SlideFade>
      </Box>
      {!loading && comments?.length !== 0 && valid ? (
        <Box align={'left'}>
          <Heading size={'lg'} fontWeight={'semibold'}>Comments</Heading>
          <Box rounded={'lg'} bg={bgColor} boxShadow={'lg'} p={5} w={'100%'} align={'left'} my={1}>
            <SlideFade in={true} offsetY='20px'>
              <Stack spacing={2}>
                {comments}
              </Stack>
            </SlideFade>
          </Box>
        </Box>
      ) : null}
      {!loading && auth?.user && valid ? (
        <Box align={'left'}>
          <Formik initialValues={initialValues}
                  onSubmit={(values, actions) =>
                    addComment(axiosPrivate, id, values, actions)
                      .then(() => getPost(id, setPost, setComments, setLoading, setValid))}>
            {form => (
              <form onSubmit={form.handleSubmit}>
                <Heading size={'lg'} fontWeight={'semibold'}>Add Comment</Heading>
                <Box rounded={'lg'} bg={bgColor} boxShadow={'lg'} p={5} w={'100%'} align={'left'} my={1}>
                  <FormControl isRequired>
                    <RichTextArea id='comment' name='comment'></RichTextArea>
                  </FormControl>
                </Box>
                <HStack justifyContent={'right'} w={'full'} mt={2}>
                  <Button loadingText='Posting' size='md' bg={'blue.400'} color={'white'} type='submit'
                          colorScheme='blue' isLoading={form.isSubmitting} _hover={{bg: 'blue.500'}}
                          isDisabled={serialize(form.values.comment).trim().length === 0}>
                    Comment
                  </Button>
                </HStack>
              </form>
            )}
          </Formik>
        </Box>
      ) : null}
    </Stack>
  );
}
