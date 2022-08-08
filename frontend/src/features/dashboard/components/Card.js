import {Box, Stack, useColorModeValue} from '@chakra-ui/react';
import {CardHeader} from './CardHeader';

export const Card = ({label, children, ...rest}) => {
  return (
    <Stack spacing={5} mx={'auto'} px={8} py={4} {...rest}>
      <CardHeader label={label}/>)
      <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.800')} boxShadow={'lg'} p={8}>
        {children}
      </Box>
    </Stack>
  );
}