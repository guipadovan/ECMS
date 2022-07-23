import React, { useState } from 'react';
import * as Yup from 'yup';
import { Field, Formik } from 'formik';
import AlertCard from '../../components/alert/AlertCard';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  Link,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import PasswordInput from '../../components/input/PasswordInput';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router';
import jwtDecode from 'jwt-decode';
import useAuth from '../../hooks/useAuth';
import { api } from '../../api/axios';

export default function SignIn() {

  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [alert, setAlert] = useState({
    open: false,
    type: '',
    title: '',
    description: '',
  });

  const validate = Yup.object({
    username: Yup.string()
      .min(4, 'Username must be at least 4 characters')
      .max(16, 'Username must be 16 characters or less')
      .test('has-text',
        () => 'Username is required',
        (value) => {
          if (value === undefined)
            return true;
          return value.trim().length !== 0;
        })
      .required('Username is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .test('has-text',
        () => 'Password is required',
        (value) => {
          if (value === undefined)
            return true;
          return value.trim().length !== 0;
        })
      .required('Password is required'),
  });

  const fieldBg = useColorModeValue('gray.100', 'blackAlpha.400');

  return (
    <Stack spacing={5} mx={'auto'} maxW={'lg'} p={6}>
      <Heading fontSize={'4xl'} textAlign={'center'}>
        Sign in
      </Heading>
      <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.800')} boxShadow={'lg'} p={8}>
        {alert.open ? (
          <Box mb={2}>
            <AlertCard type={alert.type} title={alert.title} closable={false} icon={true}
                       description={alert.description} mb={4} />
            <Divider />
          </Box>
        ) : null}
        <Formik
          initialValues={{
            username: '',
            password: '',
          }}
          validationSchema={validate}
          onSubmit={(values, actions) => {
            api.post('/auth/login', {
              username: values.username,
              password: values.password,
            }, {
              withCredentials: true,
            }).then(res => {
              const data = {
                user: jwtDecode(res.data.token),
                token: res.data.token,
              };
              setAuth(data);
              navigate('/app/profile');
            }).catch(err => {
              const errorAlert = (description) =>
                setAlert({
                  open: true,
                  type: 'error',
                  title: 'Error!',
                  description: description,
                });

              actions.setSubmitting(false);
              if (err && err.response)
                errorAlert(err.response.data.message);
              else
                errorAlert('Something went wrong');
            });
          }}
        >
          {({ handleSubmit, errors, touched, isSubmitting, isValid, dirty }) => (
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired isInvalid={errors.username && touched.username}>
                  <FormLabel>Username</FormLabel>
                  <Field as={Input} bg={fieldBg} id='username' name='username' type='text' variant='filled' />
                  <FormErrorMessage>{errors.username}</FormErrorMessage>
                </FormControl>
                <FormControl isRequired isInvalid={errors.password && touched.password}>
                  <FormLabel>Password</FormLabel>
                  <PasswordInput bg={fieldBg} id='password' name='password' />
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>
                <HStack justify='space-between' w={'100%'}>
                  <Checkbox defaultChecked>Remember me</Checkbox>
                  <Button variant='link' colorScheme='blue' size='sm'>
                    Forgot password?
                  </Button>
                </HStack>
                <Stack spacing={10} pt={2} w='100%'>
                  <Button loadingText='Submitting' size='lg' m='2px' bg={'blue.400'} color={'white'} type='submit'
                          isLoading={isSubmitting} isDisabled={!isValid || !dirty} _hover={{ bg: 'blue.500' }}>
                    Sign in
                  </Button>
                </Stack>
                <Stack pt={6}>
                  <Text align={'center'}>
                    Not registered yet? <Link as={NavLink} color={'blue.400'} to={'/signup'}>Register</Link>
                  </Text>
                </Stack>
              </VStack>
            </form>
          )}
        </Formik>
      </Box>
    </Stack>
  );
}