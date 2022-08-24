import {
  Title,
  Group,
  Paper,
  Modal,
  Button,
  FileButton,
  Text,
  Stack,
} from "@mantine/core";
import { useMemo, useCallback, useState, memo } from "react";
import Loader from "@components/Loader";
import { ParticipantTable } from "@containers/Admin/Participant/Table";
import {
  IconArrowNarrowLeft,
  IconFileUpload,
  IconUserPlus,
} from "@tabler/icons";
import { useRouter } from "next/router";
import onCSVSubmit from "@containers/Admin/Participant/Create/onCSVSubmit";
import CreateParticipant from "@containers/Admin/Participant/Create";
import { useParticipantByAuid } from "@services/participant";

const Management = () => {
  const router = useRouter();

  const [participantOpened, setParticipantOpened] = useState(false);
  const handleParticipantClose = useCallback(() => {
    setParticipantOpened(false);
  }, []);

  let { auid } = router.query as { auid: string };

  const { participant, isLoading, mutate } = useParticipantByAuid(auid);

  if (isLoading) return <Loader />;

  if (!participant || participant?.status === "failed") return router.back();

  const { data } = participant;

  if (!data) return router.back();

  return (
    <>
      <Button
        compact
        variant="light"
        mb="sm"
        leftIcon={<IconArrowNarrowLeft size={16} stroke={1.5} />}
        onClick={() => {
          router.push("/dashboard/participant");
        }}
      >
        Go Back
      </Button>
      <Group position="apart" mb={30}>
        <Stack spacing={0}>
          <Title>新增參與者</Title>
          <Text color="dimmed">{data?.title}</Text>
        </Stack>
        <Group position="right">
          <Button
            leftIcon={<IconUserPlus size={16} stroke={1.5} />}
            onClick={() => setParticipantOpened(true)}
          >
            新增
          </Button>
          <FileButton
            onChange={async (file) => {
              await onCSVSubmit(file, auid);
              mutate();
            }}
            accept="text/csv"
          >
            {(props) => (
              <Button
                leftIcon={<IconFileUpload size={16} stroke={1.5} />}
                {...props}
              >
                CSV
              </Button>
            )}
          </FileButton>
        </Group>
      </Group>

      <Modal
        opened={participantOpened}
        onClose={handleParticipantClose}
        title={<Title order={2}>新增參與者</Title>}
      >
        <CreateParticipant
          activityUid={auid}
          handleClose={handleParticipantClose}
          mutate={mutate}
        />
      </Modal>

      <Paper sx={{ padding: "1rem" }}>
        <ParticipantTable
          data={data.participant}
          mutate={mutate}
          title={data.title}
        />
      </Paper>
    </>
  );
};

Management.auth = true;

export default Management;
