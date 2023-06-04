import moment from 'moment';
import { ELEMENT_LIST_SEARCH } from 'src/app/constant';
import { AutoComplete, Button, DatePicker, DatePickers, Input, MultipleSelect, Select } from 'src/component/common';
import { searchSettingT } from 'src/models';
import { convertDateEnd, convertDateJP, convertDateStart, convertDateStartWithoutSelectHour } from 'src/ultils/common';
import './SearchSetting.scss';
import iconSearch from 'src/assets/svg/icon-search.svg';
import { useEffect } from 'react';

interface SearchSettingPropsT {
  searchList: searchSettingT[] | undefined;
  isShowCsv?: boolean;
  onSearch: (value: any) => void;
  onDownLoadCsv: () => void;
  listSearch: any;
  setListSearch: (data: any) => void;
  onChange?: (dataChange: any) => void;
}

function SearchSetting(props: SearchSettingPropsT) {
  const {
    searchList,
    isShowCsv = false,
    onSearch,
    onDownLoadCsv,
    listSearch,
    setListSearch,
    onChange = () => null,
  } = props;
  useEffect(() => {
    onChange(listSearch);
  }, [listSearch]);

  function preOnSearch() {
    let listSearchCurrent = listSearch;
    searchList?.forEach((item: any) => {
      if (item?.disabled) {
        listSearchCurrent = {
          ...listSearch,
          [item.key]: '',
        };
      }
    });
    setListSearch(listSearchCurrent);
    return onSearch(listSearchCurrent);
  }

  return (
    <div className="search-root">
      <div className="search-place">
        {searchList?.map((item: any, index: number) => {
          switch (item.type) {
            case ELEMENT_LIST_SEARCH.INPUT:
              return (
                <Input
                  placeholder={item?.placeHolder}
                  key={index}
                  value={!item?.disabled ? listSearch[item.key] : ''}
                  label={item.label}
                  onChange={e => {
                    setListSearch({ ...listSearch, [item.key]: e.target.value });
                  }}
                  allowClear={true}
                  maxLength={item.maxLength || 50}
                  disable={item?.disabled}
                />
              );
            case ELEMENT_LIST_SEARCH.DATE:
              return (
                <DatePicker
                  placeholder={item?.placeholder}
                  key={index}
                  label={item.label}
                  value={listSearch[item.key] ? moment(listSearch[item.key]) : null}
                  onChange={e => {
                    setListSearch({ ...listSearch, [item.key]: convertDateJP(e) });
                  }}
                />
              );
            case ELEMENT_LIST_SEARCH.RANGE_DATE:
              return (
                <DatePickers
                  defaultValue={item?.defaultValue}
                  key={index}
                  label={item.label}
                  value={listSearch[item.key]}
                  onChange={value => {
                    setListSearch({
                      ...listSearch,
                      [item.key[0]]:
                        item?.showTimeArray && item?.showTimeArray[0]
                          ? convertDateStart(value?.startDate)
                          : convertDateStartWithoutSelectHour(value?.startDate),
                      [item.key[1]]: convertDateEnd(value?.endDate),
                    });
                  }}
                  allowClear={true}
                  disabledDates={item?.disabledRangeDates}
                />
              );

            case ELEMENT_LIST_SEARCH.SELECT:
              return (
                <Select
                  key={index}
                  label={item.label}
                  handleChange={e => {
                    setListSearch({ ...listSearch, [item.key]: e ? e : '' });
                  }}
                  options={item.optionsList}
                  allowClear={true}
                  defaultValue={item?.defaultValue}
                  disabled={item?.disabled}
                />
              );
            case ELEMENT_LIST_SEARCH.MULTI_SELECT:
              return (
                <MultipleSelect
                  key={index}
                  label={item.label}
                  onChange={e => {
                    setListSearch({ ...listSearch, [item.key]: e });
                  }}
                  value={listSearch[item.key]}
                  options={item.optionsList}
                  dropdownClassName="multi-select-search-setting"
                  maxTagCount={'responsive'}
                  disabled={item?.disabled}
                  placeholder={item?.placeHolder}
                  defaultValue={item?.defaultValue}
                />
              );
            case ELEMENT_LIST_SEARCH.AUTOCOMPLETE:
              return (
                <AutoComplete
                  placeholder={item?.placeHolder}
                  key={index}
                  options={item.optionsList}
                  value={listSearch[item.key]}
                  onChange={e => {
                    setListSearch({ ...listSearch, [item.key]: e });
                  }}
                  label={item.label}
                />
              );
            default:
              return null;
          }
        })}
      </div>
      <div className="submit-place">
        <Button name="検索" onClick={preOnSearch} icon={<img src={iconSearch} alt="icon" />} iconSide="left" />
        {isShowCsv && <Button name="CSV" onClick={onDownLoadCsv} />}
      </div>
    </div>
  );
}

export default SearchSetting;
