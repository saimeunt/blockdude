import { useState, MouseEvent as ReactMouseEvent, useEffect } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useRouter } from 'next/router';

import { NextLinkComposed } from './link';
import { DudeIcon } from '../lib/icons';

const pages = [
  { href: '/levels', title: 'Play' },
  { href: '/mint', title: 'Mint' },
  // { href: '/about', title: 'About' },
];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const CustomAppBar = () => {
  const router = useRouter();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  return (
    <AppBar position="sticky" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <DudeIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={NextLinkComposed}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            BlockDude
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={(event: ReactMouseEvent<HTMLElement>) => setAnchorElNav(event.currentTarget)}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={() => setAnchorElNav(null)}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map(({ href, title }) => (
                <MenuItem
                  key={title}
                  component={NextLinkComposed}
                  to={href}
                  onClick={() => setAnchorElNav(null)}
                >
                  <Typography textAlign="center">{title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <DudeIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component={NextLinkComposed}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            BlockDude
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map(({ href, title }) => (
              <Button
                key={title}
                component={NextLinkComposed}
                to={href}
                onClick={() => setAnchorElNav(null)}
                sx={{ my: 2, color: 'white', display: 'block', textAlign: 'center' }}
                disabled={router.pathname === href}
                variant={router.pathname === href ? 'contained' : 'text'}
              >
                {title}
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton
                onClick={(event: ReactMouseEvent<HTMLElement>) =>
                  setAnchorElUser(event.currentTarget)
                }
                sx={{ p: 0 }}
              >
                <Avatar alt="saimeunt" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={() => setAnchorElUser(null)}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={() => setAnchorElUser(null)}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export const useAppBarHeight = () => {
  const [appBarHeight, setAppBarHeight] = useState(0);
  useEffect(() => {
    const resizeObserver = new ResizeObserver(([{ target: appBar }]) => {
      appBar && setAppBarHeight(appBar.clientHeight);
    });
    const appBar = document.querySelector('header.MuiAppBar-root') as Element;
    resizeObserver.observe(appBar);
  }, []);
  return appBarHeight;
};

export default CustomAppBar;
