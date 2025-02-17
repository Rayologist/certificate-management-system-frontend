import { useMemo, useCallback, useState, memo } from 'react';
import {
  ActionIcon,
  Group,
  Modal,
  Title,
  Text,
  Button,
  ThemeIcon,
  Divider,
  Loader,
  Box,
  Tooltip,
  TextInput,
  Checkbox,
} from '@mantine/core';
import { createColumnHelper } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Certificate, Participant } from 'types';
import { KeyedMutator } from 'swr';
import {
  IconCheck,
  IconCircleDashed,
  IconMailForward,
  IconPencil,
  IconRotate,
  IconTrash,
} from '@tabler/icons-react';
import { sendCertificate } from '@services/certificate';
import UpdateParticipant from '../Update';
import DeleteParticipant from '../Delete';

const columnHelper = createColumnHelper<Participant>();

export const useColumns = ({
  certificates,
  mutate,
}: {
  certificates: Pick<Certificate, 'id' | 'displayName'>[];
  mutate: KeyedMutator<any>;
}) => {
  const columns = [
    columnHelper.display({
      id: 'select-col',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllRowsSelected()}
          indeterminate={table.getIsSomeRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
      size: 50,
    }),
    columnHelper.accessor('name', {
      header: '名字',
      size: 100,
    }),

    columnHelper.accessor('from', {
      header: '單位',
      size: 150,
    }),
    columnHelper.accessor('title', {
      header: '職稱',
      size: 100,
    }),
    columnHelper.accessor('email', {
      header: '電子信箱',
      size: 180,
      cell: (props) => <Text sx={{ wordWrap: 'break-word' }}>{props.getValue()}</Text>,
    }),
    columnHelper.accessor('phone', {
      header: '聯絡電話',
      size: 150,
    }),
    columnHelper.accessor('participantCertificate', {
      header: '取得證書數量',
      size: 150,
      cell: (props) => {
        const { original } = props.cell.row;
        const participantCertificate = props.getValue().map((value) => value.certificate.id);
        const officialCertificate = certificates;
        const [opened, setOpened] = useState(false);
        const [name, setName] = useState(original.name);
        const [isEditing, setIsEditing] = useState(false);

        return (
          <>
            <Button variant="outline" compact radius="lg" onClick={() => setOpened(true)}>
              {participantCertificate.length}
            </Button>

            <Modal
              onClose={() => {
                setOpened(false);
                mutate();
              }}
              opened={opened}
              title={<Title order={2}>目前證書</Title>}
              size="xl"
            >
              <Group spacing="lg" mb={10}>
                <Text sx={{ display: 'flex', alignItems: 'center' }} weight={500} size="lg">
                  證書顯示名稱:
                </Text>
                {isEditing ? (
                  <Group>
                    <TextInput value={name} onChange={(e) => setName(e.target.value)} />
                    <ActionIcon onClick={() => setIsEditing(false)} color="teal" variant="filled">
                      <IconCheck size={18} stroke={2} />
                    </ActionIcon>
                  </Group>
                ) : (
                  <>
                    <Text size="lg">{name}</Text>
                    <Group spacing={0}>
                      <ActionIcon color="violet" onClick={() => setIsEditing(true)}>
                        <IconPencil size={14} stroke={1.5} />
                      </ActionIcon>
                      <Tooltip label="reset" withArrow openDelay={200}>
                        <ActionIcon color="red" onClick={() => setName(original.name)}>
                          <IconRotate size={14} stroke={1.5} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </>
                )}
              </Group>

              {officialCertificate.map((value, index) => {
                const certClaimed = participantCertificate.includes(value.id);
                const [confirmOpened, setConfirmOpened] = useState(false);
                const [loading, setLoading] = useState(false);
                const [claimed, setClaimed] = useState(false);
                const handleConfirmClose = useCallback(() => setConfirmOpened(false), []);

                return (
                  <Box key={`${value.displayName}-${index}-modal`}>
                    <Modal
                      onClose={handleConfirmClose}
                      opened={confirmOpened}
                      title={<Title order={2}>證書寄送確認</Title>}
                      size="md"
                      sx={{ fontSize: '18px' }}
                    >
                      <>
                        <Group spacing={0}>
                          <Text>證書：</Text>
                          <Text weight={500}>{`${value.displayName}`}</Text>
                        </Group>
                        <Group spacing={0}>
                          <Text>參與者：</Text>
                          <Text weight={500}>{name}</Text>
                        </Group>
                        <Text mt={10}> 確定要寄出證書？</Text>

                        <Divider my="md" />
                        <Group position="right">
                          <Button variant="outline" onClick={handleConfirmClose}>
                            取消
                          </Button>
                          <Button
                            onClick={async () => {
                              handleConfirmClose();
                              setLoading(true);
                              await sendCertificate({
                                participantId: original.id,
                                certificateId: value.id,
                                altName: name,
                              });
                              setClaimed(true);
                              setLoading(false);
                            }}
                          >
                            確定
                          </Button>
                        </Group>
                      </>
                    </Modal>

                    <Group sx={{ display: 'flex', alignItems: 'center' }} position="apart">
                      <Text
                        size="sm"
                        mt={index && 10}
                        sx={{ display: 'flex', alignItems: 'center' }}
                        mr={5}
                      >
                        <ThemeIcon
                          color={certClaimed || claimed ? 'teal' : 'blue'}
                          variant="light"
                          radius="xl"
                          size="lg"
                        >
                          {loading ? (
                            <Loader size="sm" color="blue" />
                          ) : certClaimed || claimed ? (
                            <IconCheck size={16} />
                          ) : (
                            <IconCircleDashed size={16} />
                          )}
                        </ThemeIcon>
                        {value.displayName.length > 80 ? (
                          <Tooltip label={value.displayName}>
                            <Text ml={14}>{value.displayName.slice(0, 80)}...</Text>
                          </Tooltip>
                        ) : (
                          <Text ml={14}>{value.displayName}</Text>
                        )}
                      </Text>
                      <ActionIcon size="xl" onClick={() => setConfirmOpened(true)}>
                        <IconMailForward size={20} />
                      </ActionIcon>
                    </Group>
                  </Box>
                );
              })}
            </Modal>
          </>
        );
      },
    }),

    columnHelper.accessor('updatedAt', {
      header: '更新時間',
      minSize: 200,
      cell: (props) => format(new Date(props.getValue()), 'yyyy-MM-dd HH:mm:ss'),
    }),
    columnHelper.display({
      id: '管理',
      size: 150,
      enableResizing: false,
      cell: (props) => {
        const { id, name, title, from, phone, email } = props.cell.row.original;
        const [trashOpened, setTrashOpened] = useState(false);
        const [editOpened, setEditOpened] = useState(false);
        const handleEditClose = useCallback(() => {
          setEditOpened(false);
        }, []);

        const updateParticipant = useMemo(
          () => (
            <Modal
              opened={editOpened}
              onClose={handleEditClose}
              title={<Title>參與者資料更新</Title>}
            >
              <UpdateParticipant
                participantProps={{ id, name, title, from, phone, email }}
                mutate={mutate}
                handleClose={handleEditClose}
              />
            </Modal>
          ),
          [editOpened]
        );

        const deleteParticipant = useMemo(
          () => (
            <DeleteParticipant
              id={id}
              name={name}
              opened={trashOpened}
              setOpened={setTrashOpened}
              mutate={mutate}
            />
          ),
          [trashOpened]
        );

        const ActionIcons = memo(() => (
          <Group position="right" spacing={0}>
            <ActionIcon
              onClick={() => {
                setEditOpened(true);
              }}
            >
              <IconPencil stroke={1.5} size={16} />
            </ActionIcon>
            <ActionIcon color="red" onClick={() => setTrashOpened(true)}>
              <IconTrash stroke={1.5} size={16} />
            </ActionIcon>
          </Group>
        ));

        return (
          <>
            {updateParticipant}
            {deleteParticipant}
            <ActionIcons />
          </>
        );
      },
    }),
  ];

  return columns;
};
