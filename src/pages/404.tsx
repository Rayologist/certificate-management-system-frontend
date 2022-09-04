import { createStyles, Title, Text, Button, Container, Group } from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUser } from 'src/contexts/UserContext';

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: 80,
    paddingBottom: 80,
  },

  label: {
    textAlign: 'center',
    fontWeight: 900,
    fontSize: 220,
    lineHeight: 1,
    marginBottom: theme.spacing.xl * 1.5,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2],

    [theme.fn.smallerThan('sm')]: {
      fontSize: 120,
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    textAlign: 'center',
    fontWeight: 900,
    fontSize: 38,

    [theme.fn.smallerThan('sm')]: {
      fontSize: 32,
    },
  },

  description: {
    maxWidth: 500,
    margin: 'auto',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl * 1.5,
  },
}));

function NotFoundTitle() {
  const { classes } = useStyles();
  const { user } = useUser();
  const router = useRouter();
  const isAdmin = user.data.role === 'admin';

  const href = isAdmin ? '/dashboard/activity' : 'https://cbe.ntu.edu.tw/';

  return (
    <Container className={classes.root}>
      <div className={classes.label}>404</div>
      <Title className={classes.title}>You have found a secret place.</Title>
      <Text color="dimmed" size="lg" align="center" className={classes.description}>
        Unfortunately, this is only a 404 page. You may have mistyped the address, or the page has
        been moved to another URL.
      </Text>
      <Group position="center">
        {isAdmin && (
          <Button variant="subtle" size="md" onClick={router.back}>
            Go Back
          </Button>
        )}
        <Link href={href} passHref>
          <Button variant="subtle" size="md" component="a">
            Take me back to home page
          </Button>
        </Link>
      </Group>
    </Container>
  );
}

export default NotFoundTitle;
