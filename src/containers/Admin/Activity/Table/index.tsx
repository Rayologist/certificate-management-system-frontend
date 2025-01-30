import { useState } from 'react';
import Table, { useTable } from '@components/Table';
import { createColumnHelper } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Group, Modal, Title, ActionIcon, Stack, TextInput, Button, Text } from '@mantine/core';
import { IconMail, IconPencil, IconTrash } from '@tabler/icons-react';
import { Activity } from 'types';
import { useActivity } from 'src/services/activity';
import TextEditor from '@components/RichTextEditor';
import UpdateActivity from '../Update';
import DeleteActivity from '../Delete';

const columnHelper = createColumnHelper<Activity>();

const columns = [
  columnHelper.accessor('title', {
    header: '活動名稱',
    size: 300,
    minSize: 250,
  }),
  columnHelper.accessor('email', {
    header: '信件內容',
    cell: (props) => {
      const [opened, setOpened] = useState(false);
      const { email, subject, title } = props.row.original;
      return (
        <>
          <Modal
            opened={opened}
            onClose={() => setOpened(false)}
            size={700}
            title={<Title order={3}>{title}</Title>}
          >
            <Stack>
              <TextInput value={subject} label="信件主旨" readOnly labelProps={{ size: 16 }} />
              <Stack spacing={0}>
                <Text weight={500} color="#212529" size={16}>
                  信件內容
                </Text>
                <TextEditor value={email} readonly />
              </Stack>
            </Stack>
          </Modal>
          <Button compact fullWidth onClick={() => setOpened(true)} variant="light">
            <IconMail stroke={2} size={18} />
          </Button>
        </>
      );
    },
  }),
  columnHelper.accessor('startDate', {
    header: '開始日期',
    cell: (props) => format(new Date(props.getValue()), 'yyyy-MM-dd'),
    size: 150,
    minSize: 150,
  }),
  columnHelper.accessor('endDate', {
    header: '結束日期',
    cell: (props) => format(new Date(props.getValue()), 'yyyy-MM-dd'),
    size: 150,
    minSize: 150,
  }),
  columnHelper.accessor('createdAt', {
    header: '建立時間',
    cell: (props) => format(new Date(props.getValue()), 'yyyy-MM-dd HH:mm:ss'),
    size: 200,
    minSize: 150,
  }),
  columnHelper.accessor('updatedAt', {
    header: '更新時間',
    cell: (props) => format(new Date(props.getValue()), 'yyyy-MM-dd HH:mm:ss'),
    size: 200,
    minSize: 150,
  }),
  columnHelper.display({
    id: 'modify',
    size: 100,
    enableResizing: false,
    cell: (props) => {
      const [opened, setOpened] = useState(false);
      const [trashOpened, setTrashOpened] = useState(false);
      const { mutate } = useActivity();
      const { auid, title, startDate, endDate, email, subject } = props.cell.row.original;

      return (
        <>
          <Modal
            opened={opened}
            onClose={() => setOpened(false)}
            title={<Title order={2}>修改活動欄位</Title>}
            size={700}
            closeOnClickOutside={false}
          >
            <UpdateActivity
              auid={auid}
              title={title}
              startDate={new Date(startDate)}
              endDate={new Date(endDate)}
              subject={subject}
              email={email}
              mutate={mutate}
              setOpened={setOpened}
            />
          </Modal>

          <DeleteActivity
            auid={auid}
            title={title}
            opened={trashOpened}
            setOpened={setTrashOpened}
            mutate={mutate}
          />

          <Group spacing={0} position="left">
            <ActionIcon onClick={() => setOpened(true)}>
              <IconPencil size={16} stroke={1.5} />
            </ActionIcon>
            <ActionIcon color="red" onClick={() => setTrashOpened(true)}>
              <IconTrash size={16} stroke={1.5} />
            </ActionIcon>
          </Group>
        </>
      );
    },
  }),
];

export default function ActivityTable({ data }: { data: Activity[] }) {
  const table = useTable({
    data,
    columns,
  });

  return <Table table={table} />;
}
