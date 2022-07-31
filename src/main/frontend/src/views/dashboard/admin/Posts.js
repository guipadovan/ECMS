import Card from "../../../components/card/Card";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  ButtonGroup,
  HStack,
  IconButton,
  SlideFade,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  useColorModeValue,
  useDisclosure
} from "@chakra-ui/react";
import {useEffect, useRef, useState} from "react";
import {FaLock, FaLockOpen, FaPencilAlt, FaTrash} from "react-icons/all";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import {dateFormat} from "../../../api/date";
import {useNavigate} from "react-router";
import {useSearchParams} from "react-router-dom";
import PostForm from "../../../components/forms/PostForm";

export default function Posts() {

  const axiosPrivate = useAxiosPrivate();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState();
  const [posts, setPosts] = useState();
  const [initialValues, setInitialValues] = useState({
    title: '',
    subtitle: '',
    text: [
      {
        type: 'paragraph',
        children: [{text: ''}],
      },
    ],
    locked: false,
  });
  const [post, setPost] = useState();

  const populate = async (search, page) => {
    await axiosPrivate.get('/post/posts', {
      params: {
        title: search,
        page: page,
        size: 10,
      }
    }).then(res => {
        setLoading(false);

        const postTableContent = res.data.content.map((post, i) => {
          const border = res.data.content.length === i + 1 ? '0' : 'solid 1px';

          return (
            <Tr key={post.id}>
              <Td p={'10px'} borderBottom={border}>{post.id}</Td>
              <Td maxWidth={'210px'} overflow={'hidden'} textOverflow={'ellipsis'} p={'10px'} borderBottom={border}>
                <Tooltip bg={'blue.500'} color={'white'} label={post.title} placement={'top'} hasArrow>
                  {post.title}
                </Tooltip>
              </Td>
              <Td p={'10px'} borderBottom={border}>{post.author.username}</Td>
              <Td p={'10px'} borderBottom={border}>
                <Tooltip bg={'blue.500'} color={'white'} placement={'top'}
                         label={dateFormat(post.postedAt, 'dd/MM/yyyy hh:mm')} hasArrow>
                  {dateFormat(post.postedAt, 'dd/MM/yyyy')}
                </Tooltip>
              </Td>
              <Td p={'10px'} borderBottom={border}>
                <Tooltip bg={'blue.500'} color={'white'} placement={'top'}
                         label={'Updated by ' + post.lastUpdatedBy.username + ' at ' +
                           dateFormat(post.updatedAt, 'dd/MM/yyyy hh:mm')} hasArrow>
                  {dateFormat(post.updatedAt, 'dd/MM/yyyy')}
                </Tooltip>
              </Td>
              <Td p={'10px'} borderBottom={border}>{post.comments.length}</Td>
              <Td p={'10px'} borderBottom={border}>
                <HStack spacing={'4px'}>
                  <IconButton size='sm' colorScheme={'gray'}
                              onClick={() => {
                                axiosPrivate.put('/post/' + post.id + '/switch-lock', {
                                  postId: post.id,
                                }).then(() => {
                                  populate(search, res.data.number);
                                })
                              }} icon={post.locked ? <FaLock/> : <FaLockOpen/>} aria-label={'lock/unlock post'}/>
                  <IconButton size='sm' color={'white'} bg={"blue.400"} colorScheme={'blue'}
                              _hover={{bg: "blue.500"}}
                              onClick={() => {
                                setPost(post.id);
                              }}
                              icon={<FaPencilAlt/>} aria-label={'edit post'}/>
                  <Confirmation populate={populate} page={page} search={search} id={post.id}/>
                </HStack>
              </Td>
            </Tr>
          )
        });
        setPosts(postTableContent);
        console.log(postTableContent);

        const first = res.data.first, last = res.data.last, current = res.data.number,
          totalPages = res.data.totalPages;

        const paginator = (
          <ButtonGroup size='sm' isAttached variant='outline'>
            {first ? (
              <Button isDisabled={true}>previous</Button>
            ) : (
              <Button onClick={() => populate('', current - 1)}>previous</Button>
            )}
            <PageButton currentPage={current} lastPage={totalPages} handlePageClick={populate}></PageButton>
            {last ? (
              <Button isDisabled={true}>next</Button>
            ) : (
              <Button onClick={() => populate('', current + 1)}>next</Button>
            )}
          </ButtonGroup>
        );

        setPagination(paginator);
      }
    );
  }

  useEffect(() => {
    if (!post) {
      populate();
    } else {
      setLoading(true);

      axiosPrivate.get('/post/' + post)
        .then(res => {
          setLoading(false);
          setInitialValues({
            title: res.data.title,
            subtitle: res.data.subtitle,
            text: JSON.parse(res.data.text),
            locked: res.data.locked,
          })
        }).catch(() => {
        populate();
        setPost(null);
      })
    }
  }, [post]);

  const bgColor = useColorModeValue('gray.200', 'blackAlpha.400');
  const activeBg = useColorModeValue('gray.100', 'blackAlpha.400');
  const navbarBg = useColorModeValue('white', 'gray.800');

  return (
    <Card label={post ? 'Update Post' : 'Posts'} handleBack={post ? () => setPost(null) : () => navigate(-1)}>
      {loading ? (
        <SlideFade in={true} offsetY='20px'>
          <Box w={'full'} align={'center'} mt={'10px'}>
            <Spinner thickness='4px' speed='0.65s' emptyColor={bgColor} color='blue.500' size='xl'/>
          </Box>
        </SlideFade>
      ) : (
        !post ? (
          <SlideFade in={true} offsetY='20px'>
            <TableContainer sx={
              {
                '::-webkit-scrollbar': {
                  height: '10px',
                },
                '::-webkit-scrollbar-track': {
                  mx: '1px',
                },
                '::-webkit-scrollbar-thumb': {
                  bg: activeBg,
                  borderRadius: '5vw',
                  border: '2px solid',
                  borderColor: navbarBg
                }
              }
            }>
              <Table variant='simple'>
                <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>Title</Th>
                    <Th>Author</Th>
                    <Th>Posted At</Th>
                    <Th>Updated At</Th>
                    <Th>Comments</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody _last={{borderBottom: '0'}}>
                  {posts}
                </Tbody>
              </Table>
            </TableContainer>
            <Box w={'full'} align={'center'} mt={'30px'}>
              {pagination}
            </Box>
          </SlideFade>
        ) : (
          <SlideFade in={true} offsetY='20px'>
            <PostForm defaultValues={initialValues} submit={(values, actions) => {
              axiosPrivate.put('/post/' + post + '/update', {
                title: values.title,
                subtitle: values.subtitle,
                text: JSON.stringify(values.text),
                locked: values.locked,
              }).then(() => {
                actions.setSubmitting(false);
                setPost(null);
              }).catch(() => {
                actions.setSubmitting(false);
                setPost(null);
              });
            }}/>
          </SlideFade>
        )
      )}
    </Card>
  );
}

const Confirmation = ({populate, search, page, id}) => {
  const {isOpen, onOpen, onClose} = useDisclosure()
  const axiosPrivate = useAxiosPrivate();
  const cancelRef = useRef()

  return (
    <>
      <IconButton size='sm' color={'white'} bg={"red.500"} colorScheme={'red'} _hover={{bg: "red.600"}}
                  onClick={onOpen} icon={<FaTrash/>} aria-label={'delete post'}/>

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}
                   motionPreset='slideInBottom' isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent bg={'gray.900'} _light={{bg: 'white'}}>
            <AlertDialogCloseButton/>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Delete Post
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme='red' onClick={() => {
                axiosPrivate.delete('/post/' + id + '/delete', {
                  postId: id,
                }).then(() => {
                  populate(search, page);
                })
              }} ml={2} bg={'red.500'} _hover={{bg: "red.600"}} color={'white'}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

const PageButton = ({currentPage, lastPage, handlePageClick}) => {
  const render = [];

  let startIdx;
  let endIdx;
  if (currentPage - 1 >= 0) {
    startIdx = currentPage - 1;
    endIdx = startIdx + 5;
  } else {
    startIdx = 0;
    endIdx = 5;
  }
  if (currentPage + 3 >= lastPage) {
    startIdx = lastPage - 5;
    endIdx = lastPage;
  }

  if (lastPage < 5) {
    startIdx = 0;
    endIdx = lastPage;
  }

  for (let idx = startIdx; idx < endIdx; idx++) {
    const offset = idx + 1;
    render.push(
      <Button key={`page-${offset}`} onClick={() => handlePageClick('', idx)} value={idx}
              isDisabled={idx === currentPage}>
        {offset}
      </Button>
    );
  }

  return render;
};