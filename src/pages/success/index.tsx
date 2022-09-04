import {
  ThemeIcon,
  RingProgress,
  Center,
  Paper,
  Title,
  Container,
  Text,
  Stack,
} from '@mantine/core';
import { IconCheck } from '@tabler/icons';
import { useRouter } from 'next/router';

const decode = (encoded: string): string | false => {
  try {
    return decodeURIComponent(window.atob(encoded));
  } catch (error) {
    return false;
  }
};

export default function Success() {
  const router = useRouter();
  const { e } = router.query as { e: string };

  if (!e) {
    router.push('/404', { pathname: router.asPath });
    return null;
  }

  const decoded = decode(e);

  if (decoded === false) {
    router.push('/404', { pathname: router.asPath });
    return null;
  }

  const params = new URLSearchParams(decoded);

  return (
    <>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        Certificate of Attendence
      </Title>
      <Container size={420} mt={10} mb={40}>
        <Text color="dimmed" align="center" weight="bold">
          {params.get('p')}
        </Text>
        <Text color="dimmed" align="center">
          {params.get('c')}
        </Text>
        <Paper shadow="lg" p={30} mt={30} radius="md" withBorder>
          <Stack align="center">
            <RingProgress
              sections={[{ value: 100, color: 'teal' }]}
              label={
                <Center>
                  <ThemeIcon color="teal" variant="light" radius="xl" size="xl">
                    <IconCheck size={22} />
                  </ThemeIcon>
                </Center>
              }
            />
            <Title order={2}>發送成功！</Title>
          </Stack>
        </Paper>
      </Container>
    </>
  );
}
