import { useState } from 'react';
import { MultiSelect as MantineMultiSelect } from '@mantine/core';
import { MultiSelectProps } from 'types';
import { useCustomFormik } from './Helper';

function MultiSelect(props: MultiSelectProps) {
  const { label, name, ...rest } = props;
  const [options, setOptions] = useState(props.options);
  const [formik, hasError] = useCustomFormik(name);
  const multiSelectValue = formik.values[name] as MultiSelectProps['value'];

  return (
    <MantineMultiSelect
      label={label}
      name={name}
      value={multiSelectValue}
      data={options}
      onChange={(value) => {
        formik.setFieldValue(name, value);
      }}
      onBlur={() => formik.setFieldTouched(name, true)}
      error={hasError}
      getCreateLabel={(query) => `+ ${query}`}
      onCreate={(query) => {
        const capitalized = query.charAt(0).toUpperCase() + query.substring(1);
        const item = { label: capitalized, value: query };
        setOptions((prev) => [...prev, item]);
        return item;
      }}
      {...rest}
    />
  );
}

export default MultiSelect;
