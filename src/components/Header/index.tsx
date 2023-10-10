import { createStyles, Header, Group, ActionIcon, Container, Box } from '@mantine/core';
import { IconBrandYoutube, IconBrandInstagram, IconBrandFacebook } from '@tabler/icons-react';
import { Logo } from '@components/Logo';
import ColorSchemeToggle from '@components/ColorSchemeToggle';
import { Href } from '@config';

const useStyles = createStyles((theme) => ({
  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 56,

    [theme.fn.smallerThan('sm')]: {
      justifyContent: 'flex-start',
    },
  },

  social: {
    width: 260,

    [theme.fn.smallerThan('sm')]: {
      width: 'auto',
      marginLeft: 'auto',
    },
  },
}));

export function UserHeader() {
  const { classes } = useStyles();

  return (
    <Header height={56} mb={30}>
      <Container className={classes.inner}>
        <Box
          sx={{
            display: 'flex',
          }}
          component="a"
          href={Href.home}
          rel="noreferrer noopener"
        >
          <Logo size={40} />
        </Box>

        <Group spacing={0} className={classes.social} position="right" noWrap>
          <ActionIcon
            size="lg"
            component="a"
            href={Href.facebook}
            target="_blank"
            rel="noreferrer noopener"
          >
            <IconBrandFacebook size={18} stroke={1.5} />
          </ActionIcon>
          <ActionIcon
            size="lg"
            component="a"
            href={Href.youtube}
            target="_blank"
            rel="noreferrer noopener"
          >
            <IconBrandYoutube size={18} stroke={1.5} />
          </ActionIcon>
          <ActionIcon
            size="lg"
            component="a"
            href={Href.instagram}
            target="_blank"
            rel="noreferrer noopener"
          >
            <IconBrandInstagram size={18} stroke={1.5} />
          </ActionIcon>
          <ColorSchemeToggle />
        </Group>
      </Container>
    </Header>
  );
}
