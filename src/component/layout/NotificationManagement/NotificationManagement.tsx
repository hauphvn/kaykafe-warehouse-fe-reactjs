import MainWrapper from 'src/component/layout/MainWrapper/MainWrapper';
import './NotificationManagement.scss';
import { ACTION_ITEM_TABLE, API_PATH, TYPE_COMMON_GET_ALL_API } from 'src/app/constant';
import TableLayout from 'src/component/layout/TableLayout/TableLayout';
import React, { useEffect, useRef, useState } from 'react';
import {
  convertDateEnd,
  convertDateStartWithoutSelectHour,
  getIdsSelectedByKeyFromTable,
  handleErrorFromResponse,
} from 'src/ultils/common';
import { useAppDispatch } from 'src/app/hooks';
import { del, get, post, put } from 'src/ultils/request';
import { onSetShowLoading, onSetToastStatus } from 'src/redux/auth/authSlice';
import { MSG_CONFIRM, TOAST_MESSAGE } from 'src/app/validation_msg';
import { ACTION_TYPE, TypeActionTableRowShowT } from 'src/component/layout/TableLayout/TableRowAction';
import iconRecycle from 'src/assets/svg/icon-recycle.svg';
import iconAddNew from 'src/assets/svg/icon-add-new.svg';
import { ModalDelete } from 'src/component/common';
import CreateAndEditCompanyNotification from 'src/component/layout/NotificationManagement/CreateAndEditCompanyNotification/CreateAndEditCompanyNotification';
import { onReLoadDataTableByLink } from 'src/redux/table/tableSlice';
import { ObjectCreateOrEdit } from 'src/component/layout/NoticeManagement/NoticeManagement';

type DataTableGroup = {
  name: string;
  id: string;
};

function NotificationManagement() {
  const dispatch = useAppDispatch();
  const refTableLayout = useRef(null);
  const [showModalConfirmDel, setShowModalConfirmDel] = useState(false);
  const [itemsSelected, setItemsSelected] = useState<string[]>([]);
  const [objCreateOrEdit, setObjCreateOrEdit] = useState<ObjectCreateOrEdit>({
    isEdit: false,
    showModal: false,
  });
  const [groupIdsItems, setGroupIdsItems] = useState<DataTableGroup[]>([]);

  useEffect(() => {
    getGroupIds();
  }, []);

  function onDeleteItems() {
    setShowModalConfirmDel(true);
  }

  function getGroupIds() {
    dispatch(onSetShowLoading('loading'));
    get(`${API_PATH.COMMON}?type=${TYPE_COMMON_GET_ALL_API.GROUP_HAS_USER}`)
      .then((companies: any) => {
        const arrCompanies = companies?.data?.data;
        const items: DataTableGroup[] = [];
        arrCompanies.forEach((item: any) => {
          const company: DataTableGroup = {
            id: item?.id,
            name: item?.value,
          };
          items.push(company);
        });
        setGroupIdsItems(items);
        dispatch(onSetShowLoading('idle'));
      })
      .catch(err => {
        onDispatchErrorResponse(handleErrorFromResponse(err, TOAST_MESSAGE.COMPANY.NOTIFICATION.GET_LIST.FAIL));
        dispatch(onSetShowLoading('idle'));
      });
  }

  useEffect(() => {
    getGroupIds();
  }, []);

  const actionTables: TypeActionTableRowShowT[] = [
    {
      key: '1',
      label: '削除',
      icon: iconRecycle,
      onClick: onDeleteItems,
      actionType: ACTION_TYPE.DELETE,
      isDisable: itemsSelected.length === 0,
    },
    {
      key: '2',
      label: '書類登録',
      icon: iconAddNew,
      onClick: onCreateNewRegistration,
    },
  ];

  function onCreateNewRegistration() {
    setObjCreateOrEdit(prevState => ({
      ...prevState,
      isEdit: false,
      showModal: true,
    }));
  }

  function handleSelectRowKeys(key: React.Key[], listData?: any[]) {
    const idsSelected: string[] = getIdsSelectedByKeyFromTable(key, listData);
    setItemsSelected(idsSelected);
  }

  function handleActionItemById(id: string, actionType: number) {
    if (actionType === ACTION_ITEM_TABLE.EDIT) {
      dispatch(onSetShowLoading('loading'));
      get(`${API_PATH.COMPANY_NOTIFICATION}/${id}`)
        .then((res: any) => {
          if (res && res?.data) {
            const adminEdit = {
              title: res.data?.title,
              content: res.data?.content,
              periodDate: {
                startDate: res.data?.start_date,
                endDate: res.data?.end_date,
              },
              groupIds: res.data?.group_id,
              id: res.data?.id,
            };
            setObjCreateOrEdit({
              itemSelected: adminEdit,
              isEdit: true,
              showModal: true,
            });
            dispatch(onSetShowLoading('idle'));
          } else {
            onDispatchErrorResponse(TOAST_MESSAGE.COMPANY.ADMIN_MANAGEMENT.GET_DETAIL.FAIL);
          }
        })
        .catch(err => {
          onDispatchErrorResponse(handleErrorFromResponse(err, TOAST_MESSAGE.COMPANY.ADMIN_MANAGEMENT.GET_DETAIL.FAIL));
        });
    } else if (actionType === ACTION_ITEM_TABLE.DELETE) {
      setShowModalConfirmDel(true);
      setItemsSelected([id]);
    }
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

  function handleAgreeDeleteCompanies() {
    dispatch(onSetShowLoading('loading'));
    return del(`${API_PATH.COMPANY_NOTIFICATION}`, itemsSelected)
      .then((res: any) => {
        dispatch(onSetShowLoading('idle'));
        if (res && res?.status === 200) {
          setShowModalConfirmDel(false);
          dispatch(
            onSetToastStatus({
              message: TOAST_MESSAGE.COMPANY.NOTIFICATION.DELETE.SUCCESS,
              showToast: true,
              status: 'success',
            }),
          );
          setItemsSelected([]);
          dispatch(onReLoadDataTableByLink({ isDelete: true }));
        } else {
          dispatch(
            onSetToastStatus({
              message: TOAST_MESSAGE.COMPANY.NOTIFICATION.DELETE.FAIL,
              showToast: true,
              status: 'error',
            }),
          );
        }
      })
      .catch(err => {
        dispatch(onSetShowLoading('idle'));
        onDispatchErrorResponse(handleErrorFromResponse(err, TOAST_MESSAGE.COMPANY.NOTIFICATION.DELETE.FAIL));
      });
  }

  function onHandleCreateOrEditClick(notify: any) {
    const dataBody = {
      title: notify?.title,
      content: notify?.content,
      start_date: convertDateStartWithoutSelectHour(notify?.periodDate.startDate),
      end_date: convertDateEnd(notify?.periodDate?.endDate),
      group_id: notify?.groupIds,
    };
    if (!objCreateOrEdit.isEdit) {
      dispatch(onSetShowLoading('loading'));
      post(API_PATH.COMPANY_NOTIFICATION, dataBody)
        .then((res: any) => {
          if (res && res.status === 200) {
            setObjCreateOrEdit(prevState => ({ ...prevState, showModal: false }));
            dispatch(
              onSetToastStatus({
                message: TOAST_MESSAGE.COMPANY.NOTIFICATION.ADD_NEW.SUCCESS,
                showToast: true,
                status: 'success',
              }),
            );
            dispatch(onReLoadDataTableByLink({ isCreate: true }));
          } else {
            onDispatchErrorResponse(TOAST_MESSAGE.COMPANY.NOTIFICATION.ADD_NEW.FAIL);
          }
        })
        .catch(err => {
          dispatch(onReLoadDataTableByLink({ isCreate: true }));
          onDispatchErrorResponse(handleErrorFromResponse(err, TOAST_MESSAGE.COMPANY.NOTIFICATION.ADD_NEW.FAIL));
        });
    } else {
      // Updating notification
      dispatch(onSetShowLoading('loading'));
      put(`${API_PATH.COMPANY_NOTIFICATION}/${objCreateOrEdit?.itemSelected?.id}`, dataBody)
        .then((res: any) => {
          if (res && res.status === 200) {
            setObjCreateOrEdit(prevState => ({ ...prevState, showModal: false }));
            dispatch(
              onSetToastStatus({
                message: TOAST_MESSAGE.COMPANY.NOTIFICATION.UPDATE.SUCCESS,
                showToast: true,
                status: 'success',
              }),
            );
            dispatch(onReLoadDataTableByLink({ isEdit: true }));
          } else {
            onDispatchErrorResponse(TOAST_MESSAGE.COMPANY.NOTIFICATION.UPDATE.FAIL);
          }
        })
        .catch(err => {
          onDispatchErrorResponse(handleErrorFromResponse(err, TOAST_MESSAGE.COMPANY.NOTIFICATION.UPDATE.FAIL));
        });
    }
  }

  function onHandleClosePopUpCreateOrEdit() {
    setObjCreateOrEdit(prevState => ({ ...prevState, showModal: false }));
  }

  return (
    <div>
      <MainWrapper title="お知らせ">
        <div className={'company-notification-root'}>
          <div className="table-container">
            <TableLayout
              refTableLayout={refTableLayout}
              tableTitle={'未承認一覧'}
              tableApiLink={API_PATH.COMPANY_NOTIFICATION}
              listKeyName={{
                names: ['お知らせ', '公開日', '参照期限', 'アクション'],
                keys: [
                  { keyName: 'title', sorter: true },
                  {
                    keyName: 'start_date',
                    sorter: true,
                  },
                  { keyName: 'end_date', sorter: true },
                  { keyName: 'edit_act_noti', sorter: true },
                ],
              }}
              onSelectedRows={handleSelectRowKeys}
              onActionItemById={handleActionItemById}
              typeActionShow={actionTables}
            />
          </div>
        </div>
      </MainWrapper>
      <ModalDelete
        onCancelClick={() => setShowModalConfirmDel(false)}
        message={MSG_CONFIRM.DELETE}
        onOkClick={handleAgreeDeleteCompanies}
        isModalVisible={showModalConfirmDel}
      >
        このアイテムを<span className={'high-line'}>削除</span>してもよろしいですか。
      </ModalDelete>
      <CreateAndEditCompanyNotification
        dataGroupIds={groupIdsItems}
        onCreateOrEditClick={onHandleCreateOrEditClick}
        onCloseModal={onHandleClosePopUpCreateOrEdit}
        objCreateOrEdit={objCreateOrEdit}
      />
    </div>
  );
}

export default NotificationManagement;
