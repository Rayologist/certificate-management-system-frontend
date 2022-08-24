import Head from "next/head";
import { AppPropsWithLayout } from "types";
import { GetServerSidePropsContext } from "next";
import { useState } from "react";
import { getCookie, setCookie } from "cookies-next";
import {
  MantineProvider,
  ColorScheme,
  ColorSchemeProvider,
} from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import Layout from "@components/Layout";
import UserProvider from "src/contexts/UserContext";
import withAuth from "@components/Admin/Auth";

function App(props: AppPropsWithLayout & { colorScheme: ColorScheme }) {
  let { Component, pageProps } = props;

  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    props.colorScheme
  );

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || colorScheme === "dark" ? "light" : "dark";
    setColorScheme(nextColorScheme);
    setCookie("mantine-color-scheme", nextColorScheme, {
      maxAge: 60 * 60 * 24 * 30,
    });
  };

  const isAuth = Component?.auth;
  Component = isAuth ? withAuth(Component) : Component;

  return (
    <>
      <Head>
        <link
          rel="shortcut icon"
          href="/favicon.ico"
          type="image/png"
          sizes="32x32"
        />
        <link
          rel="shortcut icon"
          href="/favicon.svg"
          type="image/svg+xml"
          sizes="any"
        />
      </Head>
      <UserProvider>
        <ColorSchemeProvider
          colorScheme={colorScheme}
          toggleColorScheme={toggleColorScheme}
        >
          <MantineProvider
            theme={{ colorScheme }}
            withGlobalStyles
            withNormalizeCSS
          >
            <NotificationsProvider>
              <Layout isAuth={isAuth}>
                <Component {...pageProps} />
              </Layout>
            </NotificationsProvider>
          </MantineProvider>
        </ColorSchemeProvider>
      </UserProvider>
    </>
  );
}

App.getInitialProps = ({ ctx }: { ctx: GetServerSidePropsContext }) => ({
  colorScheme: getCookie("mantine-color-scheme", ctx) || "light",
});

export default App;
