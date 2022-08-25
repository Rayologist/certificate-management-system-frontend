import { Title, Group, Paper } from "@mantine/core";
import Loader from "@components/Loader";
import { useParticipantStats } from "@services/participant";
import { ParticipantStatsTable } from "@containers/Admin/Participant/Table";

const Participant = () => {
  const { stats, isLoading } = useParticipantStats();

  if (isLoading) return <Loader />;

  return (
    <>
      <Group position="apart" mb={50}>
        <Title>管理參與者</Title>
      </Group>
      <Paper sx={{ padding: "1rem" }}>
        <ParticipantStatsTable data={stats.data} />
      </Paper>
    </>
  );
};

Participant.auth = true;

export default Participant;
