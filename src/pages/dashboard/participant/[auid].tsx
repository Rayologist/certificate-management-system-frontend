import dynamic from 'next/dynamic';
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
  Tooltip,
} from '@mantine/core';
import {
  IconArrowNarrowLeft,
  IconFileUpload,
  IconUserPlus,
  IconX,
  IconCheck,
  IconSend,
} from '@tabler/icons-react';
import { useCallback, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import onCSVSubmit from '@containers/Admin/Participant/Create/onCSVSubmit';
import { useParticipantByAuid } from '@services/participant';
import { Participant } from 'types';
import { Route } from '@config';
import Table, { useTable } from '@components/Table';
import { useColumns } from '@containers/Admin/Participant/Table/participant';
import { Send } from '@containers/Admin/Participant/Send/Send';
import { useDisclosure } from '@mantine/hooks';

const CreateParticipant = dynamic(() => import('@containers/Admin/Participant/Create'));
const Loader = dynamic(() => import('@components/Loader'));

type ErrorData = Pick<Participant, 'name' | 'from' | 'title' | 'email' | 'phone'>;

const Management = () => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const resetRef = useRef<() => void>(null);
  const [errorOpened, setErrorOpened] = useState(false);
  const [errorData, setErrorData] = useState<ErrorData[] | string>();
  const [participantOpened, setParticipantOpened] = useState(false);
  const [batchSendOpened, batchSendModal] = useDisclosure();

  const clearFile = useCallback(() => {
    setFile(null);
    resetRef.current?.();
  }, []);

  const handleParticipantClose = useCallback(() => {
    setParticipantOpened(false);
  }, []);

  const { auid } = router.query as { auid: string };

  const { participant, isLoading, mutate, isError } = useParticipantByAuid(auid);
  const columns = useColumns({ certificates: participant?.data.certificate ?? [], mutate });
  const table = useTable({
    data: participant?.data.participant ?? [],
    columns,
    getRowId: (row) => String(row.id),
  });

  if (isLoading) return <Loader />;

  if (isError) {
    router.push('/500', { pathname: router.asPath });
    return null;
  }

  if (!participant || participant?.status === 'failed') return router.back();

  const { data } = participant;

  if (!data) return router.back();

  const selectedRow = table.getSelectedRowModel().rows;

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
          {data.title.length > 80 ? (
            <Tooltip label={data.title}>
              <Text color="dimmed">{data.title.slice(0, 80)}...</Text>
            </Tooltip>
          ) : (
            <Text color="dimmed">{data.title}</Text>
          )}
        </Stack>
        <Group position="right">
          {selectedRow.length > 0 && (
            <Button
              color="violet"
              leftIcon={<IconSend size={16} stroke={1.5} />}
              onClick={batchSendModal.open}
            >
              寄送信件
            </Button>
          )}
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

      <Modal
        opened={batchSendOpened}
        onClose={batchSendModal.close}
        title={<Title order={2}>目前證書</Title>}
        size="xl"
      >
        <Send ids={selectedRow.map((r) => r.original.id)} certificates={data.certificate} />
      </Modal>

      <Paper sx={{ padding: '1rem' }}>
        <Table table={table} />
      </Paper>
    </>
  );
};

Management.auth = true;

export default Management;
