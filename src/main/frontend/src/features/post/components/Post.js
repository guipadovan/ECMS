import PostAuthor from './PostAuthor';
import PostBody from './PostBody';
import {Stack} from '@chakra-ui/react';

export const Post = ({post, comment, ...rest}) => {
  return (
    <Stack direction={{base: 'column', sm: 'row'}} bg={'blackAlpha.400'} _light={{bg: 'gray.100'}}
           rounded={'lg'} spacing={0} {...rest}>
      <PostAuthor author={post.author}/>
      <PostBody post={post} comment={comment}/>
    </Stack>
  )
}