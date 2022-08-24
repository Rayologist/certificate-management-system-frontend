import { Paper, Title, Text, Container } from "@mantine/core";
import LoginForm from "@containers/Admin/Login";
import { useUser } from "src/contexts/UserContext";
import Redirect from "@components/Redirect";

export function Login() {
  const { user } = useUser(); 

  if (user.data.role === "admin") return <Redirect url="/dashboard/activity" />;

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
