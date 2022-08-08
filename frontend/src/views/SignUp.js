import React, {useState} from 'react';
import {Formik} from 'formik';
import AlertCard from '../components/alert/AlertCard';
import {Box, Divider, Link, Stack, Text, VStack,} from '@chakra-ui/react';
import {NavLink} from 'react-router-dom';
import {validateRegister} from '../features/auth/services/authValidation';
import {Card, register, RequiredField, SubmitButton} from "../features/auth";

export default function SignUp() {

  const [alert, setAlert] = useState({
    open: false,
    type: '',
    title: '',
    description: '',
  });

  const initialValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  return (
    <Card label={'Sign up'} mt={{base: '-325px', md: '-400px'}}>
      {alert.open ? (
        <Box mb={2}>
          <AlertCard type={alert.type} title={alert.title} closable={false} icon={true}
                     description={alert.description} mb={4}/>
          <Divider/>
        </Box>
      ) : null}
      <Formik initialValues={initialValues} validationSchema={validateRegister}
              onSubmit={(values, actions) =>
                register(values, actions, setAlert)
              }>
        {form => (
          <form onSubmit={form.handleSubmit}>
            <VStack spacing={4}>
              <RequiredField form={form} label={'Username'} name={'username'} type={'text'}/>
              <RequiredField form={form} label={'Email'} name={'email'} type={'email'}/>
              <Stack direction={{base: 'column', lg: 'row'}} spacing={4} w='100%'>
                <RequiredField form={form} label={'Password'} name={'password'} type={'password'}/>
                <RequiredField form={form} label={'Confirm Password'} name={'confirmPassword'} type={'password'}/>
              </Stack>
              <SubmitButton form={form} text={'Sign up'}>
                <Text align={'center'}>
                  Already a user? <Link as={NavLink} color={'blue.400'} to={'/signin'}>Login</Link>
                </Text>
              </SubmitButton>
            </VStack>
          </form>
        )}
      </Formik>
    </Card>
  );
}