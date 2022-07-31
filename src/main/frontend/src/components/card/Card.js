import {Box, Stack, useColorModeValue} from "@chakra-ui/react";
import CardHeader from "./CardHeader";

const Card = ({label, handleBack, children, header, ...rest}) => {
  return (
    <Stack spacing={5} mx={'auto'} px={8} py={4} {...rest}>
      {header ? (<CardHeader label={label} handleBackClick={handleBack}/>) : null}
      <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.800')} boxShadow={'lg'} p={8}>
        {children}
      </Box>
    </Stack>
  );
}

export default Card;