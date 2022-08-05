import {Button, Stack} from '@chakra-ui/react';

export const SubmitButton = ({form, text, children}) => {
  return <>
    <Stack spacing={10} pt={2} w='100%'>
      <Button loadingText='Submitting' size='lg' m='2px' bg={'blue.400'} color={'white'} type='submit'
              isLoading={form.isSubmitting} isDisabled={!form.isValid || !form.dirty}
              _hover={{bg: 'blue.500'}}>
        {text}
      </Button>
    </Stack>
    <Stack pt={6}>
      {children}
    </Stack>
  </>;
}