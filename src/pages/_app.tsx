import Head from 'next/head';
import { AppPropsWithLayout } from 'types';
import { GetServerSidePropsContext } from 'next';
import { useState } from 'react';
import { getCookie } from 'cookies-next';
import { MantineProvider, ColorScheme, ColorSchemeProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import Layout from '@components/Layout';
import UserProvider from 'src/contexts/UserContext';
import withAuth from '@components/Admin/Auth';
import { useRouter } from 'next/router';

function App(props: AppPropsWithLayout & { colorScheme: ColorScheme }) {
  const { Component, pageProps } = props;
  const router = useRouter();

  const [colorScheme, setColorScheme] = useState<ColorScheme>(props.colorScheme);
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  const isAuth = Component?.auth;
  const VerifiedComponent = isAuth ? withAuth(Component) : Component;

  return (
    <>
      <Head>
        <title>NTU CBE - Certificate Management System</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link
          rel="shortcut icon"
          href={`${router.basePath}/favicon.ico`}
          type="image/png"
          sizes="32x32"
        />
        <link
          rel="shortcut icon"
          href={`${router.basePath}/favicon.svg`}
          type="image/svg+xml"
          sizes="any"
        />
      </Head>
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
          <Notifications />
          <UserProvider>
            <Layout isAuth={isAuth}>
              <VerifiedComponent {...pageProps} />
            </Layout>
          </UserProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}

App.getInitialProps = ({ ctx }: { ctx: GetServerSidePropsContext }) => ({
  colorScheme: getCookie('mantine-color-scheme', ctx) || 'light',
});

export default App;
