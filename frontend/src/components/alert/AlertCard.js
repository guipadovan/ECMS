import {Alert, AlertDescription, AlertIcon, AlertTitle, Box, CloseButton} from '@chakra-ui/react';
import {useState} from 'react';

export default function AlertCard({type, title, description, icon, closable, ...rest}) {

  const [open, setOpen] = useState(true);

  return (
    open ? (
      <Alert status={type} textAlign={'left'} rounded={'md'} {...rest}>
        {icon ? (<AlertIcon/>) : null}
        <Box>
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{description}</AlertDescription>
        </Box>
        {closable ? (
          <CloseButton alignSelf='flex-start' position='absolute' right={1} top={1} onClick={() => {
            setOpen(false);
          }}/>
        ) : null}
      </Alert>
    ) : null
  );
}