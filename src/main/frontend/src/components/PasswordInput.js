import { Field } from 'formik';
import { Button, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useState } from 'react';

export default function PasswordInput(props) {

  const [viewToggle, setViewToggle] = useState(false);

  return(
    <InputGroup>
      <Field as={Input} w={'100%'} id={props.id} name={props.name} type={viewToggle ? 'text' : 'password'} variant='filled' />
      <InputRightElement h={'full'}>
        <Button variant={'ghost'} onClick={() => {setViewToggle(!viewToggle)}}>
          {viewToggle ? <ViewIcon /> : <ViewOffIcon />}
        </Button>
      </InputRightElement>
    </InputGroup>
  )
}