export interface listKeyNameT {
  names: string[];
  keys: listKeyT[];
}

export interface listKeyT {
  keyName: string;
  sorter: boolean;
  child?: any;
}

export interface dataBtnT {
  name: string;
  link: string;
  type: string;
}

export interface searchSettingT {
  label: string | string[]; // text show browser
  key: string | string[]; // key call api
  type: 'input' | 'date' | 'select' | 'multiSelect' | string;
  maxLength?: number;
  optionsList?: any;
  defaultValue?: string | number | { startDate: string; endDate: string };
  disabled?: boolean;
  disabledRangeDates?: boolean[];
  showTimeArray?: boolean[];
  formatDatetimepickers?: string[];
  placeHolder?: string;
}
[];
