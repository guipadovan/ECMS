import {Box, Button, Collapse, Flex, Icon, Text, useDisclosure} from "@chakra-ui/react";
import {FaAngleDown, FaAngleUp} from "react-icons/all";
import IconBox from "../icons/IconBox";

const SideNavDropdown = ({active, bg, color, icon, label, children}) => {

  const {isOpen, onOpen, onClose} = useDisclosure();

  return (
    <Box bg={isOpen ? bg : 'inherit'} borderRadius={'8px'} w={'full'}>
      <Button boxSize='initial' justifyContent='space-between' alignItems='center'
              bg={isOpen ? 'transparent' : (active ? bg : 'transparent')} p={'6px'}
              borderRadius='7px' w='100%' _focus={{boxShadow: 'none'}}
              color={isOpen || active ? color : 'gray.500'} borderBottomRadius={isOpen ? '0' : '7px'}
              transition={'.3s ease'} onClick={isOpen ? onClose : onOpen}
              rightIcon={isOpen ? <FaAngleDown color={color}/> : <FaAngleUp/>}>
        <Flex>
          <IconBox bg={isOpen || active ? 'blue.500' : 'inherit'}
                   color={isOpen || active ? 'white' : 'blue.500'} h='30px' w='30px' me='6px'>
            <Icon as={icon}></Icon>
          </IconBox>
          <Text color={'inherit'} my='auto' fontSize='sm'>{label}</Text>
        </Flex>
      </Button>
      <Collapse in={isOpen} animateOpacity>
        <Box overflow={'hidden'} _last={{borderBottomRadius: '7px'}}>
          {children}
        </Box>
      </Collapse>
    </Box>
  )
}

export default SideNavDropdown;