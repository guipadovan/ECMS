import React, {useState} from 'react';
import {Field, Formik} from 'formik';
import AlertCard from '../components/alert/AlertCard';
import {Box, Button, Checkbox, Divider, HStack, Link, Text, VStack,} from '@chakra-ui/react';
import {NavLink} from 'react-router-dom';
import {validateLogin} from '../features/auth/services/authValidation';
import {useNavigate} from 'react-router';
import {Card, login, RequiredField, SubmitButton, useAuth} from "../features/auth";

export default function SignIn() {

  const {setAuth} = useAuth();
  const navigate = useNavigate();
  const [alert, setAlert] = useState({
    open: false,
    type: '',
    title: '',
    description: '',
  });

  const initialValues = {
    username: '',
    password: '',
    rememberMe: true,
  };

  return (
    <Card label={'Sign in'} mt={{base: '-325px', md: '-400px'}}>
      {alert.open ? (
        <Box mb={2}>
          <AlertCard type={alert.type} title={alert.title} closable={false} icon={true}
                     description={alert.description} mb={4}/>
          <Divider/>
        </Box>
      ) : null}
      <Formik initialValues={initialValues} validationSchema={validateLogin}
              onSubmit={(values, actions) =>
                login(values, setAuth, navigate, actions, setAlert)
              }>
        {form => (
          <form onSubmit={form.handleSubmit}>
            <VStack spacing={4}>
              <RequiredField form={form} label={'Username'} name={'username'} type={'text'}/>
              <RequiredField form={form} label={'Password'} name={'password'} type={'password'}/>
              <HStack justify='space-between' w={'100%'}>
                <Field as={Checkbox} id='rememberMe' name='rememberMe' defaultChecked>Remember me</Field>
                <Button variant='link' colorScheme='blue' size='sm'>
                  Forgot password?
                </Button>
              </HStack>
              <SubmitButton form={form} text={'Sign in'}>
                <Text align={'center'}>
                  Not registered yet? <Link as={NavLink} color={'blue.400'} to={'/signup'}>Register</Link>
                </Text>
              </SubmitButton>
            </VStack>
          </form>
        )}
      </Formik>
    </Card>
  );
}