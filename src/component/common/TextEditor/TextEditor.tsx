import 'src/component/common/TextEditor/TextEditor.scss';
import { useEffect, useState } from 'react';
import {
  BtnBold,
  BtnBulletList,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnStrikeThrough,
  BtnUnderline,
  createButton,
  Editor,
  EditorProvider,
  Separator,
  Toolbar,
} from 'react-simple-wysiwyg';
import { AlignCenterOutlined, AlignLeftOutlined, AlignRightOutlined, ClearOutlined } from '@ant-design/icons/';
import { Space } from 'antd';

interface TextEditorPropsT {
  label?: string;
  disabled?: boolean | undefined;
  onChange?: (value: any) => void;
  className?: string;
  value?: string;
  textWarning?: string;
  onBlur?: () => void;
  required?: boolean;
  subLabel?: string;
}

export default function TextEditor(props: TextEditorPropsT) {
  const {
    onChange,
    value,
    textWarning,
    label,
    onBlur,
    required,
    className = '',
    disabled = false,
    subLabel = '',
  } = props;
  const [html, setHtml] = useState('');
  useEffect(() => {
    setHtml(value || '');
  }, [value]);
  // const MyReDoBtn = createButton(
  //   'Redo',
  //   <Space>
  //     <RedoOutlined />
  //   </Space>,
  //   'redo',
  // );
  // const MyUnDoBtn = createButton(
  //   'Undo',
  //   <Space>
  //     <UndoOutlined />
  //   </Space>,
  //   'undo',
  // );
  const MyAlignCenter = createButton(
    'Align Center',
    <Space>
      <AlignCenterOutlined />
    </Space>,
    'justifyCenter',
  );
  const MyAlignLeft = createButton(
    'Align Left',
    <Space>
      <AlignLeftOutlined />
    </Space>,
    'justifyLeft',
  );
  const MyAlignRight = createButton(
    'Align Right',
    <Space>
      <AlignRightOutlined />
    </Space>,
    'justifyRight',
  );
  const MyClearFormatting = createButton(
    'Clear all formatting',
    <Space>
      <ClearOutlined />
    </Space>,
    'removeFormat',
  );
  return (
    <div className={`text-editor-root ${className} ${required ? 'text-editor-required' : ''}`}>
      {label && <div className="label">{label}</div>}
      {subLabel && <div className="sub-label">{subLabel}</div>}
      <div className="text-editor-wrapper">
        <EditorProvider>
          <Editor
            disabled={disabled}
            onBlur={onBlur}
            value={html}
            onChange={e => {
              setHtml(e.target.value);
              if (onChange) {
                onChange(e);
              }
            }}
          >
            <Toolbar>
              {/*<MyUnDoBtn />*/}
              {/*<MyReDoBtn />*/}
              <BtnItalic />
              <BtnBold />
              <BtnUnderline />
              <BtnStrikeThrough />
              <MyAlignLeft />
              <MyAlignCenter />
              <MyAlignRight />
              <BtnLink />
              <BtnNumberedList />
              <BtnBulletList />
              <Separator />
              <MyClearFormatting />
              {/*<BtnStyles />*/}
            </Toolbar>
          </Editor>
        </EditorProvider>
        {textWarning && <div className="required">{textWarning}</div>}
      </div>
    </div>
  );
}
