import {
  Badge,
  Box,
  Button,
  Divider,
  FormControl,
  Heading,
  HStack,
  Image,
  SlideFade,
  Spinner,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import {api} from '../api/axios';
import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router';
import {dateFormat} from "../api/date";
import PostText from "../components/PostText";
import useAuth from "../hooks/useAuth";
import {Formik} from "formik";
import RichTextArea, {serialize} from "../components/input/RichTextArea";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

function PostAuthorItem(props: { title: any, value: any }) {
  return <HStack justifyContent={"space-between"} align={"left"} w={"100%"}>
    <Text fontWeight={"semibold"}>{props.title}</Text>
    <Text>{props.value}</Text>
  </HStack>;
}

function PostAuthor(props: { post: any }) {
  return <Box rounded={"lg"} bg={"blackAlpha.400"} _light={{bg: "gray.200"}} w={{base: "100%", sm: "240px"}} p={3}>
    <VStack spacing={3} align={"center"}>
      <Image w={"64px"} h={"64px"} border={"3px solid"} borderColor={"blackAlpha.400"} mb={0}
             borderRadius={"8px"} src={"https://mc-heads.net/avatar/" + props.post.author.username + "/100"}/>
      <Box mt={0} align={'center'}>
        <Heading size={"md"}>{props.post.author.username}</Heading>
        <Badge variant={'solid'} colorScheme={'red'}>ADMIN</Badge>
      </Box>
      <Divider/>
      <Box border={"1px solid"} borderColor={"blackAlpha.400"} p={2} rounded={'md'} bg={'gray.900'}
           _light={{bg: 'gray.100'}}>
        <VStack fontSize={'14'} spacing={1} color={'whiteAlpha.600'} _light={{color: 'blackAlpha.600'}}>
          <PostAuthorItem title={'Joined in:'} value={dateFormat(props.post.author.createdAt, "dd/MM/yyyy")}/>
          <PostAuthorItem title={'Discord:'} value={'guiip#9151'}/>
        </VStack>
      </Box>
    </VStack>
  </Box>;
}

function PostBody(props: { post: any, title: boolean }) {
  return <VStack p={3} w={"100%"}>
    {props.title ? (
      <Stack direction={{base: "column", sm: "row"}} justifyContent={"space-between"} align={"center"}
             w={"100%"} borderBottom={"2px solid"} borderColor={"blackAlpha.400"}>
        <VStack spacing={"3px"} pb={"4px"} align={{base: "center", sm: "start"}} ml={"5px"}
                textAlign={{base: 'center', sm: 'left'}}>
          <Heading lineHeight={"1"} fontSize={"2xl"}>{props.post.title}</Heading>
          <Heading lineHeight={"1.2"} fontSize={"lg"} color={"whiteAlpha.400"} _light={{color: "blackAlpha.600"}}
                   fontWeight={"400"}>
            {props.post.subtitle}
          </Heading>
        </VStack>
        <Box pr={"5px"}>
          <Tooltip bg={"blue.500"} color={"white"} label={dateFormat(props.post.postedAt, "dd/MM/yyyy hh:mm")}
                   placement={"bottom"} gutter={"3"}>
            <Heading fontSize={"lg"} color={"whiteAlpha.300"} _light={{color: "blackAlpha.500"}}
                     fontWeight={"400"}>{dateFormat(props.post.postedAt, "dd/MM/yyyy")}</Heading>
          </Tooltip>
        </Box>
      </Stack>
    ) : null}
    <VStack justifyContent={'space-between'} w={"100%"} h={'100%'}>
      <Box w={"100%"}>
        <PostText text={props.post.text} disableMaxHeight={true}></PostText>
      </Box>
      {props.title ? (
        <HStack w={"100%"}>
          <Tooltip bg={"blue.500"} color={"white"} label={dateFormat(props.post.updatedAt, "dd/MM/yyyy hh:mm")}
                   placement={"top"} gutter={"3"}>
            <Text color={"whiteAlpha.300"} _light={{color: "blackAlpha.500"}} fontWeight={"400"}>
              Last edited in {dateFormat(props.post.updatedAt, "dd/MM/yyyy")} by {props.post.lastUpdatedBy.username}
            </Text>
          </Tooltip>
        </HStack>
      ) : (
        <HStack w={"100%"}>
          <Tooltip bg={"blue.500"} color={"white"} label={dateFormat(props.post.postedAt, "dd/MM/yyyy hh:mm")}
                   placement={"top"} gutter={"3"}>
            <Text color={"whiteAlpha.300"} _light={{color: "blackAlpha.500"}} fontWeight={"400"}>
              Posted in {dateFormat(props.post.postedAt, "dd/MM/yyyy")}
            </Text>
          </Tooltip>
        </HStack>
      )}
    </VStack>
  </VStack>;
}

export default function Post() {
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState();
  const [comments, setComments] = useState();
  const bgColor = useColorModeValue('white', 'gray.800');
  const navigate = useNavigate();
  const {id} = useParams();
  const {auth} = useAuth();
  const axiosPrivate = useAxiosPrivate();

  const populate = async () => {
    try {
      const postRequest = await api.get('/post/' + id);

      const post = postRequest.data;

      setLoading(false);

      setPost(
        <Stack direction={{base: 'column', sm: 'row'}} bg={'blackAlpha.400'} _light={{bg: 'gray.100'}}
               rounded={'lg'} spacing={0}>
          <PostAuthor post={post}/>
          <PostBody post={post} title={true}/>
        </Stack>
      );

      setComments(post.comments.map(comment => {
        return (
          <Stack key={comment.id} direction={{base: 'column', sm: 'row'}} bg={'blackAlpha.400'}
                 _light={{bg: 'gray.100'}} rounded={'lg'} spacing={0}>
            <PostAuthor post={comment}/>
            <PostBody post={comment} title={false}/>
          </Stack>
        )
      }))
    } catch {
      // create 404
      navigate('/home');
    }
  };

  useEffect(() => {
    populate();
  }, []);

  return (
    <Stack direction={'column'} spacing={6} maxWidth={{base: '80%', md: '720px', xl: '1044px'}}
           justifyContent={'center'}>
      <Box rounded={'lg'} bg={bgColor} boxShadow={'lg'} p={5} w={'100%'}>
        <SlideFade in={true} offsetY="20px">
          {loading ? (
            <Box w={'full'} align={'center'} mt={'10px'}>
              <Spinner thickness="4px" speed="0.65s" emptyColor={bgColor} color="blue.500" size="xl"/>
            </Box>
          ) : (
            <Stack direction={'column'} spacing={4}>
              {post}
            </Stack>
          )}
        </SlideFade>
      </Box>
      {comments?.length !== 0 ? (
        <Box align={'left'}>
          <Heading size={'lg'} fontWeight={'semibold'}>Comments</Heading>
          <Box rounded={'lg'} bg={bgColor} boxShadow={'lg'} p={5} w={'100%'} align={'left'} my={1}>
            <Stack spacing={2}>
              {comments}
            </Stack>
          </Box>
        </Box>
      ) : null}
      {auth?.user ? (
        <Box align={'left'}>
          <Formik
            initialValues={{
              comment: [
                {
                  type: 'paragraph',
                  children: [{text: ''}],
                },
              ]
            }}
            onSubmit={(values, actions) => {
              axiosPrivate.post('/post/' + id + '/comment', {
                comment: JSON.stringify(values.comment),
              }).then(() => {
                actions.resetForm();
                actions.setSubmitting(false);
                populate();
              }).catch(() => {
                actions.setSubmitting(false);
              });
            }}>
            {({handleSubmit, values, isSubmitting}) => (
              <form onSubmit={handleSubmit}>
                <Heading size={'lg'} fontWeight={'semibold'}>Add Comment</Heading>
                <Box rounded={'lg'} bg={bgColor} boxShadow={'lg'} p={5} w={'100%'} align={'left'} my={1}>
                  <FormControl isRequired>
                    <RichTextArea id='comment' name='comment'></RichTextArea>
                  </FormControl>
                </Box>
                <HStack justifyContent={'right'} w={'full'} mt={2}>
                  <Button loadingText='Posting' size='md' bg={'blue.400'} color={'white'} type='submit'
                          colorScheme='blue' isLoading={isSubmitting}
                          isDisabled={serialize(values.comment).trim().length === 0}
                          _hover={{bg: 'blue.500'}}>
                    Comment
                  </Button>
                </HStack>
              </form>
            )}
          </Formik>
        </Box>
      ) : null}
    </Stack>
  );
}
