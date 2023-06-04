import moment from 'moment';
import { useEffect, useState } from 'react';
import { DatePicker } from 'src/component/common';
import './DatePickers.scss';
import iconTo from 'src/assets/svg/icon-to.svg';
import { FORMAT_DATE_TIME } from 'src/app/constant';

interface DatePickersPropsT {
  defaultValue?: { startDate: string; endDate: string };
  onChange?: (value: any) => void;
  onSelect?: (value: any) => void;
  label: string[];
  value?: any;
  showTimeArray?: boolean[];
  allowClear?: boolean;
  disabledDates?: boolean[];
  customFormatShowTimes?: [{ format: string } | undefined, { format: string } | undefined];
  disabled?: boolean[];
  formats?: string[];
}

function DatePickers(props: DatePickersPropsT) {
  const {
    defaultValue,
    onChange,
    label,
    value,
    showTimeArray = [false, false],
    onSelect,
    allowClear,
    disabledDates = [true, true],
    customFormatShowTimes,
    disabled = [false, false],
    formats = [FORMAT_DATE_TIME.DATE_FULL_SLASH, FORMAT_DATE_TIME.DATE_FULL_SLASH],
  } = props;
  const [listSearch, setListSearch] = useState({ startDate: '', endDate: '' });
  useEffect(() => {
    if (value?.startDate || value?.endDate) {
      setListSearch(value);
    }
  }, [value?.startDate, value?.endDate]);
  useEffect(() => {
    if (defaultValue?.startDate || defaultValue?.endDate) {
      setListSearch(defaultValue);
    }
  }, []);

  useEffect(() => {
    if (listSearch?.startDate || listSearch?.endDate) {
      onChange && onChange(listSearch);
      if (onSelect) {
        onSelect(listSearch);
      }
    }
  }, [listSearch]);

  function disabledEndDate(current: any) {
    if (disabledDates[1]) {
      const start = moment(listSearch.startDate);
      return current && (current < start.startOf('day') || current < moment().subtract(1, 'days').endOf('day'));
    }
  }

  function disabledStartDate(current: any) {
    if (disabledDates[0]) {
      const end = moment(listSearch.endDate);
      return (
        current &&
        (current > end.subtract(-1, 'days').startOf('day') || current < moment().subtract(1, 'days').endOf('day'))
      );
    }
  }

  // console.log('listsearch :', listSearch);
  return (
    <div className="datepickers-root">
      <DatePicker
        onSelect={e => {
          setListSearch({
            ...listSearch,
            startDate: e,
          });
        }}
        showTime={showTimeArray[0]}
        format={FORMAT_DATE_TIME.DATE_TIME_TEXT_MINUTE}
        label={label[0] || ''}
        value={listSearch.startDate ? moment(listSearch.startDate) : null}
        onChange={e => {
          setListSearch({
            ...listSearch,
            startDate: e,
          });
        }}
        disabledDate={(current: any) => disabledStartDate(current)}
        allowClear={allowClear}
        customFormatShowTime={customFormatShowTimes ? customFormatShowTimes[0] : undefined}
        disabled={disabled[0]}
      />
      <img className="img" src={iconTo} alt="icon" />
      <DatePicker
        onSelect={e => {
          setListSearch({
            ...listSearch,
            endDate: e,
          });
        }}
        format={formats[1]}
        showTime={showTimeArray[1]}
        label={label[1] || ''}
        value={listSearch?.endDate ? moment(listSearch?.endDate) : null}
        onChange={e => {
          setListSearch({ ...listSearch, endDate: e });
        }}
        disabledDate={(current: any) => disabledEndDate(current)}
        allowClear={allowClear}
        customFormatShowTime={customFormatShowTimes ? customFormatShowTimes[1] : undefined}
        disabled={disabled[1]}
      />
    </div>
  );
}

export default DatePickers;
