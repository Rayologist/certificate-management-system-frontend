import dynamic from 'next/dynamic';
import { Title, Group, Paper } from '@mantine/core';
import { useParticipantStats } from '@services/participant';
import { useRouter } from 'next/router';

const ParticipantStatsTable = dynamic(() =>
  import('@containers/Admin/Participant/Table').then((module) => module.ParticipantStatsTable)
);
const Loader = dynamic(() => import('@components/Loader'));

const Participant = () => {
  const { stats, isLoading, isError } = useParticipantStats();
  const router = useRouter();

  if (isLoading) return <Loader />;

  if (isError) {
    router.push('/500', { pathname: router.asPath });
    return null;
  }

  return (
    <>
      <Group position="apart" mb={50}>
        <Title>管理參與者</Title>
      </Group>
      <Paper sx={{ padding: '1rem' }}>
        <ParticipantStatsTable data={stats.data} />
      </Paper>
    </>
  );
};

Participant.auth = true;

export default Participant;
