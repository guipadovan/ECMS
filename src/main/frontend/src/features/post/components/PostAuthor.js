import {Badge, Box, Divider, Heading, HStack, Image, Text, VStack} from '@chakra-ui/react';
import {dateFormat} from '../../../services/date';

const PostAuthor = ({author}) => {
  return (
    <Box rounded={'lg'} bg={'blackAlpha.400'} _light={{bg: 'gray.200'}} w={{base: '100%', sm: '240px'}} p={3}>
      <VStack spacing={3} align={'center'}>
        <Image w={'64px'} h={'64px'} border={'3px solid'} borderColor={'blackAlpha.400'} mb={0}
               borderRadius={'8px'} src={'https://mc-heads.net/avatar/' + author.username + '/100'}/>
        <Box mt={0} align={'center'}>
          <Heading size={'md'}>{author.username}</Heading>
          <Badge variant={'solid'} colorScheme={'red'}>ADMIN</Badge>
        </Box>
        <Divider/>
        <Box border={'1px solid'} borderColor={'blackAlpha.400'} p={2} rounded={'md'} bg={'gray.900'}
             _light={{bg: 'gray.100'}}>
          <VStack fontSize={'14'} spacing={1} color={'whiteAlpha.600'} _light={{color: 'blackAlpha.600'}}>
            <PostAuthorItem title={'Joined in:'} value={dateFormat(author.createdAt, 'dd/MM/yyyy')}/>
            <PostAuthorItem title={'Discord:'} value={'guiip#9151'}/>
          </VStack>
        </Box>
      </VStack>
    </Box>
  )
}

const PostAuthorItem = ({title, value}) => {
  return (
    <HStack justifyContent={'space-between'} align={'left'} w={'100%'}>
      <Text fontWeight={'semibold'}>{title}</Text>
      <Text>{value}</Text>
    </HStack>
  )
}

export default PostAuthor;