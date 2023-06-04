import {
  ACTION_ITEM_TABLE,
  API_PATH,
  COMPANY_DOCUMENT_STATUS_STRING,
  ELEMENT_LIST_SEARCH,
  NAVIGATION_PATH,
  OPTIONS_DOCUMENT_NOTIFICATION,
  OPTIONS_DOCUMENT_TYPE,
  TYPE_COMMON_GET_ALL_API,
  TYPE_DOCUMENTS,
} from 'src/app/constant';
import TableLayout from 'src/component/layout/TableLayout/TableLayout';
import MainWrapper from 'src/component/layout/MainWrapper/MainWrapper';
import './Document.scss';
import { ModalDelete } from 'src/component/common';
import { useEffect, useState } from 'react';
import { MSG_CONFIRM, TOAST_MESSAGE } from 'src/app/validation_msg';
import { del, get } from 'src/ultils/request';
import { useAppDispatch } from 'src/app/hooks';
import { onSetShowLoading, onSetToastStatus } from 'src/redux/auth/authSlice';
import { onReLoadDataTableByLink } from 'src/redux/table/tableSlice';
import {
  convertDateJP,
  convertDateStartWithoutSelectHour,
  getIdsSelectedByKeyFromTable,
  handleErrorFromResponse,
} from 'src/ultils/common';
import { useNavigate } from 'react-router-dom';
import { ACTION_TYPE, TypeActionTableRowShowT } from 'src/component/layout/TableLayout/TableRowAction';
import iconAddNew from 'src/assets/svg/icon-add-new.svg';
import iconRecycle from 'src/assets/svg/icon-recycle.svg';
import moment from 'moment';
import EditCommonDocument from 'src/component/layout/Document/Edit/Common/EditCommonDocument';
import { IFile } from 'src/component/layout/Document/New/DocumentNew';
import EditIndividualDocument from 'src/component/layout/Document/Edit/Individual/EditIndividualDocument';
import ErrorNotification, {
  IErrorNotification,
  IListDataErrorNotification,
} from 'src/component/layout/Document/ErrorNotification/ErrorNotification';

export interface IItemDocumentSelected {
  dataBody?: {
    id?: string;
    documentType: string;
    authorizer: string;
    groupIds: string[];
    publicDate: string;
    expireDate: string;
    documentName: string;
    representative?: string;
    approvalStatus?: string;
  };
  showModalCommon?: boolean;
  showModalIndividual?: boolean;
}

export interface IItemOption {
  value: string;
  text: string;
}

function Document() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showModalConfirmDel, setShowModalConfirmDel] = useState(false);
  const [documentIdsSelected, setDocumentIdsSelected] = useState<string[]>([]);
  const [disabledDocumentTypeField, setDisabledDocumentTypeField] = useState(true);
  const [groupOptions, setGroupOptions] = useState<IItemOption[]>([]);
  const [authorizerOptions, setAuthorizerOptions] = useState<IItemOption[]>([]);
  const [notificationErrorItem, setNotificationErrorItem] = useState<IErrorNotification>({
    showModal: false,
    data: [],
  });
  const [itemSelected, setItemSelected] = useState<IItemDocumentSelected>({
    showModalIndividual: false,
    showModalCommon: false,
  });
  const actionTables: TypeActionTableRowShowT[] = [
    {
      key: '1',
      label: '削除',
      icon: iconRecycle,
      onClick: () => setShowModalConfirmDel(true),
      actionType: ACTION_TYPE.DELETE,
      isDisable: documentIdsSelected.length === 0,
    },
    {
      key: '2',
      label: '新規登録',
      icon: iconAddNew,
      onClick: () => navigate(NAVIGATION_PATH.NEW_DOCUMENT),
    },
  ];

  useEffect(() => {
    getGroupOptions();
    getAuthorizerList();
  }, []);

  function getAuthorizerList() {
    dispatch(onSetShowLoading('loading'));
    get(`${API_PATH.COMMON}?type=${TYPE_COMMON_GET_ALL_API.USER_ADMIN}`)
      .then((author: any) => {
        const authorizers = author?.data?.data;
        const items: IItemOption[] = [];
        authorizers.forEach((item: any) => {
          const option: IItemOption = {
            value: item?.id,
            text: item?.value,
          };
          items.push(option);
        });
        setAuthorizerOptions(items);
        dispatch(onSetShowLoading('idle'));
      })
      .catch(err => {
        onDispatchErrorResponse(handleErrorFromResponse(err, TOAST_MESSAGE.COMPANY.DOCUMENT.GET_AUTHORIZER.FAIL));
        dispatch(onSetShowLoading('idle'));
      });
  }

  function handleAgreeDeleteNoties() {
    dispatch(onSetShowLoading('loading'));
    return del(`${API_PATH.COMPANY_DOCUMENT}`, documentIdsSelected)
      .then((res: any) => {
        dispatch(onSetShowLoading('idle'));
        if (res && res?.status === 200) {
          setShowModalConfirmDel(false);
          dispatch(
            onSetToastStatus({
              message: TOAST_MESSAGE.COMPANY.DOCUMENT.DELETE.SUCCESS,
              showToast: true,
              status: 'success',
            }),
          );
          setDocumentIdsSelected([]);
          dispatch(onReLoadDataTableByLink({ isDelete: true }));
        } else {
          dispatch(
            onSetToastStatus({
              message: TOAST_MESSAGE.COMPANY.DOCUMENT.DELETE.FAIL,
              showToast: true,
              status: 'error',
            }),
          );
        }
      })
      .catch(err => {
        dispatch(onSetShowLoading('idle'));
        onDispatchErrorResponse(handleErrorFromResponse(err, TOAST_MESSAGE.COMPANY.DOCUMENT.DELETE.FAIL));
      });
  }

  function onDispatchErrorResponse(message: string) {
    dispatch(onSetShowLoading('idle'));
    dispatch(
      onSetToastStatus({
        message: message,
        showToast: true,
        status: 'error',
      }),
    );
  }

  function handleSelectRowKeys(key: React.Key[], listData?: any[]) {
    const idsSelected: string[] = getIdsSelectedByKeyFromTable(key, listData);
    setDocumentIdsSelected(idsSelected);
  }

  function handleOnChangeFieldSearch(dataChange: any) {
    if (dataChange?.document_type) {
      setDisabledDocumentTypeField(+dataChange?.document_type === +TYPE_DOCUMENTS.COMMON);
    } else {
      setDisabledDocumentTypeField(true);
    }
  }

  function getGroupOptions() {
    dispatch(onSetShowLoading('loading'));
    get(`${API_PATH.COMMON}?type=${TYPE_COMMON_GET_ALL_API.ALL_GROUP}`)
      .then((res: any) => {
        if (res && res?.data) {
          const items: IItemOption[] = [];
          res?.data?.data?.map((item: any) => {
            items.push({
              value: item?.id,
              text: item?.value,
            });
          });
          setGroupOptions(items);
        } else {
          dispatch(onSetShowLoading('idle'));
          dispatch(
            onSetToastStatus({
              message: TOAST_MESSAGE.COMPANY.USER.GET_LIST.GROUP.ERROR,
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
            message: handleErrorFromResponse(err, TOAST_MESSAGE.COMPANY.USER.GET_LIST.GROUP.ERROR),
            showToast: true,
            status: 'error',
          }),
        );
      });
  }

  function onGetErrorNotificationById(id: string) {
    dispatch(onSetShowLoading('loading'));
    get(`${API_PATH.COMPANY_DOCUMENT_ERROR_NOTIFICATION}/${id}`)
      .then((res: any) => {
        dispatch(onSetShowLoading('idle'));
        if (res && res?.data) {
          const dataError: IListDataErrorNotification[] = [];
          res?.data?.forEach((item: any, index: number) => {
            dataError.push({
              no: index + 1 + '',
              name: item?.name,
              method: item?.method,
              address: item?.address,
            });
          });
          setNotificationErrorItem({
            data: dataError,
            showModal: true,
          });
        } else {
          dispatch(
            onSetToastStatus({
              message: TOAST_MESSAGE.COMPANY.NOTIFICATION.ERROR_LIST.GET_ALL.FAIL,
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
            message: handleErrorFromResponse(err, TOAST_MESSAGE.COMPANY.NOTIFICATION.ERROR_LIST.GET_ALL.FAIL),
            showToast: true,
            status: 'error',
          }),
        );
      });
  }

  function handleActionItemById(id: string, actionType: number) {
    if (actionType === ACTION_ITEM_TABLE.EDIT) {
      dispatch(onSetShowLoading('loading'));
      get(`${API_PATH.COMPANY_DOCUMENT}/${id}`)
        .then((res: any) => {
          if (res && res?.data) {
            setItemSelected({
              showModalCommon: +res?.data?.document_type === +TYPE_DOCUMENTS.COMMON,
              showModalIndividual: +res?.data?.document_type === +TYPE_DOCUMENTS.INDIVIDUAL,
              dataBody: {
                id,
                documentType: res?.data?.document_type,
                authorizer: res?.data?.approver_id,
                groupIds: res?.data?.group_ids,
                publicDate: res?.data?.public_date,
                expireDate: res?.data?.expire_date,
                documentName: res?.data?.document_name,
                representative: res?.data?.representative_name,
                approvalStatus: res?.data?.approval_status,
              },
            });
            dispatch(onSetShowLoading('idle'));
          } else {
            onDispatchErrorResponse(TOAST_MESSAGE.COMPANY.DOCUMENT.GET_DETAIL.FAIL);
          }
        })
        .catch(err => {
          onDispatchErrorResponse(handleErrorFromResponse(err, TOAST_MESSAGE.COMPANY.DOCUMENT.GET_DETAIL.FAIL));
        });
    } else if (actionType === ACTION_ITEM_TABLE.SHOW_ERROR_NOTIFICATION) {
      onGetErrorNotificationById(id);
    }
  }

  function onHandleEditItem(dataEdit: { dataBody: any; file: IFile[] }) {
    setItemSelected(prevState => ({
      ...prevState,
      showModalCommon: false,
      showModalIndividual: false,
    }));
    if (dataEdit.dataBody) {
      dispatch(onReLoadDataTableByLink({ isEdit: true }));
    }
  }

  return (
    <MainWrapper title="書類管理" className="document-root">
      <TableLayout
        defaultParam={{
          type: TYPE_DOCUMENTS.COMMON,
          start_date: convertDateStartWithoutSelectHour(moment().subtract(1, 'month').subtract('1', 'day')),
          end_date: convertDateJP(moment().add(1, 'month')),
        }}
        onChangeFieldSearch={handleOnChangeFieldSearch}
        tableTitle={'書類一覧'}
        tableApiLink={API_PATH.COMPANY_DOCUMENT}
        listKeyName={{
          names: ['書類名', '書類種類', '公開日時', '参照期限', 'ステータス', ' ユーザー\n（グループ）', '通知'],
          keys: [
            { keyName: 'document_name', sorter: true },
            { keyName: 'document_type', sorter: true },
            { keyName: 'public_date', sorter: true },
            { keyName: 'expired_date', sorter: true },
            { keyName: 'approval_status', sorter: true },
            { keyName: 'user_group', sorter: true },
            { keyName: 'notification', sorter: true },
            { keyName: 'id', sorter: false },
          ],
        }}
        searchList={[
          {
            label: '書類種類',
            key: 'document_type',
            type: ELEMENT_LIST_SEARCH.SELECT,
            optionsList: OPTIONS_DOCUMENT_TYPE,
            defaultValue: TYPE_DOCUMENTS.COMMON,
          },
          {
            label: '書類名',
            key: 'document_name',
            type: ELEMENT_LIST_SEARCH.INPUT,
            placeHolder: '書類名を入力して下さい',
          },
          {
            label: '書類名（代表）',
            key: 'representative_name',
            type: ELEMENT_LIST_SEARCH.INPUT,
            disabled: disabledDocumentTypeField,
            placeHolder: '書類名（代表）を入力して下さい',
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
          {
            label: 'ユーザーID',
            key: 'user_id',
            type: ELEMENT_LIST_SEARCH.INPUT,
            placeHolder: 'ユーザーIDを入力して下さい',
          },
          {
            label: 'ユーザー名',
            key: 'user_name',
            type: ELEMENT_LIST_SEARCH.INPUT,
            placeHolder: 'ユーザー名を入力して下さい',
          },
          {
            label: '承認状況',
            key: 'approval_status',
            type: ELEMENT_LIST_SEARCH.MULTI_SELECT,
            optionsList: COMPANY_DOCUMENT_STATUS_STRING,
            placeHolder: '選択して下さい',
          },
          {
            label: '通知',
            key: 'notification',
            type: ELEMENT_LIST_SEARCH.MULTI_SELECT,
            optionsList: OPTIONS_DOCUMENT_NOTIFICATION,
            placeHolder: '選択して下さい',
          },
        ]}
        onSelectedRows={handleSelectRowKeys}
        typeActionShow={actionTables}
        onActionItemById={handleActionItemById}
      />
      <ModalDelete
        onCancelClick={() => setShowModalConfirmDel(false)}
        message={MSG_CONFIRM.DELETE}
        onOkClick={handleAgreeDeleteNoties}
        isModalVisible={showModalConfirmDel}
      >
        このアイテムを<span className={'high-line'}>削除</span>してもよろしいですか。
      </ModalDelete>
      <EditCommonDocument
        dataItemEdit={itemSelected}
        groupOptions={groupOptions}
        authorizerOptions={authorizerOptions}
        onCloseModal={() => setItemSelected(prevState => ({ ...prevState, showModalCommon: false }))}
        onEditClick={onHandleEditItem}
      />
      <EditIndividualDocument
        dataItemEdit={itemSelected}
        groupOptions={groupOptions}
        authorizerOptions={authorizerOptions}
        onCloseModal={() => setItemSelected(prevState => ({ ...prevState, showModalIndividual: false }))}
        onEditClick={onHandleEditItem}
      />
      <ErrorNotification
        onCloseModal={() =>
          setNotificationErrorItem(pre => ({
            ...pre,
            showModal: false,
          }))
        }
        dataItem={notificationErrorItem}
      />
    </MainWrapper>
  );
}

export default Document;
