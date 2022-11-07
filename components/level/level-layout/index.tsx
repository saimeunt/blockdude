import { ReactNode } from 'react';
import { Container } from '@mui/material';

import ContextProvider from '../context/provider';
import AppBar from '../../lib/app-bar';
import BottomNavigation from './bottom-navigation';

const LevelLayout = ({ children }: { children: ReactNode }) => (
  <ContextProvider>
    <AppBar />
    <Container disableGutters maxWidth="xl" sx={{ height: '100%' }}>
      {children}
    </Container>
    <BottomNavigation />
  </ContextProvider>
);

export default LevelLayout;
