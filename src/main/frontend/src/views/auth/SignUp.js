import React, { useState } from 'react';
import * as Yup from 'yup';
import axios from 'axios';
import { Field, Formik } from 'formik';
import AlertCard from '../../components/AlertCard';
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import PasswordInput from '../../components/PasswordInput';
import { NavLink } from 'react-router-dom';

export default function SignUp() {

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
      .required('Username is required'),
    email: Yup.string()
      .email('Invalid email')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, 'Password must have numbers and letters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
  });

  return (
    <Stack spacing={5} mx={'auto'} maxW={'lg'} p={6}>
      <Heading fontSize={'4xl'} textAlign={'center'}>
        Sign up
      </Heading>
      <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.700')} boxShadow={'lg'} p={8}>
        {alert.open ? (
          <Box mb={2}>
            <AlertCard type={alert.type} title={alert.title} closable={false} description={alert.description} mb={4} />
            <Divider />
          </Box>
        ) : null}
        <Formik
          initialValues={{
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
          }}
          validationSchema={validate}
          onSubmit={(values, actions) => {
            axios.post('http://localhost:8080/api/v1/auth/register', {
              username: values.username,
              email: values.email,
              password: values.password,
              confirmPassword: values.confirmPassword,
            }).then(() => {
              actions.resetForm();
              actions.setSubmitting(false);
              setAlert({
                open: true,
                type: 'success',
                title: 'Success! Confirmation email sent',
                description: 'To complete your registration confirm your account.',
              });
            }).catch(err => {

              const errorAlert = () =>
                setAlert({
                  open: true,
                  type: 'error',
                  title: 'Error!',
                  description: 'Something went wrong, please try again later.',
                });

              actions.setSubmitting(false);
              if (err && err.response) {
                if (err.response.data.message.includes('Username'))
                  actions.setErrors({ username: err.response.data.message });
                else if (err.response.data.message.includes('Email'))
                  actions.setErrors({ email: err.response.data.message });
                else
                  errorAlert();
              } else
                errorAlert();
            });
          }}
        >
          {({ handleSubmit, errors, touched, isSubmitting, isValid, dirty }) => (
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired isInvalid={errors.username && touched.username}>
                  <FormLabel>Username</FormLabel>
                  <Field as={Input} id='username' name='username' type='text' variant='filled' />
                  <FormErrorMessage>{errors.username}</FormErrorMessage>
                </FormControl>
                <FormControl isRequired isInvalid={errors.email && touched.email}>
                  <FormLabel>Email</FormLabel>
                  <Field as={Input} id='email' name='email' type='email' variant='filled' />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>
                <Stack direction={{ base: 'column', lg: 'row' }} spacing={4} w='100%'>
                  <FormControl isRequired isInvalid={errors.password && touched.password}>
                    <FormLabel>Password</FormLabel>
                    <PasswordInput id='password' name='password' />
                    <FormErrorMessage textAlign={'left'}>{errors.password}</FormErrorMessage>
                  </FormControl>
                  <FormControl isRequired isInvalid={errors.confirmPassword && touched.confirmPassword}>
                    <FormLabel>Confirm Password</FormLabel>
                    <PasswordInput id='confirmPassword' name='confirmPassword' />
                    <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                  </FormControl>
                </Stack>
                <Stack spacing={10} pt={2} w='100%'>
                  <Button loadingText='Submitting' size='lg' m='2px' bg={'blue.400'} color={'white'} type='submit'
                          isLoading={isSubmitting}
                          isDisabled={!isValid || !dirty} _hover={{ bg: 'blue.500' }}>
                    Sign up
                  </Button>
                </Stack>
                <Stack pt={6}>
                  <Text align={'center'}>
                    Already a user? <Link as={NavLink} color={'blue.400'} to={'/signin'}>Login</Link>
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