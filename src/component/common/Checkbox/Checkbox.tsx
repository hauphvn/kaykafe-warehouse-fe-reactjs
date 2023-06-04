import './Checkbox.scss';
import { Checkbox as CheckboxCommon } from 'antd';

export interface ItemCheckboxModelT {
  value: any;
  label: any;
}

interface CheckboxPropsT {
  onChange: (checkedValues: any) => void;
  items: ItemCheckboxModelT[];
  disabled?: boolean;
  className?: string;
  value: string[];
  label?: string;
  indeterminate?: boolean;
  checked?: boolean;
}

export default function Checkbox(props: CheckboxPropsT) {
  const {
    onChange,
    items,
    disabled = false,
    className = '',
    value,
    label,
    indeterminate = false,
    checked = false,
  } = props;
  return (
    <div className={`checkbox-root ${className}`}>
      {!!label && <div className="label">{label}</div>}
      <CheckboxCommon.Group className="checkbox-item" disabled={disabled} onChange={onChange} value={value}>
        {items &&
          items.map((item: ItemCheckboxModelT, index: number) => (
            <CheckboxCommon checked={checked} indeterminate={indeterminate} key={index} value={item.value}>
              {item.label}
            </CheckboxCommon>
          ))}
      </CheckboxCommon.Group>
    </div>
  );
}
