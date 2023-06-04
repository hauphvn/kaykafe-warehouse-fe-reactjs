import './InputNumber.scss';
function InputNumber(props: InputNumberT) {
  const {
    label,
    min,
    max,
    defaultValue,
    onChange,
    onlyInputPositiveNumber,
    noDecimal,
    onBlur,
    value,
    labelAfter,
    textWarning,
    className,
    required,
    placeholder,
    maxLength = Infinity,
  } = props;

  function onKeydown(event: any) {
    if (
      ['e', 'E', '+'].includes(event.key) ||
      (onlyInputPositiveNumber && ['-'].includes(event.key)) ||
      (noDecimal && ['.'].includes(event.key)) ||
      +event.key < +event.target?.min
    ) {
      return event.preventDefault();
    }
  }

  function handleChange(event: any) {
    if (onChange && event.target.value.length <= maxLength) onChange(event.target.value);
  }

  return (
    <div className={`input-number-root ${className ? className : ''} ${required ? 'input-required' : ''}`}>
      {label && <div className="label">{label}</div>}
      <div className="input-wrapper">
        <div className="input-item">
          <input
            type="number"
            min={min || 0}
            max={max}
            defaultValue={defaultValue}
            onChange={handleChange}
            onKeyDown={onKeydown}
            onBlur={onBlur}
            value={value}
            placeholder={placeholder}
            onPaste={event => event.preventDefault()}
          />
          {labelAfter && <span className="label-after">{labelAfter}</span>}
        </div>
        {textWarning && <div className="required">{textWarning}</div>}
      </div>
    </div>
  );
}

export default InputNumber;

interface InputNumberT {
  min?: number;
  max?: number;
  defaultValue?: number;
  onChange?: (e: any) => void;
  handleKeydown?: (e: any) => void;
  label?: string;
  onlyInputPositiveNumber?: boolean;
  noDecimal?: boolean;
  onBlur?: any;
  value?: string;
  labelAfter?: any;
  textWarning?: string;
  className?: string;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
}
