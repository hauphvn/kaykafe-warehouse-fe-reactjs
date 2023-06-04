import { API_PATH, ELEMENT_LIST_SEARCH, TYPE_DOCUMENTS } from 'src/app/constant';
import MainWrapper from 'src/component/layout/MainWrapper/MainWrapper';
import 'src/component/layout/DocumentUser/DocumentUser.scss';
import React, { useEffect, useState } from 'react';
import { TOAST_MESSAGE } from 'src/app/validation_msg';
import { get } from 'src/ultils/request';
import { useAppDispatch } from 'src/app/hooks';
import { onSetShowLoading, onSetToastStatus } from 'src/redux/auth/authSlice';
import { buildParams, getObjsSelectedByKeyFromTable, handleErrorFromResponse } from 'src/ultils/common';
import TableRowAction, { ACTION_TYPE, TypeActionTableRowShowT } from 'src/component/layout/TableLayout/TableRowAction';
import iconDownload from 'src/assets/svg/icon-download-white.svg';
import DOMPurify from 'dompurify';
import { Empty } from 'antd';
import FileSaver from 'file-saver';
import { Pagination, Table } from 'src/component/common';
import SearchSetting from 'src/component/layout/SearchSetting/SearchSetting';
import moment from 'moment/moment';

interface IItemSelected {
  id?: string;
  document_name?: string;
}
function DocumentUser() {
  const dispatch = useAppDispatch();
  const [documentIndividualIdsSelected, setDocumentIndividualIdsSelected] = useState<IItemSelected[]>([]);
  const [documentCommonIdsSelected, setDocumentCommonIdsSelected] = useState<IItemSelected[]>([]);
  const [contentNotification, setContentNotification] = useState('');
  const [listDataIndividual, setListDataIndividual] = useState<any[]>([]);
  const [listDataCommon, setListDataCommon] = useState<any[]>([]);
  const [contentSafe, setContentSafe] = useState<string>('');
  const [totalDataIndividual, setTotalDataIndividual] = useState<number>(0);
  const [totalDataCommon, setTotalDataCommon] = useState<number>(0);
  const [selectedRowKeysIndividual, setSelectedRowKeysIndividual] = useState<React.Key[]>([]);
  const [selectedRowKeysCommon, setSelectedRowKeysCommon] = useState<React.Key[]>([]);
  const [queryParamsIndividual, setQueryParamsIndividual] = useState({
    ordering: '',
    page_size: 25,
    page: 1,
    search: null,
  });
  const [queryParamsCommon, setQueryParamsCommon] = useState({
    ordering: '',
    page_size: 25,
    page: 1,
    search: null,
  });
  const [listSearch, setListSearch] = useState<any>({});

  useEffect(() => {
    const sanitizedHtmlString = DOMPurify.sanitize(contentNotification);
    setContentSafe(sanitizedHtmlString);
  }, [contentNotification]);

  function handleSelectRowKeysIndividual(data: any, listData: any) {
    setSelectedRowKeysIndividual(data);
    const objsSelected: IItemSelected[] = getObjsSelectedByKeyFromTable(data, 'document_name', listData);
    setDocumentIndividualIdsSelected(objsSelected);
  }

  function handleSelectRowKeysCommon(data: any, listData: any) {
    setSelectedRowKeysCommon(data);
    const objsSelected: IItemSelected[] = getObjsSelectedByKeyFromTable(data, 'document_name', listData);
    setDocumentCommonIdsSelected(objsSelected);
  }
  function getDataIndividual(queryParam?: any) {
    dispatch(onSetShowLoading('loading'));
    const params = {
      type: TYPE_DOCUMENTS.INDIVIDUAL,
      ...queryParam,
    };
    get(`${API_PATH.USER_DOCUMENT}?${buildParams(params)}`)
      .then((res: any) => {
        dispatch(onSetShowLoading('idle'));
        if (res && res?.data) {
          setListDataIndividual(res?.data?.data);
          setTotalDataIndividual(res?.data?.count);
        } else {
          dispatch(
            onSetToastStatus({
              message: TOAST_MESSAGE.USER.DOCUMENT.GET_ALL.FAIL,
              showToast: true,
              status: 'error',
            }),
          );
        }
      })
      .catch(err => {
        dispatch(onSetShowLoading('idle'));
        dispatch(
          onSetToastStatus({
            message: handleErrorFromResponse(err, TOAST_MESSAGE.USER.DOCUMENT.GET_ALL.FAIL),
            showToast: true,
            status: 'error',
          }),
        );
      });
  }

  function getDataCommon(queryParam?: any) {
    dispatch(onSetShowLoading('loading'));
    const params = {
      type: TYPE_DOCUMENTS.COMMON,
      ...queryParam,
    };
    get(`${API_PATH.USER_DOCUMENT}?${buildParams(params)}`)
      .then((res: any) => {
        dispatch(onSetShowLoading('idle'));
        if (res && res?.data) {
          setListDataCommon(res?.data?.data);
          setTotalDataCommon(res?.data?.count);
        } else {
          dispatch(
            onSetToastStatus({
              message: TOAST_MESSAGE.USER.DOCUMENT.GET_ALL.FAIL,
              showToast: true,
              status: 'error',
            }),
          );
        }
      })
      .catch(err => {
        dispatch(onSetShowLoading('idle'));
        dispatch(
          onSetToastStatus({
            message: handleErrorFromResponse(err, TOAST_MESSAGE.USER.DOCUMENT.GET_ALL.FAIL),
            showToast: true,
            status: 'error',
          }),
        );
      });
  }

  useEffect(() => {
    getContentNotification();
    getDataIndividual();
    getDataCommon();
  }, []);
  const onChangePaginationIndividual = (page: number) => {
    const newQueryParams = { ...queryParamsIndividual, page: page };
    setQueryParamsIndividual(newQueryParams);
    getDataIndividual(newQueryParams);
  };
  const onChangePaginationCommon = (page: number) => {
    const newQueryParams = { ...queryParamsCommon, page: page };
    setQueryParamsCommon(newQueryParams);
    getDataCommon(newQueryParams);
  };

  function onHandleDownloadFromType(isCommon: boolean) {
    dispatch(onSetShowLoading('loading'));
    const promises: any[] = [];
    (isCommon ? documentCommonIdsSelected : documentIndividualIdsSelected)?.forEach((obj: IItemSelected) => {
      const link = `${API_PATH.USER_DOCUMENT_DOWNLOAD}/${obj.id}`;
      promises.push(
        get(link).then((res: any) => {
          if (res && res?.data) {
            FileSaver.saveAs(res?.data?.url, obj.document_name);
          }
        }),
      );
    });
    Promise.all(promises)
      .then(() => {
        if (isCommon) {
          setDocumentCommonIdsSelected([]);
          setSelectedRowKeysCommon([]);
        } else {
          setDocumentIndividualIdsSelected([]);
          setSelectedRowKeysIndividual([]);
        }
        dispatch(onSetShowLoading('idle'));
      })
      .catch(err => {
        dispatch(onSetShowLoading('idle'));
        dispatch(
          onSetToastStatus({
            message: handleErrorFromResponse(err, TOAST_MESSAGE.USER.DOWNLOAD.DOCUMENT.FAIL),
            showToast: true,
            status: 'error',
          }),
        );
      });
  }
  const handleClickSorter = (data: any, isCommon: boolean) => {
    if (isCommon) {
      setQueryParamsCommon(pre => {
        let orderKey = '';
        if (pre.ordering === '-' + data.key) {
          orderKey = '';
        } else if (data?.key !== pre.ordering) {
          orderKey = data.key;
        } else if (data?.key === pre.ordering) {
          orderKey = '-' + data.key;
        }
        const newQueryParams = { ...pre, ordering: orderKey, page: 1 };
        getDataCommon(newQueryParams);
        return newQueryParams;
      });
    } else {
      setQueryParamsIndividual(pre => {
        let orderKey = '';
        if (pre.ordering === '-' + data.key) {
          orderKey = '';
        } else if (data?.key !== pre.ordering) {
          orderKey = data.key;
        } else if (data?.key === pre.ordering) {
          orderKey = '-' + data.key;
        }
        const newQueryParams = { ...pre, ordering: orderKey, page: 1 };
        getDataIndividual(newQueryParams);
        return newQueryParams;
      });
    }
  };
  const actionTablesIndividual: TypeActionTableRowShowT[] = [
    {
      key: '1',
      label: 'ダウンロード',
      icon: iconDownload,
      onClick: () => onHandleDownloadFromType(false),
      actionType: ACTION_TYPE.DOWNLOAD,
      isDisable: documentIndividualIdsSelected.length === 0,
    },
  ];
  const actionTablesCommon: TypeActionTableRowShowT[] = [
    {
      key: '1',
      label: 'ダウンロード',
      icon: iconDownload,
      onClick: () => onHandleDownloadFromType(true),
      actionType: ACTION_TYPE.DOWNLOAD,
      isDisable: documentCommonIdsSelected.length === 0,
    },
  ];

  function getContentNotification() {
    get(API_PATH.USER_NOTIFICATION)
      .then((res: any) => {
        if (res && res?.data) {
          const contentTemp: string[] = [];
          if (res?.data?.data) {
            res?.data?.data?.forEach((item: any) => {
              contentTemp.push(item?.content + '<br/>');
            });
          }
          setContentNotification(contentTemp.join(' '));
        } else {
          dispatch(
            onSetToastStatus({
              message: TOAST_MESSAGE.COMPANY.NOTICE.GET_LIST.FAIL,
              showToast: true,
              status: 'error',
            }),
          );
        }
      })
      .catch(err => {
        dispatch(
          onSetToastStatus({
            message: handleErrorFromResponse(err, TOAST_MESSAGE.COMPANY.NOTICE.GET_LIST.FAIL),
            showToast: true,
            status: 'error',
          }),
        );
      });
  }

  function onSearch(data: any) {
    getDataIndividual(data);
    getDataCommon(data);
  }

  return (
    <MainWrapper title="お知らせ" className="document-user-root title-top">
      <div className={`notification-wrapper ${!contentNotification ? 'empty-data' : ''}`}>
        {contentNotification ? (
          <div className={'content'}>
            <div dangerouslySetInnerHTML={{ __html: contentSafe }} />
          </div>
        ) : (
          <Empty className={'empty-data'} image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>
      <div className="title-table-top title-top">書類</div>
      <div className="tables-container">
        <SearchSetting
          onChange={() => null}
          onSearch={onSearch}
          onDownLoadCsv={() => null}
          isShowCsv={false}
          searchList={[
            {
              label: '書類名',
              key: 'name',
              type: ELEMENT_LIST_SEARCH.INPUT,
              placeHolder: '書類名を入力して下さい',
            },
            {
              label: ['公開日', ''],
              key: ['start_date', 'end_date'],
              type: ELEMENT_LIST_SEARCH.RANGE_DATE,
              defaultValue: {
                startDate: moment().subtract(1, 'month').toISOString(),
                endDate: moment().add(1, 'month').toISOString(),
              },
              disabledRangeDates: [false, false],
            },
          ]}
          listSearch={listSearch}
          setListSearch={setListSearch}
        />
        <div className={'table table-first'}>
          <div className="table-layout-container">
            <TableRowAction title={'個別文書一覧'} typeActionShow={actionTablesIndividual} />
            <Table
              data={listDataIndividual}
              listKeyName={{
                names: ['書類名', '登録日', '参照期限'],
                keys: [
                  { keyName: 'document_name', sorter: true },
                  // {keyName: 'user_document_name_custom', sorter: true},
                  { keyName: 'public_date', sorter: true },
                  { keyName: 'expire_date', sorter: true },
                  { keyName: 'id', sorter: false },
                ],
              }}
              selectedRowKeys={selectedRowKeysIndividual}
              onSelectChange={handleSelectRowKeysIndividual}
              handleClickSorter={(data: any) => handleClickSorter(data, false)}
            />
            <div className={'table-footer-wrapper'}>
              {+totalDataIndividual > 0 && (
                <Pagination
                  onChange={onChangePaginationIndividual}
                  total={totalDataIndividual}
                  current={queryParamsIndividual.page}
                  pageSize={queryParamsIndividual.page_size}
                  defaultCurrent={1}
                />
              )}
            </div>
          </div>
        </div>
        <div className={'table table-second'}>
          <div className="table-layout-container">
            <TableRowAction title={'共通文書一覧'} typeActionShow={actionTablesCommon} />
            <Table
              data={listDataCommon}
              listKeyName={{
                names: ['書類名', '登録日', '参照期限'],
                keys: [
                  { keyName: 'document_name', sorter: true },
                  // {keyName: 'user_document_name_custom', sorter: true},
                  { keyName: 'public_date', sorter: true },
                  { keyName: 'expire_date', sorter: true },
                  { keyName: 'id', sorter: false },
                ],
              }}
              selectedRowKeys={selectedRowKeysCommon}
              onSelectChange={handleSelectRowKeysCommon}
              handleClickSorter={(data: any) => handleClickSorter(data, true)}
            />
            <div className={'table-footer-wrapper'}>
              {+totalDataCommon > 0 && (
                <Pagination
                  onChange={onChangePaginationCommon}
                  total={totalDataCommon}
                  current={queryParamsCommon.page}
                  pageSize={queryParamsCommon.page_size}
                  defaultCurrent={1}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </MainWrapper>
  );
}

export default DocumentUser;
