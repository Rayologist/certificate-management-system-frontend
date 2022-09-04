import { useState } from 'react';

import Table from '@components/Table';
import { createColumnHelper } from '@tanstack/react-table';

import { format } from 'date-fns';
import { Group, Modal, Title, ActionIcon } from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons';

import { Activity } from 'types';
import { useActivity } from 'src/services/activity';
import UpdateActivity from '../Update';
import DeleteActivity from '../Delete';

const columnHelper = createColumnHelper<Activity>();

const columns = [
  columnHelper.accessor('title', {
    header: '活動名稱',
    minSize: 250,
  }),
  columnHelper.accessor('startDate', {
    header: '開始日期',
    cell: (props) => format(new Date(props.getValue()), 'yyyy-MM-dd'),
    minSize: 50,
  }),
  columnHelper.accessor('endDate', {
    header: '結束日期',
    cell: (props) => format(new Date(props.getValue()), 'yyyy-MM-dd'),
    minSize: 50,
  }),
  columnHelper.accessor('createdAt', {
    header: '建立時間',
    cell: (props) => format(new Date(props.getValue()), 'yyyy-MM-dd HH:mm:ss'),
    minSize: 100,
  }),
  columnHelper.accessor('updatedAt', {
    header: '更新時間',
    cell: (props) => format(new Date(props.getValue()), 'yyyy-MM-dd HH:mm:ss'),
    minSize: 100,
  }),
  columnHelper.display({
    id: 'modify',
    size: 100,
    cell: (props) => {
      const [opened, setOpened] = useState(false);
      const [trashOpened, setTrashOpened] = useState(false);
      const { mutate } = useActivity();
      const { auid, title, startDate, endDate } = props.cell.row.original;

      return (
        <>
          <Modal
            opened={opened}
            onClose={() => setOpened(false)}
            title={<Title order={2}>修改活動欄位</Title>}
          >
            <UpdateActivity
              auid={auid}
              title={title}
              startDate={new Date(startDate)}
              endDate={new Date(endDate)}
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
  return <Table data={data} columns={columns} />;
}
