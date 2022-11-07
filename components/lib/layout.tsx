import { ReactNode } from 'react';
import { Container } from '@mui/material';

import AppBar from './app-bar';

const Layout = ({ children }: { children: ReactNode }) => (
  <>
    <AppBar />
    <Container fixed>{children}</Container>
  </>
);

export default Layout;
