import { Input as InputBase } from 'antd';
import './Input.scss';
import IconShowPassword from 'src/assets/svg/icon-show-password.svg';
import IconHidePassword from 'src/assets/svg/icon-hide-password.svg';
import { forwardRef, useEffect, useState } from 'react';

interface InputPropsT {
  value?: any;
  onChange?: (value: any) => void;
  placeholder?: string;
  label?: string | any;
  disable?: boolean | undefined;
  defaultValue?: string | number | readonly string[] | undefined;
  className?: string;
  type?: string;
  name?: string;
  textWarning?: string | undefined;
  onBlur?: (e: any) => void;
  required?: boolean;
  labelAfter?: string;
  isShowIconPassword?: boolean;
  maxLength?: number;
  minLength?: number;
  autoCompleteText?: string;
  allowClear?: boolean;
}

const inputComponents = {
  input: InputBase,
  password: InputBase.Password,
};

const Input = (props: InputPropsT, ref: any) => {
  const {
    placeholder = '',
    defaultValue = '',
    onChange,
    className = '',
    type = 'text',
    disable,
    value,
    name,
    textWarning,
    label,
    onBlur,
    required,
    labelAfter,
    isShowIconPassword,
    maxLength,
    minLength,
    autoCompleteText = '',
    allowClear,
  } = props;

  const SpecificInput = inputComponents['input'];

  const [showPassword, setShowPassword] = useState(false);
  const [typeInput, setTypeInput] = useState('text');

  useEffect(() => {
    if (type !== typeInput) {
      setTypeInput(type);
    }
  }, [type]);

  const onToggleIcon = () => {
    setShowPassword(preState => {
      const newState = !preState;
      setTypeInput(newState ? 'text' : 'password');
      return newState;
    });
  };

  return (
    <div className={`input-root ${className} ${required ? 'input-required' : ''}`}>
      {!!label && <div className="label">{label}</div>}
      <div className={`${isShowIconPassword ? 'input-password' : ''} input-wrapper`}>
        <div className="input-item">
          <SpecificInput
            ref={ref}
            disabled={disable}
            type={typeInput}
            name={name}
            autoComplete={autoCompleteText}
            value={value}
            defaultValue={defaultValue}
            placeholder={placeholder}
            onChange={(e: any) => {
              onChange ? onChange(e) : null;
            }}
            onBlur={onBlur}
            maxLength={maxLength}
            minLength={minLength}
            allowClear={allowClear}
          />
          {isShowIconPassword && (
            <img
              className="icon-password"
              onClick={onToggleIcon}
              src={showPassword ? IconShowPassword : IconHidePassword}
              alt="icon password"
            />
          )}
          {labelAfter && <span className="label-after">{labelAfter}</span>}
        </div>
        {textWarning && <div className="required">{textWarning}</div>}
      </div>
    </div>
  );
};

export default forwardRef(Input);
