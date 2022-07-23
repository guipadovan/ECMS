import { Button, Flex, Icon, Text } from '@chakra-ui/react';
import IconBox from '../icons/IconBox';

const SideNavItem = (props) => {
  const { icon, active, bg, color, children, ...rest } = props;
  return (
    active ? (
      <Button boxSize='initial' justifyContent='flex-start' alignItems='center' bg={bg}
              ps='10px' py='12px' borderRadius='15px' _hover={{ bg: { bg } }} w='100%'
              _active={{ bg: { bg } }} _focus={{ boxShadow: 'none' }} transform={'translate(5px)'}
              transition='.15s ease' {...rest}>
        <Flex>
          <IconBox bg='blue.500' color='white' h='30px' w='30px' me='6px'>
            <Icon as={icon}></Icon>
          </IconBox>
          <Text color={color} my='auto' fontSize='sm'>{children}</Text>
        </Flex>
      </Button>
    ) : (
      <Button boxSize='initial' justifyContent='flex-start' alignItems='center' bg='transparent'
              py='12px' ps='10px' borderRadius='15px' _hover={{ bg: 'inherit' }} w='100%'
              _active={{ bg: 'inherit', boxShadow: 'none' }} _focus={{ boxShadow: 'none' }} {...rest}>
        <Flex>
          <IconBox bg='inherit' color='blue.500' h='30px' w='30px' me='6px'>
            <Icon as={icon}></Icon>
          </IconBox>
          <Text color='gray.500' my='auto' fontSize='sm'>{children}</Text>
        </Flex>
      </Button>
    )
  );
};

export default SideNavItem;