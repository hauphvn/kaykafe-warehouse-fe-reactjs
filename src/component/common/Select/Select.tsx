import { Select } from 'antd';

const { Option } = Select;
import { IconArrowDropdown } from 'src/assets/icons';
import './Select.scss';

interface SelectCommonPropsT {
  handleChange: (e: any) => void;
  className?: string;
  options?: { value: string; text: string }[];
  options2?: { key: string; value: string }[];
  iconSuffix?: any;
  label?: string;
  value?: any;
  defaultValue?: any;
  required?: boolean;
  onBlur?: (e: any) => void;
  textWarning?: string;
  disabled?: boolean;
  allowClear?: boolean;
  placeHolder?: string;
}

function SelectCommon({
  handleChange,
  className = '',
  options,
  options2,
  iconSuffix = <IconArrowDropdown />,
  label,
  value,
  defaultValue,
  required,
  onBlur,
  textWarning,
  disabled,
  allowClear = false,
  placeHolder,
}: SelectCommonPropsT) {
  return (
    <div className={`select-root  ${className} ${required ? 'select-required' : ''}`}>
      {label && <div className="label">{label}</div>}
      <div className="select-wrapper">
        <Select
          placeholder={placeHolder}
          defaultValue={defaultValue}
          style={{
            minWidth: 213,
          }}
          value={value}
          onChange={(value: string) => {
            handleChange(value);
          }}
          suffixIcon={iconSuffix}
          onBlur={onBlur}
          showSearch={true}
          disabled={disabled}
          filterOption={(inputValue: string, option: any) => {
            return option && inputValue && option?.label?.toString().toLowerCase().includes(inputValue.toLowerCase());
          }}
          allowClear={allowClear}
        >
          {options
            ? options?.map(option => (
                <Option value={option.value} key={option.value} label={option.text}>
                  {option.text}
                </Option>
              ))
            : options2?.map(option => {
                return (
                  <Option value={option.key} key={option.key} label={option.value}>
                    {option.value}
                  </Option>
                );
              })}
        </Select>
        {textWarning && <div className="required">{textWarning}</div>}
      </div>
    </div>
  );
}

export default SelectCommon;
