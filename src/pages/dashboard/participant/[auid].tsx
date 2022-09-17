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
  Box,
} from '@mantine/core';
import { useCallback, useState, useRef } from 'react';
import Loader from '@components/Loader';
import { ParticipantTable } from '@containers/Admin/Participant/Table';
import { IconArrowNarrowLeft, IconFileUpload, IconUserPlus, IconX, IconCheck } from '@tabler/icons';
import { useRouter } from 'next/router';
import onCSVSubmit from '@containers/Admin/Participant/Create/onCSVSubmit';
import CreateParticipant from '@containers/Admin/Participant/Create';
import { useParticipantByAuid } from '@services/participant';
import { Participant } from 'types';
import { Route } from '@config';

type ErrorData = Pick<Participant, 'name' | 'from' | 'title' | 'email' | 'phone'>;

const Management = () => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const resetRef = useRef<() => void>(null);
  const [errorOpened, setErrorOpened] = useState(false);
  const [errorData, setErrorData] = useState<ErrorData[] | string>();
  const [participantOpened, setParticipantOpened] = useState(false);

  const clearFile = useCallback(() => {
    setFile(null);
    resetRef.current?.();
  }, []);

  const handleParticipantClose = useCallback(() => {
    setParticipantOpened(false);
  }, []);

  const { auid } = router.query as { auid: string };

  const { participant, isLoading, mutate, isError } = useParticipantByAuid(auid);

  if (isLoading) return <Loader />;

  if (isError) {
    router.push('/500', { pathname: router.asPath });
    return null;
  }

  if (!participant || participant?.status === 'failed') return router.back();

  const { data } = participant;

  if (!data) return router.back();

  return (
    <>
      <Modal
        opened={errorOpened}
        onClose={() => {
          setErrorOpened(false);
          setErrorData(undefined);
          if (file) clearFile();
        }}
        title={<Title order={2}>錯誤資料</Title>}
        size="lg"
      >
        {typeof errorData === 'string' ? (
          <Text color="red">{errorData}</Text>
        ) : (
          <List withPadding type="ordered">
            {errorData?.map((error, layerOneIndex) => (
              <List.Item key={`${error}-${layerOneIndex}`}>
                <List withPadding size="sm" center spacing="xs">
                  {Object.entries(error).map((errorObject, layerTwoIndex) => {
                    const [field, text] = errorObject;
                    const Icon =
                      text === '' ? (
                        <ThemeIcon color="red" size={18} radius="xl">
                          <IconX size={12} />
                        </ThemeIcon>
                      ) : (
                        <ThemeIcon color="teal" size={18} radius="xl">
                          <IconCheck size={12} />
                        </ThemeIcon>
                      );
                    return (
                      <Box key={`${text}-${layerOneIndex}-${layerTwoIndex}`}>
                        <List.Item icon={Icon}>
                          <Text weight="bold" transform="capitalize">
                            {field}:
                          </Text>
                        </List.Item>
                        <Text pl={31}>{text || <br />}</Text>
                      </Box>
                    );
                  })}
                </List>
              </List.Item>
            ))}
          </List>
        )}
      </Modal>
      <Button
        compact
        variant="light"
        mb="sm"
        leftIcon={<IconArrowNarrowLeft size={16} stroke={1.5} />}
        onClick={() => {
          router.push(Route.Participant);
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
            onChange={async (csvFile) => {
              setFile(csvFile);
              const errors = await onCSVSubmit(csvFile, auid);
              if (file) clearFile();
              if (errors?.length) {
                setErrorData(errors);
                setErrorOpened(true);
                return;
              }
              mutate();
            }}
            resetRef={resetRef}
            accept="text/csv"
          >
            {(props) => (
              <Button leftIcon={<IconFileUpload size={16} stroke={1.5} />} {...props}>
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

      <Paper sx={{ padding: '1rem' }}>
        <ParticipantTable data={data.participant} certificates={data.certificate} mutate={mutate} />
      </Paper>
    </>
  );
};

Management.auth = true;

export default Management;
