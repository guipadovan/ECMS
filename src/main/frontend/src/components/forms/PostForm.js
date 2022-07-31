import * as Yup from "yup";
import RichTextArea, {serialize} from "../input/RichTextArea";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  useColorModeValue,
  VStack
} from "@chakra-ui/react";
import {Field, Formik} from "formik";

const PostForm = ({defaultValues, submit}) => {

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
    <Formik
      initialValues={defaultValues}
      validationSchema={validate}
      onSubmit={submit}
    >
      {({handleSubmit, errors, touched, isSubmitting, isValid, dirty}) => (
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired isInvalid={errors.title && touched.title}>
              <HStack justifyContent={'space-between'}>
                <FormLabel>Title</FormLabel>
                <FormHelperText mb={2}>Insert the post title</FormHelperText>
              </HStack>
              <Field as={Input} bg={fieldBg} id='title' name='title' type='text' variant='filled'
                     placeholder={'Welcome!'}/>
              <FormErrorMessage>{errors.title}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.subtitle && touched.subtitle}>
              <HStack justifyContent={'space-between'}>
                <FormLabel>Subtitle</FormLabel>
                <FormHelperText mb={2}>Insert the post subtitle</FormHelperText>
              </HStack>
              <Field as={Input} bg={fieldBg} id='subtitle' name='subtitle' type='text' variant='filled'
                     placeholder={'Our new website is live'}/>
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
                   _hover={{bg: fieldHoverBg}} transition={'0.3s ease'} h={10} px={4} justifyContent={'center'}>
                <Field as={Checkbox} id='locked' name='locked' h={'full'} w={'full'} value={true}>
                  Locked
                </Field>
              </Box>
              <Button loadingText='Posting' size='md' bg={'blue.400'} color={'white'} type='submit'
                      colorScheme='blue' isLoading={isSubmitting} isDisabled={!isValid || !dirty}
                      _hover={{bg: 'blue.500'}}>
                Save
              </Button>
            </HStack>
          </VStack>
        </form>
      )}
    </Formik>
  )
}

export default PostForm;