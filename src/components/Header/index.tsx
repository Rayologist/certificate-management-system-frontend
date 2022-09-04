import { createStyles, Header, Group, ActionIcon, Container, Box } from '@mantine/core';
import { IconBrandYoutube, IconBrandInstagram, IconBrandFacebook } from '@tabler/icons';
import { CBELogo } from '@components/Logo';
import ColorSchemeToggle from '@components/ColorSchemeToggle';

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

  const href = {
    facebook: 'https://www.facebook.com/NTUCBE',
    youtube: 'https://www.youtube.com/channel/UCqGbL2pwlrZI_dNBmEv6CRg',
    instagram: 'https://www.instagram.com/ntucbe',
  };

  return (
    <Header height={56} mb={30}>
      <Container className={classes.inner}>
        <Box
          sx={{
            display: 'flex',
          }}
          component="a"
          href="https://cbe.ntu.edu.tw/"
          rel="noreferrer noopener"
        >
          <CBELogo size={40} />
        </Box>

        <Group spacing={0} className={classes.social} position="right" noWrap>
          <ActionIcon
            size="lg"
            component="a"
            href={href.facebook}
            target="_blank"
            rel="noreferrer noopener"
          >
            <IconBrandFacebook size={18} stroke={1.5} />
          </ActionIcon>
          <ActionIcon
            size="lg"
            component="a"
            href={href.youtube}
            target="_blank"
            rel="noreferrer noopener"
          >
            <IconBrandYoutube size={18} stroke={1.5} />
          </ActionIcon>
          <ActionIcon
            size="lg"
            component="a"
            href={href.instagram}
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
