import { AppProps } from 'next/app';
import Head from 'next/head';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { CacheProvider, EmotionCache } from '@emotion/react';

import theme from '../lib/theme';
import createEmotionCache from '../lib/createEmotionCache';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

type CustomAppProps = AppProps & { emotionCache?: EmotionCache };

const CustomApp = ({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: CustomAppProps) => (
  <CacheProvider value={emotionCache}>
    <Head>
      <title>BlockDude</title>
      <meta name="description" content="BlockDude" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {/* Favicon */}
      <link rel="icon" href="/img/favicon.svg" sizes="128x128" type="image/svg" />
      {/* Facebook meta */}
      <meta property="og:url" content="https://blockdude.com" />
      <meta property="og:title" content="BlockDude" />
      <meta property="og:description" content="BlockDude" />
      <meta property="og:image" content="" />
      {/* Twitter meta */}
      <meta name="twitter:title" content="BlockDude" />
      <meta name="twitter:description" content="BlockDude" />
      <meta name="twitter:image" content="" />
    </Head>
    <ThemeProvider theme={theme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  </CacheProvider>
);

export default CustomApp;
