import { Checkbox, ActionIcon, Text } from '@mantine/core';
import { IconLayoutColumns } from '@tabler/icons-react';
import { Table } from '@tanstack/react-table';
import dynamic from 'next/dynamic';
import { ReactNode, memo } from 'react';

const Popover = dynamic(() => import('@mantine/core').then((module) => module.Popover));
const PopoverTarget = dynamic(() =>
  import('@mantine/core').then((module) => module.Popover.Target)
);
const PopoverDropdown = dynamic(() =>
  import('@mantine/core').then((module) => module.Popover.Dropdown)
);

type ColumnToggleProps<RowData> = Pick<
  Table<RowData>,
  | 'getIsAllColumnsVisible'
  | 'getAllLeafColumns'
  | 'toggleAllColumnsVisible'
  | 'getIsSomeColumnsVisible'
>;

function ColumnToggle<RowData>(props: ColumnToggleProps<RowData>) {
  const {
    getAllLeafColumns,
    getIsAllColumnsVisible,
    toggleAllColumnsVisible,
    getIsSomeColumnsVisible,
  } = props;

  const columns = getAllLeafColumns();
  const allChecked = getIsAllColumnsVisible();
  const indeterminate = getIsSomeColumnsVisible() && !allChecked;

  const Target = memo(() => (
    <PopoverTarget>
      <ActionIcon>
        <IconLayoutColumns stroke={1} size={25} />
      </ActionIcon>
    </PopoverTarget>
  ));

  const Dropdown = memo(() => (
    <PopoverDropdown sx={{ padding: '1rem' }}>
      <Text color="dimmed" weight={500} size="sm" mb="1rem">
        Column Toggle
      </Text>

      <Checkbox
        checked={allChecked}
        indeterminate={indeterminate}
        label="Toggle All"
        transitionDuration={0}
        onChange={() => toggleAllColumnsVisible(!allChecked)}
      />
      {columns.map((column) => (
        <Checkbox
          mt="xs"
          ml={33}
          label={(column.columnDef.header as ReactNode | undefined) ?? column.id}
          key={column.id}
          checked={column.getIsVisible()}
          onChange={column.getToggleVisibilityHandler()}
        />
      ))}
    </PopoverDropdown>
  ));

  return (
    <Popover shadow="md" width={200} position="left-start" transition="slide-left">
      <Target />
      <Dropdown />
    </Popover>
  );
}

export default ColumnToggle;
