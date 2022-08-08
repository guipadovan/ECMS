import {Box, Heading, HStack, Stack, Text, Tooltip, VStack} from '@chakra-ui/react';
import {dateFormat} from '../../../services/date';
import {PostText} from './PostText';

const PostBody = ({post, comment}) => {
  return (
    <VStack p={3} w={'100%'}>
      {comment ? null : <PostBodyHeader post={post}/>}
      <VStack justifyContent={'space-between'} w={'100%'} h={'100%'}>
        <Box w={'100%'}>
          <PostText text={post.text} disableMaxHeight={true}></PostText>
        </Box>
        <PostBodyFooter post={post} comment={comment}/>
      </VStack>
    </VStack>
  );
}

const PostBodyHeader = ({post}) => {
  return (
    <Stack direction={{base: 'column', sm: 'row'}} justifyContent={'space-between'} align={'center'}
           w={'100%'} borderBottom={'2px solid'} borderColor={'blackAlpha.400'}>
      <VStack spacing={'3px'} pb={'4px'} align={{base: 'center', sm: 'start'}} ml={'5px'}
              textAlign={{base: 'center', sm: 'left'}}>
        <Heading lineHeight={'1'} fontSize={'2xl'}>{post.title}</Heading>
        <Heading lineHeight={'1.2'} fontSize={'lg'} color={'whiteAlpha.400'} _light={{color: 'blackAlpha.600'}}
                 fontWeight={'400'}>
          {post.subtitle}
        </Heading>
      </VStack>
      <Box pr={'5px'}>
        <Tooltip bg={'blue.500'} color={'white'} label={dateFormat(post.postedAt, 'dd/MM/yyyy hh:mm')}
                 placement={'bottom'} gutter={'3'}>
          <Heading fontSize={'lg'} color={'whiteAlpha.300'} _light={{color: 'blackAlpha.500'}}
                   fontWeight={'400'}>{dateFormat(post.postedAt, 'dd/MM/yyyy')}</Heading>
        </Tooltip>
      </Box>
    </Stack>
  )
}

const PostBodyFooter = ({post, comment}) => {
  return (
    <HStack w={'100%'}>
      <Tooltip bg={'blue.500'} color={'white'}
               label={dateFormat((comment ? post.postedAt : post.updatedAt), 'dd/MM/yyyy hh:mm')}
               placement={'top'} gutter={'3'}>
        <Text color={'whiteAlpha.300'} _light={{color: 'blackAlpha.500'}} fontWeight={'400'}>
          {comment ? 'Posted in ' + dateFormat(post.postedAt, 'dd/MM/yyyy') :
            'Last edited in ' + dateFormat(post.updatedAt, 'dd/MM/yyyy') + ' by ' + post.lastUpdatedBy?.username}
        </Text>
      </Tooltip>
    </HStack>
  )
}

export default PostBody;