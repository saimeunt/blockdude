import { ReactNode } from 'react';
import { Container } from '@mui/material';

import AppBar from '../lib/app-bar';
import ContextProvider from './context/provider';

const MintLayout = ({ children }: { children: ReactNode }) => (
  <ContextProvider>
    <AppBar />
    <Container disableGutters maxWidth="xl" sx={{ height: '100%' }}>
      {children}
    </Container>
  </ContextProvider>
);

export default MintLayout;
