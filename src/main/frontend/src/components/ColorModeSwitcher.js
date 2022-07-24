import React from 'react';
import {IconButton, useColorMode, useColorModeValue} from '@chakra-ui/react';
import {FaMoon, FaSun} from 'react-icons/fa';

export const ColorModeSwitcher = props => {
  const {toggleColorMode} = useColorMode();
  const text = useColorModeValue('dark', 'light');
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);

  return (
    <IconButton size='md' fontSize='lg' aria-label={`Switch to ${text} mode`}
                variant='ghost' color='current' marginLeft='0' onClick={toggleColorMode} icon={<SwitchIcon/>}
                {...props}
    />
  );
};
