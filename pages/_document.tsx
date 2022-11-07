/* import { Children } from 'react';
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import { AppRegistry } from 'react-native';
// import config from '../app.json';
const config = {
  name: 'blockdude',
  displayName: 'BlockDude',
};
// Force Next-generated DOM elements to fill their parent's height
const normalizeNextElements = `
  #__next {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  [data-scrollbar-visibility="hidden"]::-webkit-scrollbar {
    display: none;
  }
  [data-scrollbar-visibility="hidden"] {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

class CustomDocument extends Document {
  static async getInitialProps({ renderPage }: DocumentContext) {
    AppRegistry.registerComponent(config.name, () => Main);
    const { getStyleElement } = AppRegistry.getApplication(config.name);
    const page = await renderPage();
    const styles = [
      <style key="next-elements" dangerouslySetInnerHTML={{ __html: normalizeNextElements }} />,
      getStyleElement(),
    ];
    return { ...page, styles: Children.toArray(styles) };
  }
  render() {
    return (
      <Html style={{ height: '100%' }}>
        <Head />
        <body style={{ height: '100%', overflow: 'hidden' }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
} */
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from 'next/document';
import createEmotionServer from '@emotion/server/create-instance';

import theme from '../lib/theme';
import createEmotionCache from '../lib/createEmotionCache';

// Force Next-generated DOM elements to fill their parent's height
const normalizeNextElements = `
  #__next {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  #scroll-view::-webkit-scrollbar {
    display: none;
  }
  #scroll-view {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

type CustomDocumentInitialProps = DocumentInitialProps & { emotionStyleTags: JSX.Element[] };

const CustomDocument = ({ emotionStyleTags }: CustomDocumentInitialProps) => (
  <Html lang="en" style={{ height: '100%' }}>
    <Head>
      {/* PWA primary color */}
      <meta name="theme-color" content={theme.palette.primary.main} />
      <link rel="shortcut icon" href="/favicon.ico" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
      />
      <meta name="emotion-insertion-point" content="" />
      {emotionStyleTags}
      <style key="next-elements" dangerouslySetInnerHTML={{ __html: normalizeNextElements }} />
    </Head>
    <body style={{ height: '100%' }}>
      <Main />
      <NextScript />
    </body>
  </Html>
);

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
CustomDocument.getInitialProps = async (ctx: DocumentContext) => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render
  const originalRenderPage = ctx.renderPage;
  // You can consider sharing the same Emotion cache between all the SSR requests to speed up performance.
  // However, be aware that it can have global side effects.
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);
  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App: any) =>
        function EnhanceApp(props) {
          return <App emotionCache={cache} {...props} />;
        },
    });
  const initialProps = await Document.getInitialProps(ctx);
  // This is important. It prevents Emotion to render invalid HTML.
  // See https://github.com/mui/material-ui/issues/26561#issuecomment-855286153
  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));
  /* emotionStyleTags.push(
    <style
      data-emotion="abc"
      key="abc"
      dangerouslySetInnerHTML={{ __html: normalizeNextElements }}
    />,
  ); */
  return {
    ...initialProps,
    emotionStyleTags,
  };
};

export default CustomDocument;
