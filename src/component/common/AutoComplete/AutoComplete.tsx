import './AutoComplete.scss';
import { AutoComplete } from 'antd';
import { IconArrowDropdown } from 'src/assets/icons';

export interface AutoCompleteOptionT {
  value: any;
  key?: string | number;
}

interface AutoCompletePropsT {
  defaultValue?: any;
  value: string;
  disabled?: boolean;
  className?: string;
  name?: string;
  onChange: (value: any) => void;
  onFocus?: (value: any) => void;
  onBlur?: (value: any) => void;
  textWarning?: any;
  placeholder?: string;
  dropdownClassName?: string;
  options: AutoCompleteOptionT[];
  label?: string;
  required?: boolean;
  hasSuffixIcon?: boolean;
  listHeight?: number;
}

export default function AutoCompleteCommon(props: AutoCompletePropsT) {
  const {
    defaultValue = '',
    disabled = false,
    className = '',
    value,
    onFocus,
    onBlur,
    onChange,
    name = '',
    textWarning,
    placeholder,
    dropdownClassName = '',
    options = [],
    label,
    required,
    hasSuffixIcon,
    listHeight,
  } = props;
  const handleFocus = (event: any) => {
    onFocus && onFocus(event);
  };

  const handleBlur = (event: any) => {
    onBlur && onBlur(event);
  };
  return (
    <div className={`auto-complete-root ${className ? className : ''} ${required ? 'auto-complete-required' : ''}`}>
      {!!label && <div className="label">{label}</div>}
      <div className="auto-complete-wrapper">
        <AutoComplete
          getPopupContainer={trigger => trigger.parentElement}
          listHeight={listHeight || 200}
          placeholder={placeholder}
          disabled={disabled}
          id={name}
          className={`auto-complete-input ${className}`}
          defaultValue={defaultValue}
          value={value}
          onChange={(e: any) => {
            onChange ? onChange(e) : null;
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          options={options}
          filterOption={(_, option) => option?.value?.toUpperCase().indexOf(value?.toUpperCase()) !== -1}
          popupClassName={dropdownClassName}
        />
        {hasSuffixIcon && <IconArrowDropdown />}
        {textWarning && <div className="required">{textWarning}</div>}
      </div>
    </div>
  );
}
