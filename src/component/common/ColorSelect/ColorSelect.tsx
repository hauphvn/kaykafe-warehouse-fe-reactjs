import './ColorSelect.scss';
import { useEffect, useState } from 'react';

export type ColorItem = {
  id: string;
  backgroundColor: string;
  textColor: string;
};

export interface ColorSelectT {
  colorsList: ColorItem[];
  onChange: (id: string) => void;
  onBlur?: (e: any) => void;
  label: string;
  required?: boolean;
  value?: string;
  textWarning?: string;
}

const ColorSelect = (props: ColorSelectT) => {
  const {
    onBlur = () => null,
    textWarning = '',
    required = false,
    label = '',
    colorsList = [],
    onChange = () => null,
    value,
  } = props;
  const [valueCurrent, setValueCurrent] = useState(value);
  useEffect(() => {
    if (!value && colorsList.length > 0) {
      setValueCurrent(colorsList[0]?.id);
    }
  }, [colorsList]);
  return (
    <div className={`color-select-root ${required ? 'color-select-required' : ''}`}>
      <div className={'label'}>{label}</div>
      <div onBlur={onBlur} className="color-items-container">
        <div className={'items'}>
          {colorsList &&
            colorsList.length > 0 &&
            colorsList?.map((color: ColorItem) => (
              <div className={`item-color ${valueCurrent === color.id ? ' active' : ''}`} key={color.id}>
                <div
                  style={{ backgroundColor: color.backgroundColor }}
                  className={'color'}
                  onClick={() => {
                    setValueCurrent(color.id);
                    onChange(color.id);
                  }}
                ></div>
              </div>
            ))}
        </div>
        {textWarning && <div className="required">{textWarning}</div>}
      </div>
    </div>
  );
};

export default ColorSelect;
