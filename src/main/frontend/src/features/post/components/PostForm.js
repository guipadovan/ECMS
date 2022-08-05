import RichTextArea from '../../../components/input/RichTextArea';
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
} from '@chakra-ui/react';
import {Field, Formik} from 'formik';
import {validate} from '../services/postValidation';

export const PostForm = ({defaultValues, submit}) => {

  const fieldBg = useColorModeValue('gray.100', 'blackAlpha.400');
  const fieldHoverBg = useColorModeValue('gray.200', 'whiteAlpha.100');

  return (
    <Formik initialValues={defaultValues} validationSchema={validate} onSubmit={submit}>
      {form => (
        <form onSubmit={form.handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired isInvalid={form.errors.title && form.touched.title}>
              <HStack justifyContent={'space-between'}>
                <FormLabel>Title</FormLabel>
                <FormHelperText mb={2}>Insert the post title</FormHelperText>
              </HStack>
              <Field as={Input} bg={fieldBg} id='title' name='title' type='text' variant='filled'
                     placeholder={'Welcome!'}/>
              <FormErrorMessage>{form.errors.title}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={form.errors.subtitle && form.touched.subtitle}>
              <HStack justifyContent={'space-between'}>
                <FormLabel>Subtitle</FormLabel>
                <FormHelperText mb={2}>Insert the post subtitle</FormHelperText>
              </HStack>
              <Field as={Input} bg={fieldBg} id='subtitle' name='subtitle' type='text' variant='filled'
                     placeholder={'Our new website is live'}/>
              <FormErrorMessage>{form.errors.subtitle}</FormErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={form.errors.text && form.touched.text}>
              <HStack justifyContent={'space-between'}>
                <FormLabel>Text</FormLabel>
                <FormHelperText mb={2}>Insert the post text</FormHelperText>
              </HStack>
              <RichTextArea id='text' name='text'></RichTextArea>
              <FormErrorMessage>{form.errors.text}</FormErrorMessage>
            </FormControl>
            <HStack justifyContent={'space-between'} w={'full'}>
              <Box borderRadius={'md'} bg={fieldBg} border={'2px solid'} borderColor={'transparent'}
                   _hover={{bg: fieldHoverBg}} transition={'0.3s ease'} h={10} px={4} justifyContent={'center'}>
                <Field as={Checkbox} id='locked' name='locked' h={'full'} w={'full'} value={true}>
                  Locked
                </Field>
              </Box>
              <Button loadingText='Posting' size='md' bg={'blue.400'} color={'white'} type='submit'
                      colorScheme='blue' isLoading={form.isSubmitting} isDisabled={!form.isValid || !form.dirty}
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