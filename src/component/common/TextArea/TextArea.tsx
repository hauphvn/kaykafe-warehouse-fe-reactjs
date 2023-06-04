import { Input as InputBase } from 'antd';
import './TextArea.scss';

const { TextArea } = InputBase;

interface TextAreaPropsT {
  placeholder?: string;
  label?: string;
  disable?: boolean | undefined;
  defaultValue?: string | number | readonly string[] | undefined;
  maxLength?: number;
  minRows?: number;
  onChange?: (value: any) => void;
  className?: string;
  value?: string;
  name?: string;
  textWarning?: string;
  minCols?: number;
  onBlur?: () => void;
  required?: boolean;
}

export default function TextAreaCommon(props: TextAreaPropsT) {
  const {
    placeholder = '',
    disable = undefined,
    defaultValue = undefined,
    maxLength = -1,
    minRows = 4,
    onChange,
    className = '',
    value,
    name,
    textWarning,
    minCols,
    label,
    onBlur,
    required,
  } = props;
  return (
    <div className={`textarea-common-root ${className ? className : ''}  ${required ? 'textarea-required' : ''}`}>
      {label && <div className="label">{label}</div>}
      <div className="textarea-wrapper">
        <TextArea
          cols={minCols}
          value={value}
          rows={minRows}
          maxLength={maxLength}
          defaultValue={defaultValue}
          className={`textarea-root ${className}`}
          disabled={disable}
          placeholder={placeholder}
          onChange={(e: any) => (onChange ? onChange(e) : null)}
          name={name}
          onBlur={onBlur && onBlur}
        />
        {textWarning && <div className="required">{textWarning}</div>}
      </div>
    </div>
  );
}
