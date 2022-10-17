import dynamic from 'next/dynamic';
import { MultiSelectFilterProps } from 'types';

const MultiSelect = dynamic(() => import('@mantine/core').then((module) => module.MultiSelect));

const MultiSelectFilter = (props: MultiSelectFilterProps) => {
  const { filterValue, setFilterValue, ...rest } = props;
  return (
    <MultiSelect value={filterValue} onChange={(value) => setFilterValue(value ?? [])} {...rest} />
  );
};

export default MultiSelectFilter;
