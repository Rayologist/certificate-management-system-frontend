import React from 'react';
import { ControllerProps } from 'types';
import dynamic from 'next/dynamic';

function FormikController(props: ControllerProps) {
  const { control } = props;

  switch (control) {
    case 'text-input': {
      const TextInput = dynamic(() => import('./FormikComponents/TextInput'));
      return <TextInput {...props} />;
    }
    case 'password-input': {
      const PasswordInput = dynamic(() => import('./FormikComponents/PasswordInput'));
      return <PasswordInput {...props} />;
    }
    case 'number-input': {
      const NumberInput = dynamic(() => import('./FormikComponents/NumberInput'));
      return <NumberInput {...props} />;
    }
    case 'select': {
      const Select = dynamic(() => import('./FormikComponents/Select'));
      return <Select {...props} />;
    }
    case 'checkbox-group': {
      const CheckboxGroup = dynamic(() => import('./FormikComponents/CheckboxGroup'));
      return <CheckboxGroup {...props} />;
    }
    case 'radio-group': {
      const RadioGroup = dynamic(() => import('./FormikComponents/RadioGroup'));
      return <RadioGroup {...props} />;
    }
    case 'text-area': {
      const Textarea = dynamic(() => import('./FormikComponents/Textarea'));
      return <Textarea {...props} />;
    }
    case 'date-picker': {
      const DatePicker = dynamic(() => import('./FormikComponents/DatePicker'));
      return <DatePicker {...props} />;
    }
    case 'multi-select': {
      const MultiSelect = dynamic(() => import('./FormikComponents/MultiSelect'));
      return <MultiSelect {...props} />;
    }
    case 'file-input': {
      const FileInput = dynamic(() => import('./FormikComponents/FileInput'));
      return <FileInput {...props} />;
    }
    case 'text-editor': {
      const TextEditor = dynamic(() => import('./FormikComponents/TextEditor'));
      return <TextEditor {...props} />;
    }
    default:
      return null;
  }
}

export default React.memo(FormikController);
