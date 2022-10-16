import dynamic from 'next/dynamic';
import { Paper, Title, Text, Container } from '@mantine/core';
import { useUser } from 'src/contexts/UserContext';
import { Route } from '@config';

const LoginForm = dynamic(() => import('@containers/Admin/Login'));
const Redirect = dynamic(() => import('@components/Redirect'));

export function Login() {
  const { user } = useUser();

  if (user.data.role === 'admin') return <Redirect url={Route.Activity} />;

  return (
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        Welcome back!
      </Title>
      <Text color="dimmed" size="md" align="center">
        Certificate Management System
      </Text>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <LoginForm />
      </Paper>
    </Container>
  );
}

export default Login;
