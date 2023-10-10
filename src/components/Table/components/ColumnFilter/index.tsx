import dynamic from 'next/dynamic';
import { Column } from '@tanstack/react-table';
import { ActionIcon, CloseButton, Group, Text, Button } from '@mantine/core';
import { IconCheckbox, IconFilter, IconRotate } from '@tabler/icons-react';
import { memo, useState } from 'react';
import getFilterInput from './FilterInput';

const Popover = dynamic(() => import('@mantine/core').then((module) => module.Popover));
const PopoverTarget = dynamic(() =>
  import('@mantine/core').then((module) => module.Popover.Target)
);
const PopoverDropdown = dynamic(() =>
  import('@mantine/core').then((module) => module.Popover.Dropdown)
);

type ColumnFilterProps = {
  column: Column<any, unknown>;
};

const ColumnFilter = (props: ColumnFilterProps) => {
  const { column } = props;
  const { filterFn, meta } = column.columnDef;

  if (filterFn === 'auto') return null;

  const [opened, setOpened] = useState(false);
  const currentFilterValue = column.getFilterValue() as any;
  const [filterValue, setFilterValue] = useState<any>(currentFilterValue);

  const isFiltered = column.getIsFiltered();

  const filterInput = meta?.filterInput;

  if (!filterInput) return null;

  const inputFilter = getFilterInput({
    filterInput,
    state: { filterValue, setFilterValue },
    column,
  });

  const handleReset = () => {
    column.setFilterValue(null);
    setFilterValue(null);
  };

  const handleClose = () => {
    setFilterValue(currentFilterValue);
    setOpened(false);
  };

  const handleConfirm = () => {
    column.setFilterValue(filterValue);
  };

  const Target = memo(() => (
    <PopoverTarget>
      <ActionIcon
        size="md"
        onClick={() => setOpened((prev) => !prev)}
        color={isFiltered ? 'blue' : undefined}
        variant={isFiltered ? 'light' : undefined}
      >
        <IconFilter size={14} stroke={1.5} />
      </ActionIcon>
    </PopoverTarget>
  ));

  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      onClose={handleClose}
      transition="scale-y"
      withinPortal
      withArrow
      width="18rem"
    >
      <Target />
      <PopoverDropdown>
        <Group position="apart" mb="sm">
          <Text size="sm" color="dimmed" weight={600}>{`${column.columnDef.header} Filter`}</Text>
          <CloseButton onClick={handleClose} />
        </Group>
        {inputFilter}
        <Group mt="lg" position="apart">
          <Button
            onClick={handleReset}
            variant="outline"
            color="red"
            size="xs"
            leftIcon={<IconRotate stroke={1.5} size={14} />}
          >
            Reset
          </Button>
          <Button
            onClick={handleConfirm}
            size="xs"
            variant="outline"
            leftIcon={<IconCheckbox stroke={1.5} size={14} />}
          >
            Confirm
          </Button>
        </Group>
      </PopoverDropdown>
    </Popover>
  );
};

export default memo(ColumnFilter);
