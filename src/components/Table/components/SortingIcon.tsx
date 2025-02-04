import { IconChevronDown, IconChevronUp, IconSelector, IconProps } from '@tabler/icons-react';
import { SortDirection } from '@tanstack/react-table';

function SortingIcon({
  sorted,
  canSort,
  ...args
}: { sorted: false | SortDirection; canSort: boolean } & IconProps) {
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

export default SortingIcon;
