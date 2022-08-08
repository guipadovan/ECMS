import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {useNavigate, useParams} from 'react-router';
import {getPostRequest, PostForm, updatePost} from '../../features/post';
import {useEffect, useState} from 'react';
import {Box, SlideFade, Spinner, useColorModeValue} from '@chakra-ui/react';
import {Card} from '../../features/dashboard';

const UpdatePost = () => {

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const {id} = useParams();
  const [initialValues, setInitialValues] = useState({
    title: '',
    subtitle: '',
    text: [
      {
        type: 'paragraph',
        children: [{text: ''}],
      },
    ],
    locked: false,
  });

  useEffect(() => {
    getPostRequest(id)
      .then(response => {
        setInitialValues({
          title: response.data.title,
          subtitle: response.data.subtitle,
          text: JSON.parse(response.data.text),
          locked: response.data.locked,
        })
      })
      .catch(() => navigate(-1))
  }, []);


  const bgColor = useColorModeValue('gray.200', 'blackAlpha.400');

  return (
    <Card label={'Update Post'}>
      {initialValues.title === '' ? (
        <SlideFade in={true} offsetY='20px'>
          <Box w={'full'} align={'center'} mt={'10px'}>
            <Spinner thickness='4px' speed='0.65s' emptyColor={bgColor} color='blue.500' size='xl'/>
          </Box>
        </SlideFade>
      ) : (
        <SlideFade in={true} offsetY='20px'>
          <PostForm defaultValues={initialValues} submit={(values) =>
            updatePost(axiosPrivate, id, values).then(() => navigate(-1))
          }/>
        </SlideFade>
      )}
    </Card>
  );
}

export default UpdatePost;