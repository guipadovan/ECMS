import { Box, Divider, Heading, Stack, Text, useColorModeValue } from '@chakra-ui/react';

export default function Post({ post }) {

  const bgColor = useColorModeValue('white', 'gray.700');

  return (
    <Box rounded={'md'} bg={bgColor} boxShadow={'lg'} p={6} textAlign={'left'}>
      <Heading as={Text} fontSize={'2xl'} mb={1} casing={'uppercase'}>{post.title}</Heading>
      <Heading as={Text} fontSize={'xl'} mb={2} casing={'uppercase'}>{post.subtitle}</Heading>
      <Divider />
      <Stack p={4} pX={10} spacing={4}>
        {post.text}
      </Stack>
    </Box>
  );
}