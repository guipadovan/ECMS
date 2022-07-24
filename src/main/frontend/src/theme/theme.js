import {extendTheme} from '@chakra-ui/react';
import {mode, StyleFunctionProps} from '@chakra-ui/theme-tools';

export default extendTheme({
  styles: {
    global: (props) => ({
      body: {
        bgColor: mode('gray.100', 'rgb(34, 42, 55)')(props),
        marginRight: '8px',
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
        variant: null, // null here
      },
    },
  },
});