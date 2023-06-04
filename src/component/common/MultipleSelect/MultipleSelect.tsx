import './MultipleSelect.scss';
import { TreeSelect } from 'antd';
import { IconArrowDropdown } from 'src/assets/icons';
import { useEffect, useState } from 'react';
import { Checkbox } from 'src/component/common';

export type MultipleSelectOptionT = {
  title: string | JSX.Element;
  value: string;
  key: string;
};

interface MultipleSelectPropsT {
  options: { value: string; text: string }[];
  value?: string[];
  placeholder?: string;
  onChange?: (value: any) => void;
  width?: string | number;
  defaultValue?: any;
  disabled?: boolean;
  showArrow?: boolean;
  dropdownClassName?: string;
  maxTagCount?: number | 'responsive';
  isFixedDropdown?: boolean;
  label?: string;
  iconSuffix?: any;
  required?: boolean;
  className?: string;
  textWarning?: string | undefined;
  onBlur?: (e: any) => void;
}

export default function MultipleSelect(props: MultipleSelectPropsT) {
  const {
    width = 240,
    onChange,
    showArrow = true,
    dropdownClassName = '',
    disabled = false,
    maxTagCount = 2,
    isFixedDropdown = false,
    options,
    label,
    iconSuffix = <IconArrowDropdown />,
    value,
    defaultValue,
    required,
    className,
    textWarning = '',
    onBlur,
    ...restProps
  } = props;

  const style = {
    width: width,
  };

  const [treeData, setTreeData] = useState<MultipleSelectOptionT[]>([]);

  useEffect(() => {
    if (options?.length > 0) {
      const newOptions = options?.map(item => {
        return { value: item.value, title: item.text, key: item.value };
      });
      setTreeData([selectAllItem(onChange, options, value), ...newOptions]);
    }
  }, [options, value, onChange]);
  return (
    <div className={`multi-select-root ${className ? className : ''} ${required ? 'input-required' : ''}`}>
      {!!label && <div className="label">{label}</div>}
      <div className={'field-wrapper'}>
        <TreeSelect
          defaultValue={defaultValue}
          onBlur={onBlur}
          treeData={treeData}
          showArrow={showArrow}
          style={style}
          treeCheckable={true}
          maxTagCount={maxTagCount}
          filterTreeNode={(inputValue: any, treeNode: any) =>
            treeNode && inputValue && treeNode?.title?.toString().toLowerCase().includes(inputValue.toLowerCase())
          }
          onChange={onChange}
          popupClassName={`multi-select-item ${dropdownClassName ? dropdownClassName : ''}`}
          disabled={disabled}
          getPopupContainer={isFixedDropdown ? trigger => trigger.parentNode : undefined}
          virtual={false}
          suffixIcon={iconSuffix}
          value={value}
          {...restProps}
        />
        {textWarning && <div className="required">{textWarning}</div>}
      </div>
    </div>
  );
}

const selectAllItem: any = (onChange: any, options1: any, value: any) => {
  const onSelectAll = () => {
    if (value?.length === options1?.length) {
      onChange && onChange([]);
    } else {
      const newSelect: string[] = options1?.map((item: any) => item.value);
      onChange && onChange(newSelect);
    }
  };
  return {
    value: 'all',
    title: (
      <div className="select-all__block">
        <Checkbox
          onChange={onSelectAll}
          items={[{ value: 'checkall', label: '全て' }]}
          value={value?.length === options1?.length ? ['checkall'] : []}
        />
      </div>
    ),
    key: 'all',
    disableCheckbox: true,
    disabled: true,
  };
};
