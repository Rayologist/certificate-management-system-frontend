import RichTextEditor from '@components/RichTextEditor';
import { TextEditorProps } from 'types';
import { Input } from '@mantine/core';
import { useCustomFormik } from './Helper';

function TextEditor(props: TextEditorProps) {
  const { label, name, editor, ...rest } = props;
  const [formik, hasError] = useCustomFormik(name);
  const value = formik.values[name] as string;

  return (
    <Input.Wrapper {...rest} id={name} label={label} error={hasError}>
      <RichTextEditor
        {...editor}
        value={value}
        onBlur={() => {
          formik.handleBlur({ target: { name } });
        }}
        onUpdate={(tiptap) => {
          formik.handleChange({ target: { name, value: tiptap.editor.getHTML() } });
        }}
      />
    </Input.Wrapper>
  );
}

export default TextEditor;
