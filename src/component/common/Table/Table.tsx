import './Table.scss';
import { Table as TableCommon } from 'antd';
import { KEYS_DISABLED_SELECT_TABLE_ROW, SORT_MESSAGE } from 'src/app/constant';
import { useEffect, useState } from 'react';
import { handleDataTable } from './handleDataTb';
import { listKeyNameT } from 'src/models';

interface TablePropsT {
  data: any;
  className?: string;
  scroll?: { x: string | number | true; y: string | number };
  listKeyName: listKeyNameT;
  handleClickSorter?: (data: any) => void;
  selectedRowKeys?: React.Key[];
  onSelectChange?: (data: React.Key[], listData?: any[]) => void;
  onActionItemById?: (id: string, actionType: number) => void;
  isHiddenRowSelection?: boolean;
}

export default function Table(props: TablePropsT) {
  const {
    className = '',
    data,
    scroll,
    listKeyName,
    handleClickSorter,
    selectedRowKeys,
    onSelectChange,
    onActionItemById = () => null,
    isHiddenRowSelection = false,
  } = props;
  const [columns, setColumns] = useState<any>([]);
  const [dataSource, setDataSource] = useState<any>([]);
  useEffect(() => {
    if (listKeyName?.keys?.length > 0) {
      const dataColumn: any = handleDataTable.customColumn(listKeyName.keys, data);
      setDataSource(dataColumn);
    }
    if (listKeyName?.names?.length > 0) {
      const dataHeader: any = handleDataTable.customHeaderTb(
        listKeyName.names,
        listKeyName.keys,
        handleClickSorter,
        onActionItemById,
      );
      setColumns(dataHeader);
    }
  }, [listKeyName, data]);

  function preGetCheckboxProps(record: any) {
    if (Object.prototype.hasOwnProperty.call(record, KEYS_DISABLED_SELECT_TABLE_ROW.ADMIN_MANAGEMENT.KEY)) {
      return {
        disabled: !record[KEYS_DISABLED_SELECT_TABLE_ROW.ADMIN_MANAGEMENT.value],
      };
    } else if (
      Object.prototype.hasOwnProperty.call(record, KEYS_DISABLED_SELECT_TABLE_ROW.COMPANY_ADD_DOCUMENT__GET_GROUPS.KEY)
    ) {
      return {
        disabled: !record[KEYS_DISABLED_SELECT_TABLE_ROW.COMPANY_ADD_DOCUMENT__GET_GROUPS.value],
      };
    } else if (
      Object.prototype.hasOwnProperty.call(record, KEYS_DISABLED_SELECT_TABLE_ROW.COMPANY_ADMIN_MANAGEMENT.KEY)
    ) {
      return {
        disabled: !record[KEYS_DISABLED_SELECT_TABLE_ROW.COMPANY_ADMIN_MANAGEMENT.value],
      };
    } else if (Object.prototype.hasOwnProperty.call(record, KEYS_DISABLED_SELECT_TABLE_ROW.COMPANY_GROUP.KEY)) {
      return {
        disabled: !record[KEYS_DISABLED_SELECT_TABLE_ROW.COMPANY_GROUP.value],
      };
    }
    return {};
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: (event: React.Key[]) => (onSelectChange ? onSelectChange(event, dataSource) : null),
    getCheckboxProps: (record: any) => preGetCheckboxProps(record),
  };

  return (
    <>
      <TableCommon
        className={`table-root ${className ? className : ''}`}
        columns={columns}
        pagination={false}
        dataSource={dataSource}
        scroll={scroll}
        locale={{
          triggerAsc: SORT_MESSAGE.ASCENDING,
          triggerDesc: SORT_MESSAGE.DESCENDING,
          cancelSort: SORT_MESSAGE.CANCEL,
        }}
        showSorterTooltip={false}
        rowSelection={!isHiddenRowSelection ? rowSelection : undefined}
      />
    </>
  );
}
