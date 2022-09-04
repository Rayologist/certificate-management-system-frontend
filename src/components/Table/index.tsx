import { useMemo, useState, useRef, memo } from 'react';
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  ColumnDef,
  getSortedRowModel,
  SortingState,
  SortDirection,
  getFilteredRowModel,
  RowData,
} from '@tanstack/react-table';
import {
  Text,
  Table as MantineTable,
  UnstyledButton,
  Group,
  Center,
  ScrollArea,
} from '@mantine/core';
import { useVirtualizer } from '@tanstack/react-virtual';
import { IconChevronDown, IconChevronUp, IconSelector, TablerIconProps } from '@tabler/icons';
import useStyles from './styles';
import GlobalFilter from './GlobalFilter';

function SortingIcon({
  sorted,
  canSort,
  ...args
}: { sorted: false | SortDirection; canSort: boolean } & TablerIconProps) {
  const icon = {
    asc: IconChevronUp,
    desc: IconChevronDown,
  };

  if (!canSort) {
    return null;
  }

  if (sorted) {
    const Icon = icon[sorted];
    return <Icon {...args} />;
  }
  return <IconSelector {...args} />;
}

function Table<T extends RowData>({ data, columns }: { data: T[]; columns: ColumnDef<T, any>[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);
  const col = useMemo(() => columns, [columns]);
  const table = useReactTable<T>({
    data,
    columns: col,
    state: {
      sorting,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    getFilteredRowModel: getFilteredRowModel(),
  });

  const tableContainerRef = useRef<HTMLDivElement>(null);

  const { rows } = table.getRowModel();

  const virtualizer = useVirtualizer({
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 50,
    count: rows.length,
  });

  const { getTotalSize, getVirtualItems } = virtualizer;

  const virtualRows = getVirtualItems();
  const totalSize = getTotalSize();

  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0 ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0) : 0;

  const TH = memo(() => (
    <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th className={classes.th} key={header.id} style={{ width: header.getSize() }}>
              <UnstyledButton
                onClick={header.column.getToggleSortingHandler()}
                className={classes.control}
              >
                <Group position="apart">
                  <Text weight={500} size="sm">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </Text>
                  <Center>
                    <SortingIcon
                      sorted={header.column.getIsSorted()}
                      canSort={header.column.getCanSort()}
                      size={14}
                      stroke={1.5}
                    />
                  </Center>
                </Group>
              </UnstyledButton>
            </th>
          ))}
        </tr>
      ))}
    </thead>
  ));

  const TB = memo(() => (
    <tbody>
      {paddingTop > 0 && (
        <tr>
          <td style={{ height: `${paddingTop}px` }} />
        </tr>
      )}
      {virtualRows.map((virtualRow) => {
        const row = rows[virtualRow.index];
        return (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
            ))}
          </tr>
        );
      })}

      {paddingBottom > 0 && (
        <tr>
          <td style={{ height: `${paddingBottom}px` }} />
        </tr>
      )}
      {/* {table.getRowModel().rows.map((row) => {
        return (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => {
              return (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              );
            })}
          </tr>
        );
      })} */}
    </tbody>
  ));

  return (
    <>
      <GlobalFilter value={globalFilter ?? ''} onChange={(e) => setGlobalFilter(e.target.value)} />

      <ScrollArea
        viewportRef={tableContainerRef}
        style={{ height: 500 }}
        onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
      >
        <MantineTable
          horizontalSpacing="lg"
          verticalSpacing="xs"
          sx={{ minWidth: 700, tableLayout: 'fixed' }}
          highlightOnHover
        >
          <TH />
          <TB />
        </MantineTable>
      </ScrollArea>
    </>
  );
}

Table.displayName = 'Table';

export default Table;
