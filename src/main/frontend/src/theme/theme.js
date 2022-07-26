import {extendTheme} from '@chakra-ui/react';
import {mode, StyleFunctionProps} from '@chakra-ui/theme-tools';

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
          my: '1px',
        },
        '::-webkit-scrollbar-thumb': {
          bg: mode('gray.100', 'gray.900')(props),
          borderRadius: '5vw',
          border: '2px solid',
          borderColor: mode('white', 'rgb(34, 42, 55)')(props),
        }
      },

    }),
  },
  components: {
    Input: {
      baseStyle: (props: StyleFunctionProps) => ({
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