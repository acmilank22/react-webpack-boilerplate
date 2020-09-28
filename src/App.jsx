import React from 'react';
import { hot } from 'react-hot-loader/root';
import { HashRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { THEME } from '@/constants';
import Routes from '@/pages';

import GlobalStyle from '@/styles/GlobalStyle';
import themes from '@/styles/themes';

function App() {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={themes[THEME]}>
        <HashRouter>
          <Routes />
        </HashRouter>
      </ThemeProvider>
    </>
  );
}

export default process.env.NODE_ENV === 'development' ? hot(App) : App;
