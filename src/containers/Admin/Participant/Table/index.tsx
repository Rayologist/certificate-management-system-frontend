import Table from '@components/Table';
import { ActionIcon, Group, Text } from '@mantine/core';
import { IconWriting } from '@tabler/icons-react';
import { createColumnHelper } from '@tanstack/react-table';
import { ParticipantStatsResponse } from 'types';
import { useRouter } from 'next/router';
import { ParticipantTable } from './participant';

const columnHelper = createColumnHelper<ParticipantStatsResponse>();

const columns = [
  columnHelper.accessor('title', {
    header: '活動名稱',
    size: 100,
    minSize: 50,
  }),

  columnHelper.display({
    id: '目前使用者',
    enableResizing: false,
    cell: (props) => {
      const { _count } = props.cell.row.original;
      return (
        <Text>
          <Group spacing="xs">
            目前已經登記
            <Text weight="bold">{_count.participant}</Text>
            位參與者。
          </Group>
        </Text>
      );
    },
    size: 100,
  }),
  columnHelper.display({
    id: '管理',
    size: 60,
    enableResizing: false,
    cell: (props) => {
      const router = useRouter();
      const { auid } = props.cell.row.original;

      return (
        <Group position="right">
          <ActionIcon
            onClick={() => {
              router.push(`${router.asPath}/${auid}`);
            }}
          >
            <IconWriting stroke={1.5} />
          </ActionIcon>
        </Group>
      );
    },
  }),
];

function ParticipantStatsTable({ data }: { data: ParticipantStatsResponse[] }) {
  return <Table data={data} columns={columns} />;
}

export { ParticipantStatsTable, ParticipantTable };
