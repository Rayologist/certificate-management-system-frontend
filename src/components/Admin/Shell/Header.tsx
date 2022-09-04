import {
  Header as MantineHeader,
  MediaQuery,
  Burger,
  Box,
  useMantineTheme,
  Container,
  createStyles,
} from '@mantine/core';
import { Dispatch, SetStateAction } from 'react';
import Link from 'next/link';
import { CBELogo } from '@components/Logo';
import ColorSchemeToggle from '@components/ColorSchemeToggle';

const useStyles = createStyles(() => ({
  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
  },
}));

const Header = ({
  opened,
  setOpened,
}: {
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
}) => {
  const theme = useMantineTheme();
  const { classes } = useStyles();

  return (
    <MantineHeader height={60}>
      <Container className={classes.inner} fluid>
        <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
          <Burger
            opened={opened}
            onClick={() => setOpened((o) => !o)}
            size="sm"
            color={theme.colors.gray[6]}
            mr="xl"
          />
        </MediaQuery>

        <Link href="/dashboard/activity" passHref>
          <Box
            component="a"
            sx={{
              display: 'flex',
            }}
          >
            <CBELogo size={40} />
          </Box>
        </Link>
        <ColorSchemeToggle />
      </Container>
    </MantineHeader>
  );
};

export default Header;
