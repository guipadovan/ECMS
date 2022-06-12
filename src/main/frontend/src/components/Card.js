import { Box, Heading, Text, Stack, useColorModeValue, Divider } from '@chakra-ui/react';

export default function Card({title, children, ...rest}) {

  const bgColor = useColorModeValue('white', 'gray.700');

  return (
    <Box rounded={'md'} bg={bgColor} boxShadow={'lg'} p={6} textAlign={'left'} {...rest}>
      <Heading as={Text} fontSize={'2xl'} mb={2} casing={'uppercase'}>{title}</Heading>
      <Divider />
      <Stack p={4} pX={10} spacing={4}>
        {children}
      </Stack>
    </Box>
  );
}