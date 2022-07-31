import {extendTheme} from '@chakra-ui/react';
import {mode} from '@chakra-ui/theme-tools';

export default extendTheme({
  styles: {
    global: (props) => ({
      body: {
        overflowX: 'hidden',
        overflowY: 'overlay',
        bgColor: mode('gray.100', 'rgb(34, 42, 55)')(props),
        marginRight: '0px',
        '::-webkit-scrollbar': {
          width: '8px',
        },
        '::-webkit-scrollbar-track': {
          bg: mode('gray.100', 'rgb(34, 42, 55)')(props),
        },
        '::-webkit-scrollbar-thumb': {
          bg: mode('gray.400', 'gray.900')(props),
          borderRadius: '5vw',
          border: '2px solid',
          borderColor: mode('gray.100', 'rgb(34, 42, 55)')(props),
        }
      },

    }),
  },
  components: {
    Input: {
      baseStyle: (props) => ({
        field: {
          bg: props.colorMode === 'light' ? 'gray.100' : 'blackAlpha.400',
        },
      }),
      sizes: {},
      variants: {},
      defaultProps: {
        variant: null,
      },
    },
  },
});