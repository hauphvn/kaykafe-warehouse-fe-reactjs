import { DatePicker as DatePickerBase } from 'antd';
import './DatePicker.scss';
import moment from 'moment';
import { DATE_FORMAT, FORMAT_DATE_TIME } from 'src/app/constant';
import 'moment/locale/ja';
import locale from 'antd/es/date-picker/locale/ja_JP';
import iconDatePicker from 'src/assets/svg/icon-calendar.svg';

moment.updateLocale('ja', {
  weekdaysMin: '日_月_火_水_木_金_土'.split('_'),
  months: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
  monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
});

interface DatePickerPropsT {
  format?: string;
  onChange: (value: any) => void;
  onSelect?: (value: any) => void;
  onBlur?: (value: any) => void;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
  name?: string;
  value?: any;
  label?: string;
  textWarning?: string;
  required?: boolean;
  disabled?: boolean;
  showTime?: boolean;
  disabledDate?: any;
  disabledTime?: any;
  allowClear?: boolean;
  customFormatShowTime?: { format: string };
}

export default function DatePicker(props: DatePickerPropsT) {
  const {
    format,
    onChange,
    placeholder = '',
    defaultValue,
    className = '',
    name = '',
    value,
    onBlur,
    label,
    textWarning,
    required,
    disabled,
    showTime,
    disabledDate,
    disabledTime,
    allowClear,
    onSelect,
    customFormatShowTime = { format: FORMAT_DATE_TIME.HOUR_MINUTE },
  } = props;
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <div className={`datepicker-root ${className} ${required ? 'datepicker-required' : ''}`}>
      <div className="label">{label}</div>
      <div className="datepicker-wrapper">
        <DatePickerBase
          onSelect={onSelect}
          value={value ? value : undefined}
          name={name}
          defaultValue={defaultValue ? moment(defaultValue, format) : undefined}
          className={`datepicker-item ${className}`}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={(e: any) => (onBlur ? onBlur(e) : null)}
          showTime={showTime ? customFormatShowTime : false}
          format={showTime ? format : FORMAT_DATE_TIME.DATE_FULL_SLASH}
          locale={locale}
          disabled={disabled}
          inputReadOnly={true}
          suffixIcon={<img src={iconDatePicker} alt="icon date" />}
          disabledDate={disabledDate}
          allowClear={allowClear}
          disabledTime={disabledTime}
        />
        {textWarning && <div className="required">{textWarning}</div>}
      </div>
    </div>
  );
}

DatePicker.defaultProps = {
  format: DATE_FORMAT,
};
