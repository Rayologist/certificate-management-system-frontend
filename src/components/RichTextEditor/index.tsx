import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import { Tooltip } from '@mantine/core';
import { RichTextEditorProps } from 'types';
import { ClearAll, Redo, Undo } from './controls';

export default function TextEditor(props: RichTextEditorProps) {
  const { readonly, value, deps, extensions = [], ...rest } = props;
  const editor = useEditor(
    {
      ...rest,
      editable: !readonly,
      extensions: [
        ...extensions,
        StarterKit,
        Underline,
        Link,
        Superscript,
        SubScript,
        Color,
        TextStyle,
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
      ],
      content: value,
    },
    deps
  );

  if (!editor) {
    return null;
  }

  if (readonly) {
    return (
      <RichTextEditor editor={editor}>
        <RichTextEditor.Content />
      </RichTextEditor>
    );
  }

  return (
    <RichTextEditor editor={editor}>
      <RichTextEditor.Toolbar sticky>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          {/* <RichTextEditor.Strikethrough /> */}
          <Tooltip label="Clear formatting" withArrow sx={{ fontSize: '12px' }}>
            <RichTextEditor.ClearFormatting />
          </Tooltip>
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <Tooltip label="Text color" withArrow sx={{ fontSize: '12px' }}>
            <RichTextEditor.ColorPicker
              colors={[
                '#25262b',
                '#868e96',
                '#fa5252',
                '#e64980',
                '#be4bdb',
                '#7950f2',
                '#4c6ef5',
                '#228be6',
                '#15aabf',
                '#12b886',
                '#40c057',
                '#82c91e',
                '#fab005',
                '#fd7e14',
              ]}
            />
          </Tooltip>
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.H1 />
          <RichTextEditor.H2 />
          <RichTextEditor.H3 />
          {/* <RichTextEditor.H4 /> */}
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          {/* <RichTextEditor.Blockquote /> */}
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
          <RichTextEditor.Subscript />
          <RichTextEditor.Superscript />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <Tooltip label="Hyperlink" withArrow sx={{ fontSize: '12px' }}>
            <RichTextEditor.Link />
          </Tooltip>
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.AlignLeft />
          <RichTextEditor.AlignCenter />
          <RichTextEditor.AlignRight />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <Undo />
          <Redo />
        </RichTextEditor.ControlsGroup>
        <RichTextEditor.ControlsGroup>
          <ClearAll />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content />
    </RichTextEditor>
  );
}
