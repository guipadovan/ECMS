import {Box, Heading, Stack, useColorModeValue} from '@chakra-ui/react';

export const Card = ({label, children, ...rest}) => {
  return (
    <Stack spacing={5} mx={'auto'} maxW={'lg'} p={6} {...rest}>
      <Heading fontSize={'4xl'} textAlign={'center'} color={'white'}>
        {label}
      </Heading>
      <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.800')} boxShadow={'lg'} p={8}>
        {children}
      </Box>
    </Stack>
  )
}