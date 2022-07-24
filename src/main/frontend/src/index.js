import React, {StrictMode} from 'react';
import * as ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';

import App from './App';
import {AuthProvider} from './context/AuthProvider';
import {ChakraProvider} from '@chakra-ui/react';
import theme from './theme/theme';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <StrictMode>
    <AuthProvider>
      <ChakraProvider theme={theme} resetCss={false} w='100%'>
        <BrowserRouter>
          <App/>
        </BrowserRouter>
      </ChakraProvider>
    </AuthProvider>
  </StrictMode>,
);


