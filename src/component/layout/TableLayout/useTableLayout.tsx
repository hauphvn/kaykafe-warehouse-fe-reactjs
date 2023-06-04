import { useEffect, useState } from 'react';
import { getDataTableList } from 'src/api/tableApi';
import { TOAST_MESSAGE, TOAST_STATUS } from 'src/app/validation_msg';
import { handleErrorFromResponse, objIsEmpty } from 'src/ultils/common';
import { tableSelector } from 'src/redux/table/tableSelector';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { onReLoadDataTableByLink } from 'src/redux/table/tableSlice';

interface UseTableLayoutPropsT {
  tableApiLink: string;
  defaultParam?: any;
}

export const useTableLayout = (props: UseTableLayoutPropsT) => {
  const { tableApiLink, defaultParam } = props;
  const [href, setHref] = useState('');
  const [queryParams, setQueryParams] = useState({ ordering: '', page_size: 25, page: 1, search: null });
  const [listDataApi, setListDataApi] = useState([]);
  const [isLoading, setIsLoading] = useState('idle');
  const [totalData, setTotalData] = useState(1);
  const [isShowToast, setIsShowToast] = useState({ show: false, status: '', message: '' });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [listSearch, setListSearch] = useState<any>({});
  const { reLoadLink } = useAppSelector(tableSelector);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (reLoadLink?.isCreate || reLoadLink?.isDelete) {
      const initParams = { ordering: '', page_size: 25, page: 1, search: null };
      setQueryParams(initParams);
      onGetDataTable(href, initParams);
      dispatch(
        onReLoadDataTableByLink({
          isCreate: false,
          isEdit: false,
          isDelete: false,
        }),
      );
      onSelectChange([]);
    } else if (reLoadLink?.isEdit) {
      onGetDataTable(href, queryParams);
      dispatch(
        onReLoadDataTableByLink({
          isCreate: false,
          isEdit: false,
          isDelete: false,
        }),
      );
    }
    if (reLoadLink?.isResetSelected) {
      if (selectedRowKeys?.length > 0) {
        setSelectedRowKeys([]);
      }
      dispatch(
        onReLoadDataTableByLink({
          isResetSelected: false,
        }),
      );
    }
  }, [reLoadLink]);
  useEffect(() => {
    setHref(tableApiLink);
  }, [tableApiLink]);

  useEffect(() => {
    if (href) {
      onGetDataTable(href, queryParams);
    }
  }, [href]);

  const onGetDataTable = (link: string, data: any) => {
    let newData = {};
    if (objIsEmpty(data.search)) {
      newData = { ordering: data.ordering, page_size: data.page_size, page: data.page };
    } else {
      newData = { ordering: data.ordering, page_size: data.page_size, page: data.page, ...data.search };
    }
    setIsLoading('loading');
    getDataTableList({ link, queryParam: newData, defaultParam: defaultParam })
      .then((res: any) => {
        setListDataApi(res?.data);
        setTotalData(res?.count);
        setIsLoading('idle');
      })
      .catch(err => {
        handleShowToast(TOAST_STATUS.ERROR, handleErrorFromResponse(err, TOAST_MESSAGE.GET_FAIL));
        setIsLoading('failed');
      });
  };
  const onSelectPageSize = (data: any) => {
    const newQueryParams = { ...queryParams, page_size: +data, page: 1 };
    setQueryParams(newQueryParams);
    onGetDataTable(href, newQueryParams);
  };
  const onChangePagination = (data: any) => {
    const newQueryParams = { ...queryParams, page: +data };
    setQueryParams(newQueryParams);
    onGetDataTable(href, newQueryParams);
  };
  const onSearch = (data: any) => {
    const newQueryParams = { ...queryParams, search: data, page: 1 };
    setQueryParams(newQueryParams);
    onGetDataTable(href, newQueryParams);
  };
  const onDownLoadCsv = () => {
    // console.log('listDataApi', listDataApi);
    return;
  };

  const handleClickSorter = (data: any) => {
    setQueryParams(pre => {
      let orderKey = '';
      if (pre.ordering === '-' + data.key) {
        orderKey = '';
      } else if (data?.key !== pre.ordering) {
        orderKey = data.key;
      } else if (data?.key === pre.ordering) {
        orderKey = '-' + data.key;
      }
      const newQueryParams = { ...pre, ordering: orderKey, page: 1 };
      onGetDataTable(tableApiLink, newQueryParams);
      return newQueryParams;
    });
  };

  function handleShowToast(status: string, message: string) {
    setIsShowToast({ show: true, status, message });
    setTimeout(() => {
      setIsShowToast({ ...isShowToast, show: false });
    });
  }

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  return {
    onSelectPageSize,
    listDataApi,
    onChangePagination,
    handleClickSorter,
    isLoading,
    isShowToast,
    queryParams,
    totalData,
    onSelectChange,
    selectedRowKeys,
    searchInfo: {
      listSearch,
      setListSearch,
      onSearch,
      onDownLoadCsv,
    },
  };
};
