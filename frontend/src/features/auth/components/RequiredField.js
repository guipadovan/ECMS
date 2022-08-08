import {FormControl, FormErrorMessage, FormLabel, Input, useColorModeValue} from '@chakra-ui/react';
import {Field} from 'formik';

export const RequiredField = ({form, label, name, type}) => {
  const bg = useColorModeValue('gray.100', 'blackAlpha.400');

  return (
    <FormControl isRequired isInvalid={form.errors[name] && form.touched[name]}>
      <FormLabel>{label}</FormLabel>
      <Field as={Input} bg={bg} id={name} name={name} type={type} variant='filled'/>
      <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
    </FormControl>
  )
}