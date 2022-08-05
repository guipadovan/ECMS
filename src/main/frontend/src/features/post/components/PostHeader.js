import {Box, Heading, Image, Stack, Tooltip, useColorModeValue, VStack} from '@chakra-ui/react';
import {dateFormat} from '../../../services/date';

export const PostHeader = ({author, title, subtitle, postedAt}) => {

  const bgColor = useColorModeValue('gray.200', 'blackAlpha.400');

  return <Box rounded={'lg'} bg={bgColor} w={'100%'} p={3}>
    <Stack direction={{base: 'column', md: 'row'}} spacing={4} align={'center'}>
      <Tooltip bg={'blue.500'} color={'white'} label={author.username} placement={'bottom'} gutter={'3'}>
        <Image w={'52px'} h={'52px'} border={'3px solid'} borderColor={'blackAlpha.400'}
               borderRadius={'8px'} src={'https://mc-heads.net/avatar/' + author.username + '/100'}/>
      </Tooltip>
      <Stack direction={{base: 'column', md: 'row'}} justifyContent={'space-between'} align={'center'}
             w={'100%'}>
        <VStack overflow={'hidden'} textOverflow={'ellipsis'} align={{base: 'center', md: 'start'}} spacing={'3px'}
                textAlign={{base: 'center', md: 'left'}}>
          <Tooltip bg={'blue.500'} color={'white'} label={title} placement={'top'} gutter={'4'}>
            <Heading lineHeight={'0.8'} fontSize={'2xl'}>{title}</Heading>
          </Tooltip>
          <Heading lineHeight={'1.2'} fontSize={'lg'} color={'whiteAlpha.400'} _light={{color: 'blackAlpha.600'}}
                   fontWeight={'400'}>
            {subtitle}
          </Heading>
        </VStack>
        <Tooltip bg={'blue.500'} color={'white'} label={dateFormat(postedAt, 'dd/MM/yyyy hh:mm')}
                 placement={'bottom'} gutter={'3'}>
          <Heading fontSize={'lg'} color={'whiteAlpha.300'} _light={{color: 'blackAlpha.500'}}
                   fontWeight={'400'}>{dateFormat(postedAt,
            'dd/MM/yyyy')}</Heading>
        </Tooltip>
      </Stack>
    </Stack>
  </Box>;
}