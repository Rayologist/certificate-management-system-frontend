import { useEffect, useState } from 'react';
import { NextLink } from '@mantine/next';
import { createStyles, Navbar as MantineNavbar } from '@mantine/core';
import { IconFileCertificate, IconNewSection, IconLogout, IconUsers } from '@tabler/icons';
import { Route } from '@config';
import { useRouter } from 'next/router';
import urlJoin from 'url-join';

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef('icon');
  return {
    header: {
      paddingBottom: theme.spacing.md,
      marginBottom: theme.spacing.md * 1.5,
      borderBottom: `1px solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
      }`,
    },

    footer: {
      paddingTop: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderTop: `1px solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
      }`,
    },

    link: {
      ...theme.fn.focusStyles(),
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      fontSize: theme.fontSizes.sm,
      color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      '&:hover': {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,

        [`& .${icon}`]: {
          color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        },
      },
    },

    linkIcon: {
      ref: icon,
      color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
      marginRight: theme.spacing.sm,
    },

    linkActive: {
      '&, &:hover': {
        backgroundColor: theme.fn.variant({
          variant: 'light',
          color: theme.primaryColor,
        }).background,
        color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
        [`& .${icon}`]: {
          color: theme.fn.variant({
            variant: 'light',
            color: theme.primaryColor,
          }).color,
        },
      },
    },
  };
});

const data = [
  { link: Route.Activity, label: '建立活動', icon: IconNewSection },
  {
    link: Route.Certificate,
    label: '製作證書',
    icon: IconFileCertificate,
  },
  { link: Route.Participant, label: '管理參與者', icon: IconUsers },
];

export default function Navbar({ opened }: { opened: boolean }) {
  const { classes, cx } = useStyles();
  const [active, setActive] = useState('');
  const router = useRouter();
  const currentLink = urlJoin(router.asPath);

  useEffect(() => {
    const linkArray = data.map((link) => link.link);
    if (linkArray.includes(currentLink)) {
      setActive(currentLink);
    }
  }, [currentLink]);

  const links = data.map((item) => (
    <NextLink
      href={item.link}
      key={item.label}
      className={cx(classes.link, {
        [classes.linkActive]: item.link === active,
      })}
      onClick={() => setActive(item.link)}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </NextLink>
  ));

  return (
    <MantineNavbar
      p="md"
      hiddenBreakpoint="sm"
      hidden={!opened}
      width={{ sm: 200, md: 230, lg: 280 }}
    >
      <MantineNavbar.Section grow>{links}</MantineNavbar.Section>

      <MantineNavbar.Section className={classes.footer}>
        <NextLink href={Route.Logout} className={classes.link}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>登出</span>
        </NextLink>
      </MantineNavbar.Section>
    </MantineNavbar>
  );
}
