import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  IconButton,
  useDisclosure
} from '@chakra-ui/react';
import {useRef} from 'react';
import {FaTrash} from 'react-icons/all';

export const PostDeleteButton = ({action}) => {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const cancelRef = useRef();

  return (
    <>
      <IconButton size='sm' color={'white'} bg={'red.500'} colorScheme={'red'} _hover={{bg: 'red.600'}}
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
              <Button colorScheme='red' onClick={action} ml={2} bg={'red.500'} _hover={{bg: 'red.600'}} color={'white'}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}