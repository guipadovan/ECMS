import * as Yup from 'yup';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { Field, Formik } from 'formik';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { FaArrowLeft, FaInfo } from 'react-icons/all';
import RichTextArea, { serialize } from '../../../components/input/RichTextArea';

export default function AddPost() {

  const axiosPrivate = useAxiosPrivate();

  const validate = Yup.object({
    title: Yup.string()
      .min(3, 'Title  must be at least 3 characters')
      .max(64, 'Title must be 64 characters or less')
      .test('has-text',
        () => 'Title is required',
        (value) => {
          if (value === undefined)
            return true;
          return value.trim().length !== 0;
        })
      .required('Title is required'),
    subtitle: Yup.string()
      .max(128, 'Subtitle must be 128 characters or less')
      .test('has-text',
        () => 'Subtitle is required',
        (value) => {
          if (value === undefined)
            return true;
          return value.trim().length !== 0;
        }),
    text: Yup.array()
      .test('has-text',
        () => 'Text is required',
        (value) => serialize(value).trim().length !== 0),
    locked: Yup.bool(),
  });

  const fieldBg = useColorModeValue('gray.100', 'blackAlpha.400');
  const fieldHoverBg = useColorModeValue('gray.200', 'whiteAlpha.100');

  return (
    <Stack spacing={5} mx={'auto'} px={8} py={4}>
      <HStack alignItems={'center'} justifyContent={'space-between'}>
        <Heading fontSize={{ base: '2xl', sm: '4xl' }} textAlign={'center'}>
          New Post
        </Heading>
        <HStack>
          <Button colorScheme='gray' size={{ base: 'sm', sm: 'md' }} leftIcon={<FaInfo />} borderRadius={'5px'}
                  bg={'blackAlpha.400'}
                  _light={{ bg: 'blackAlpha.100' }}>
            Help
          </Button>
          <Button colorScheme='blue' size={{ base: 'sm', sm: 'md' }} leftIcon={<FaArrowLeft />} bg={'blue.400'}
                  color={'white'}
                  _hover={{ bg: 'blue.500' }} borderRadius={'5px'}>
            Back
          </Button>
        </HStack>
      </HStack>
      <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.800')} boxShadow={'lg'} p={8}>
        <Formik
          initialValues={{
            title: '',
            subtitle: '',
            text: [
              {
                type: 'paragraph',
                children: [{ text: '' }],
              },
            ],
            locked: false,
          }}
          //validateOnChange={false}
          validationSchema={validate}
          onSubmit={(values, actions) => {
            axiosPrivate.post('/post/new', {
              title: values.title,
              subtitle: values.subtitle,
              text: JSON.stringify(values.text),
              locked: values.locked,
            }).then(() => {
              actions.resetForm();
              actions.setSubmitting(false);
              // TODO redirect to post page
            }).catch(err => {
              actions.setSubmitting(false);
              console.log(err);
            });
          }}
        >
          {({ handleSubmit, errors, touched, isSubmitting, isValid, dirty }) => (
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired isInvalid={errors.title && touched.title}>
                  <HStack justifyContent={'space-between'}>
                    <FormLabel>Title</FormLabel>
                    <FormHelperText mb={2}>Insert the post title</FormHelperText>
                  </HStack>
                  <Field as={Input} bg={fieldBg} id='title' name='title' type='text' variant='filled'
                         placeholder={'Welcome!'} />
                  <FormErrorMessage>{errors.title}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.subtitle && touched.subtitle}>
                  <HStack justifyContent={'space-between'}>
                    <FormLabel>Subtitle</FormLabel>
                    <FormHelperText mb={2}>Insert the post subtitle</FormHelperText>
                  </HStack>
                  <Field as={Input} bg={fieldBg} id='subtitle' name='subtitle' type='text' variant='filled'
                         placeholder={'Our new website is live'} />
                  <FormErrorMessage>{errors.subtitle}</FormErrorMessage>
                </FormControl>
                <FormControl isRequired isInvalid={errors.text && touched.text}>
                  <HStack justifyContent={'space-between'}>
                    <FormLabel>Text</FormLabel>
                    <FormHelperText mb={2}>Insert the post text</FormHelperText>
                  </HStack>
                  <RichTextArea id='text' name='text'></RichTextArea>
                  <FormErrorMessage>{errors.text}</FormErrorMessage>
                </FormControl>
                <HStack justifyContent={'space-between'} w={'full'}>
                  <Box borderRadius={'md'} bg={fieldBg} border={'2px solid'} borderColor={'transparent'}
                       _hover={{ bg: fieldHoverBg }} transition={'0.3s ease'} h={10} px={4} justifyContent={'center'}>
                    <Field as={Checkbox} id='locked' name='locked' h={'full'} w={'full'}>
                      Locked
                    </Field>
                  </Box>
                  <Button loadingText='Posting' size='md' bg={'blue.400'} color={'white'} type='submit'
                          colorScheme='blue'
                          isLoading={isSubmitting} isDisabled={!isValid || !dirty} _hover={{ bg: 'blue.500' }}>
                    Post
                  </Button>
                </HStack>
              </VStack>
            </form>
          )}
        </Formik>
      </Box>
    </Stack>
  );
}