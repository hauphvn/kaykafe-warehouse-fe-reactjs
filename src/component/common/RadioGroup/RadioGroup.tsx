import { Radio } from 'antd';
import { useEffect, useState } from 'react';
import './RadioGroup.scss';

interface RadioGroupModelT {
  label: string;
  value: any;
}

interface RadioGroupPropsT {
  valueDefault?: any;
  options?: RadioGroupModelT[];
  onChange: (value: any) => void;
  disabled?: boolean;
  className?: string;
  name?: string;
  label?: string;
  onBlur?: (value: any) => void;
}

export default function RadioGroup(props: RadioGroupPropsT) {
  const { valueDefault = null, onChange, options, disabled = false, className = '', name = '', label, onBlur } = props;
  const [value, setValue] = useState(valueDefault);
  useEffect(() => {
    setValue(valueDefault);
  }, [valueDefault]);
  return (
    <div className="radio-group-root">
      {label && <div className="label">{label}</div>}
      <Radio.Group
        name={name}
        defaultValue={valueDefault}
        disabled={disabled}
        className={`radio-group-block ${className}`}
        onChange={e => {
          setValue(e.target.value);
          onChange(e);
        }}
        onBlur={onBlur}
        value={value}
      >
        {options &&
          options?.map((option: RadioGroupModelT, index: number) => (
            <Radio checked={false} key={index} value={option.value}>
              {option.label}
            </Radio>
          ))}
      </Radio.Group>
    </div>
  );
}
