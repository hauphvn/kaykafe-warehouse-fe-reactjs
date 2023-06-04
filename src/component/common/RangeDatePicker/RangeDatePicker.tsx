import { DatePicker as DatePickerBase } from 'antd';
const { RangePicker } = DatePickerBase;
import './RangeDatePicker.scss';
import 'moment/locale/ja';
import locale from 'antd/es/date-picker/locale/ja_JP';
import { DATE_FORMAT } from 'src/app/constant';

interface RangePickerProps {
  onChange?: (value: any) => void;
  placeholder?: string;
  label?: string;
  value?: any;
}

export default function RangeDatePicker(props: RangePickerProps) {
  const { onChange, label, value } = props;
  return (
    <div className="range-date-picker-root">
      {/*// eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore */}
      <div className="label">{label}</div>
      <RangePicker
        className="range-date-picker"
        placeholder={[DATE_FORMAT, DATE_FORMAT]}
        locale={locale}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
