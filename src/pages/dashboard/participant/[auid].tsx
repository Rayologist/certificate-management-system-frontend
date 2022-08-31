import {
  Title,
  Group,
  Paper,
  Modal,
  Button,
  FileButton,
  Text,
  Stack,
  List,
  ThemeIcon,
} from "@mantine/core";
import { useCallback, useState } from "react";
import Loader from "@components/Loader";
import { ParticipantTable } from "@containers/Admin/Participant/Table";
import {
  IconArrowNarrowLeft,
  IconFileUpload,
  IconUserPlus,
  IconX,
  IconCheck,
} from "@tabler/icons";
import { useRouter } from "next/router";
import onCSVSubmit from "@containers/Admin/Participant/Create/onCSVSubmit";
import CreateParticipant from "@containers/Admin/Participant/Create";
import { useParticipantByAuid } from "@services/participant";
import { Participant } from "types";

type ErrorData = Pick<
  Participant,
  "name" | "from" | "title" | "email" | "phone"
>;

const Management = () => {
  const router = useRouter();
  const [errorOpened, setErrorOpened] = useState(false);
  const [errorData, setErrorData] = useState<ErrorData[]>();
  const [participantOpened, setParticipantOpened] = useState(false);

  const handleParticipantClose = useCallback(() => {
    setParticipantOpened(false);
  }, []);

  let { auid } = router.query as { auid: string };

  const { participant, isLoading, mutate, isError } =
    useParticipantByAuid(auid);

  if (isLoading) return <Loader />;

  if (isError) {
    router.push("/500", { pathname: router.asPath });
    return null;
  }

  if (!participant || participant?.status === "failed") return router.back();

  const { data } = participant;

  if (!data) return router.back();

  return (
    <>
      <Modal
        opened={errorOpened}
        onClose={() => {
          setErrorOpened(false);
          setErrorData(undefined);
        }}
        title={<Title order={2}>錯誤資料</Title>}
        size="lg"
      >
        {errorData ? (
          <List withPadding type="ordered">
            {errorData?.map((data, index) => {
              return (
                <List.Item key={`${data}-${index}`}>
                  <List withPadding size="sm" center spacing="xs">
                    {Object.entries(data).map((value) => {
                      const Icon =
                        value[1] === "" ? (
                          <ThemeIcon color="red" size={18} radius="xl">
                            <IconX size={12} />
                          </ThemeIcon>
                        ) : (
                          <ThemeIcon color="teal" size={18} radius="xl">
                            <IconCheck size={12} />
                          </ThemeIcon>
                        );
                      return (
                        <>
                          <List.Item icon={Icon}>
                            <Text weight="bold" transform="capitalize">
                              {value[0]}:
                            </Text>
                          </List.Item>
                          <Text pl={31}>{value[1]}</Text>
                        </>
                      );
                    })}
                  </List>
                </List.Item>
              );
            })}
          </List>
        ) : (
          <Text>找不到錯誤資料</Text>
        )}
      </Modal>
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
          <Text color="dimmed">{data.title}</Text>
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
              const data = await onCSVSubmit(file, auid);
              if (data?.length) {
                setErrorData(data);
                setErrorOpened(true);
                return;
              }
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
          certificates={data.certificate}
          mutate={mutate}
        />
      </Paper>
    </>
  );
};

Management.auth = true;

export default Management;
