import './NoticeManagement.scss';
import MainWrapper from 'src/component/layout/MainWrapper/MainWrapper';
import { ACTION_ITEM_TABLE, API_PATH, TYPE_COMMON_GET_ALL_API } from 'src/app/constant';
import TableLayout from 'src/component/layout/TableLayout/TableLayout';
import React, { useEffect, useState } from 'react';
import {
  convertDateEnd,
  convertDateStartWithoutSelectHour,
  getIdsSelectedByKeyFromTable,
  handleErrorFromResponse,
} from 'src/ultils/common';
import AdminCreateAndEditNoti from 'src/component/layout/NoticeManagement/CreateAndEditNoti/AdminCreateAndEditNoti';
import { useAppDispatch } from 'src/app/hooks';
import { onSetShowLoading, onSetToastStatus } from 'src/redux/auth/authSlice';
import { del, get, post, put } from 'src/ultils/request';
import { onReLoadDataTableByLink } from 'src/redux/table/tableSlice';
import { MSG_CONFIRM, TOAST_MESSAGE } from 'src/app/validation_msg';
import ModalDelete from 'src/component/common/Modal/ModalDelete/ModalDelete';
import { ACTION_TYPE, TypeActionTableRowShowT } from 'src/component/layout/TableLayout/TableRowAction';
import iconAddNew from 'src/assets/svg/icon-add-new.svg';
import iconRecycle from 'src/assets/svg/icon-recycle.svg';

export type ObjectCreateOrEdit = {
  isEdit: boolean;
  showModal: boolean;
  itemSelected?: any;
};
type DataTableCompany = {
  name: string;
  id: string;
};
const NoticeManagement = () => {
  const dispatch = useAppDispatch();
  const [notiIdsSelected, setnotiIdsSelected] = useState<string[]>([]);
  const [objCreateOrEdit, setObjCreateOrEdit] = useState<ObjectCreateOrEdit>({
    isEdit: false,
    showModal: false,
  });
  const [showModalConfirmDel, setShowModalConfirmDel] = useState(false);
  const [companyIdsItems, setCompanyIdsItems] = useState<DataTableCompany[]>([]);
  const actionTables: TypeActionTableRowShowT[] = [
    {
      key: '1',
      label: '削除',
      icon: iconRecycle,
      onClick: onDeleteNoties,
      actionType: ACTION_TYPE.DELETE,
      isDisable: notiIdsSelected.length === 0,
    },
    {
      key: '2',
      label: '新規登録',
      icon: iconAddNew,
      onClick: onCreateNewRegistration,
    },
  ];
  useEffect(() => {
    getCompanyIds();
  }, []);

  function onCreateNewRegistration() {
    setObjCreateOrEdit(prevState => ({
      ...prevState,
      isEdit: false,
      showModal: true,
    }));
  }

  function handleActionItemById(id: string, actionType: number) {
    if (actionType === ACTION_ITEM_TABLE.EDIT) {
      dispatch(onSetShowLoading('loading'));
      get(`${API_PATH.ADMIN_NOTI}/${id}`)
        .then((res: any) => {
          if (res && res?.data) {
            const notifyEdit = {
              title: res.data?.title,
              content: res.data?.content,
              periodDate: {
                startDate: res.data?.start_date,
                endDate: res.data?.end_date,
              },
              companyIds: res.data?.company_id,
              id: res.data?.id,
            };
            setObjCreateOrEdit({
              itemSelected: notifyEdit,
              isEdit: true,
              showModal: true,
            });
            dispatch(onSetShowLoading('idle'));
          } else {
            onDispatchErrorResponse(TOAST_MESSAGE.ADMIN_MANAGEMENT.COMPANY.GET_DETAIL.FAIL);
          }
        })
        .catch(err => {
          onDispatchErrorResponse(handleErrorFromResponse(err, TOAST_MESSAGE.ADMIN_MANAGEMENT.COMPANY.GET_DETAIL.FAIL));
        });
    }
  }

  function onDeleteNoties() {
    setShowModalConfirmDel(true);
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

  function handleAgreeDeleteNoties() {
    dispatch(onSetShowLoading('loading'));
    return del(`${API_PATH.ADMIN_NOTI}`, notiIdsSelected)
      .then((res: any) => {
        dispatch(onSetShowLoading('idle'));
        if (res && res?.status === 200) {
          dispatch(
            onSetToastStatus({
              message: TOAST_MESSAGE.ADMIN_MANAGEMENT.NOTIFICATION.DELETE.SUCCESS,
              showToast: true,
              status: 'success',
            }),
          );
          setShowModalConfirmDel(false);
          setnotiIdsSelected([]);
          dispatch(onReLoadDataTableByLink({ isDelete: true }));
        } else {
          dispatch(
            onSetToastStatus({
              message: TOAST_MESSAGE.ADMIN_MANAGEMENT.NOTIFICATION.DELETE.FAIL,
              showToast: true,
              status: 'error',
            }),
          );
        }
      })
      .catch(err => {
        dispatch(onSetShowLoading('idle'));
        onDispatchErrorResponse(handleErrorFromResponse(err, TOAST_MESSAGE.ADMIN_MANAGEMENT.NOTIFICATION.DELETE.FAIL));
      });
  }

  function getCompanyIds() {
    dispatch(onSetShowLoading('loading'));
    // setStatusLoading(prevState => ({
    //   ...prevState,
    //   getDoneListCompanyIds: false,
    // }));
    get(`${API_PATH.COMMON}?type=${TYPE_COMMON_GET_ALL_API.COMPANY}`)
      .then((companies: any) => {
        const arrCompanies = companies?.data?.data;
        const items: DataTableCompany[] = [];
        arrCompanies.forEach((item: any) => {
          const company: DataTableCompany = {
            id: item?.id,
            name: item?.value,
          };
          items.push(company);
        });
        setCompanyIdsItems(items);
        dispatch(onSetShowLoading('idle'));
      })
      .catch(err => {
        onDispatchErrorResponse(handleErrorFromResponse(err, TOAST_MESSAGE.COMPANY.NOTIFICATION.GET_LIST.FAIL));
        dispatch(onSetShowLoading('idle'));
      });
  }

  function handleSelectRowKeys(key: React.Key[], listData?: any[]) {
    const idsSelected: string[] = getIdsSelectedByKeyFromTable(key, listData);
    setnotiIdsSelected(idsSelected);
  }

  function onHandleCreateOrEditClick(notify: any) {
    const dataBody = {
      title: notify?.title,
      content: notify?.content,
      start_date: convertDateStartWithoutSelectHour(notify?.periodDate.startDate),
      end_date: convertDateEnd(notify?.periodDate?.endDate),
      company_id: notify?.companyIds,
    };
    if (!objCreateOrEdit.isEdit) {
      dispatch(onSetShowLoading('loading'));
      post(API_PATH.ADMIN_NOTI, dataBody)
        .then((res: any) => {
          if (res && res.status === 200) {
            setObjCreateOrEdit(prevState => ({ ...prevState, showModal: false }));
            dispatch(
              onSetToastStatus({
                message: TOAST_MESSAGE.ADMIN_MANAGEMENT.NOTIFICATION.ADD_NEW.SUCCESS,
                showToast: true,
                status: 'success',
              }),
            );
            dispatch(onReLoadDataTableByLink({ isCreate: true }));
          } else {
            onDispatchErrorResponse(TOAST_MESSAGE.ADMIN_MANAGEMENT.NOTIFICATION.ADD_NEW.FAIL);
          }
        })
        .catch(err => {
          dispatch(onReLoadDataTableByLink({ isCreate: true }));
          onDispatchErrorResponse(
            handleErrorFromResponse(err, TOAST_MESSAGE.ADMIN_MANAGEMENT.NOTIFICATION.ADD_NEW.FAIL),
          );
        });
    } else {
      // Updating notification
      dispatch(onSetShowLoading('loading'));
      put(`${API_PATH.ADMIN_NOTI}/${objCreateOrEdit?.itemSelected?.id}`, dataBody)
        .then((res: any) => {
          if (res && res.status === 200) {
            setObjCreateOrEdit(prevState => ({ ...prevState, showModal: false }));
            dispatch(
              onSetToastStatus({
                message: TOAST_MESSAGE.ADMIN_MANAGEMENT.NOTIFICATION.UPDATE.SUCCESS,
                showToast: true,
                status: 'success',
              }),
            );
            dispatch(onReLoadDataTableByLink({ isEdit: true }));
          } else {
            onDispatchErrorResponse(TOAST_MESSAGE.ADMIN_MANAGEMENT.NOTIFICATION.UPDATE.FAIL);
          }
        })
        .catch(err => {
          onDispatchErrorResponse(
            handleErrorFromResponse(err, TOAST_MESSAGE.ADMIN_MANAGEMENT.NOTIFICATION.UPDATE.FAIL),
          );
        });
    }
  }

  function onHandleClosePopUpCreateOrEdit() {
    setObjCreateOrEdit(prevState => ({ ...prevState, showModal: false }));
  }

  return (
    <>
      <MainWrapper title="お知らせ（企業宛て）管理">
        <div className={'iis-management-notification-root'}>
          <div className="table-container">
            <TableLayout
              tableTitle={'お知らせ一覧'}
              tableApiLink={API_PATH.ADMIN_NOTI}
              listKeyName={{
                names: ['お知らせ', '開始日', '終了日', 'アクション'],
                keys: [
                  { keyName: 'title', sorter: true },
                  { keyName: 'start_date', sorter: true },
                  { keyName: 'end_date', sorter: true },
                  { keyName: 'edit_act_noti', sorter: false },
                  { keyName: 'id', sorter: false },
                ],
              }}
              onActionItemById={handleActionItemById}
              onSelectedRows={handleSelectRowKeys}
              typeActionShow={actionTables}
            />
          </div>
        </div>
      </MainWrapper>
      <AdminCreateAndEditNoti
        dataCompanyIds={companyIdsItems}
        onCreateOrEditClick={onHandleCreateOrEditClick}
        onCloseModal={onHandleClosePopUpCreateOrEdit}
        objCreateOrEdit={objCreateOrEdit}
      />
      <ModalDelete
        onCancelClick={() => setShowModalConfirmDel(false)}
        message={MSG_CONFIRM.DELETE}
        onOkClick={handleAgreeDeleteNoties}
        isModalVisible={showModalConfirmDel}
      >
        このアイテムを<span className={'high-line'}>削除</span>してもよろしいですか。
      </ModalDelete>
    </>
  );
};

export default NoticeManagement;
