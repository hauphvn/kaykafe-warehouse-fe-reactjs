import { Table, Toast } from 'src/component/common';
import { Pagination } from 'src/component/common';
import SearchSetting from 'src/component/layout/SearchSetting/SearchSetting';
import { listKeyNameT, searchSettingT } from 'src/models';
import './TableLayout.scss';
import TableRowAction, { TableRowActionPropsT, TypeActionTableRowShowT } from './TableRowAction';
import { useTableLayout } from './useTableLayout';
import { ReactNode, useEffect } from 'react';
import { useAppDispatch } from 'src/app/hooks';
import { onSetShowLoading } from 'src/redux/auth/authSlice';

export interface ActionTableFooterT {
  key: string;
  node: ReactNode;
}
interface TableLayoutPropsT {
  tableApiLink: string;
  listKeyName: listKeyNameT;
  searchList?: searchSettingT[] | undefined;
  isShowCsv?: boolean;
  heigthTable?: number;
  onActionItemById?: (id: string, actionType: number, options?: any) => void;
  onSelectedRows?: (newSelectedRowKeys: React.Key[], listData?: any[]) => void;
  actionInfo?: TableRowActionPropsT;
  typeActionShow?: TypeActionTableRowShowT[];
  tableTitle?: string;
  isHiddenEmptyData?: boolean;
  isHiddenRowSelection?: boolean;
  refTableLayout?: any;
  actionsOnTableFooter?: ActionTableFooterT[];
  onChangeFieldSearch?: (dataChange: any) => void;
  defaultParam?: any;
}

function TableLayout(props: TableLayoutPropsT) {
  const dispatch = useAppDispatch();
  const {
    refTableLayout,
    tableApiLink,
    listKeyName,
    searchList,
    isShowCsv,
    heigthTable = 400,
    onActionItemById = () => null,
    onSelectedRows = () => null,
    typeActionShow = [],
    tableTitle = '',
    isHiddenEmptyData = false,
    isHiddenRowSelection = false,
    actionsOnTableFooter = [],
    onChangeFieldSearch = () => null,
    defaultParam = {},
  } = props;
  const {
    // onSelectPageSize,
    listDataApi,
    onChangePagination,
    handleClickSorter,
    isLoading,
    isShowToast,
    queryParams,
    totalData,
    onSelectChange,
    selectedRowKeys,
    searchInfo: { onSearch, onDownLoadCsv, listSearch, setListSearch },
  } = useTableLayout({
    tableApiLink,
    defaultParam,
  });
  useEffect(() => {
    dispatch(onSetShowLoading(isLoading));
  }, [isLoading]);

  function preOnSelectedRows(newSelectedRowKeys: React.Key[], listData?: any[]) {
    onSelectedRows(newSelectedRowKeys, listData);
    onSelectChange(newSelectedRowKeys);
  }
  return isHiddenEmptyData && listDataApi?.length === 0 ? (
    <></>
  ) : (
    <div ref={refTableLayout} className="table-layout-root">
      {searchList && searchList?.length >= 0 && (
        <SearchSetting
          onChange={onChangeFieldSearch}
          searchList={searchList}
          onSearch={onSearch}
          onDownLoadCsv={onDownLoadCsv}
          isShowCsv={isShowCsv}
          listSearch={listSearch}
          setListSearch={setListSearch}
        />
      )}
      <div className="table-layout-container">
        <TableRowAction title={tableTitle} typeActionShow={typeActionShow} />
        <Table
          data={listDataApi}
          listKeyName={listKeyName}
          handleClickSorter={handleClickSorter}
          scroll={{ x: 'max-content', y: heigthTable }}
          onSelectChange={preOnSelectedRows}
          selectedRowKeys={selectedRowKeys}
          onActionItemById={onActionItemById}
          isHiddenRowSelection={isHiddenRowSelection}
        />
        <div className={'table-footer-wrapper'}>
          {actionsOnTableFooter &&
            actionsOnTableFooter?.map((item: ActionTableFooterT) => <div key={item.key}>{item.node}</div>)}
          {+totalData > 0 && (
            <Pagination
              onChange={onChangePagination}
              total={totalData}
              current={queryParams.page}
              pageSize={queryParams.page_size}
              defaultCurrent={1}
            />
          )}
        </div>
      </div>
      <Toast message={isShowToast.message} showToast={isShowToast.show} status={isShowToast.status} />
    </div>
  );
}

export default TableLayout;
