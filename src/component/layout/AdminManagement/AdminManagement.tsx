import './AdminManagement.scss';
import MainWrapper from 'src/component/layout/MainWrapper/MainWrapper';
import { ACTION_ITEM_TABLE, API_PATH, ELEMENT_LIST_SEARCH, KEYS_DISABLED_SELECT_TABLE_ROW } from 'src/app/constant';
import TableLayout from 'src/component/layout/TableLayout/TableLayout';
import React, { useState } from 'react';
import { ObjectCreateOrEdit } from 'src/component/layout/NoticeManagement/NoticeManagement';
import AdminCreateAndEditAdmin from 'src/component/layout/AdminManagement/CreateAndEditAdmin/AdminCreateAndEditAdmin';
import { onSetShowLoading, onSetToastStatus } from 'src/redux/auth/authSlice';
import { del, get, post, put } from 'src/ultils/request';
import { MSG_CONFIRM, TOAST_MESSAGE } from 'src/app/validation_msg';
import { onReLoadDataTableByLink } from 'src/redux/table/tableSlice';
import { useAppDispatch } from 'src/app/hooks';
import ModalDelete from 'src/component/common/Modal/ModalDelete/ModalDelete';
import { getIdsSelectedByKeyFromTable, handleErrorFromResponse, onResetPWD } from 'src/ultils/common';
import { ACTION_TYPE, TypeActionTableRowShowT } from 'src/component/layout/TableLayout/TableRowAction';
import iconAddNew from 'src/assets/svg/icon-add-new.svg';
import iconRecycle from 'src/assets/svg/icon-recycle.svg';
import ModalWarning from 'src/component/common/Modal/ModalWarning/ModalWarning';

const AdminManagement = () => {
  const dispatch = useAppDispatch();
  const searchList = [
    { label: '運用者名', key: 'name', type: ELEMENT_LIST_SEARCH.INPUT, placeHolder: '企業名を入力して下さい' },
  ];
  const [objCreateOrEdit, setObjCreateOrEdit] = useState<ObjectCreateOrEdit>({
    isEdit: false,
    showModal: false,
  });
  const [showModalConfirmDel, setShowModalConfirmDel] = useState(false);
  const [showModalConfirmReset, setShowModalConfirmReset] = useState(false);
  const [adminIdsSelected, setAdminIdsSelected] = useState<string[]>([]);
  const [itemIdActionOnTable, setItemIdActionOnTable] = useState<string>('');

  const actionTables: TypeActionTableRowShowT[] = [
    {
      key: '1',
      label: '削除',
      icon: iconRecycle,
      onClick: onDeleteItems,
      actionType: ACTION_TYPE.DELETE,
      isDisable: adminIdsSelected.length === 0,
    },
    {
      key: '2',
      label: '新規登録',
      icon: iconAddNew,
      onClick: onCreateNewRegistration,
    },
  ];

  function onDeleteItems() {
    setShowModalConfirmDel(true);
  }

  function handleActionItemById(id: string, actionType: number) {
    if (actionType === ACTION_ITEM_TABLE.EDIT) {
      dispatch(onSetShowLoading('loading'));
      get(`${API_PATH.ADMIN_MANAGEMENT}/${id}`)
        .then((res: any) => {
          if (res && res?.data) {
            const adminEdit = {
              email: res.data?.email,
              name: res.data?.name,
              id: res.data?.id,
            };
            setObjCreateOrEdit({
              itemSelected: adminEdit,
              isEdit: true,
              showModal: true,
            });
            dispatch(onSetShowLoading('idle'));
          } else {
            onDispatchErrorResponse(TOAST_MESSAGE.ADMIN_MANAGEMENT.ADMIN.GET_DETAIL.FAIL);
          }
        })
        .catch(err => {
          onDispatchErrorResponse(handleErrorFromResponse(err, TOAST_MESSAGE.ADMIN_MANAGEMENT.ADMIN.GET_DETAIL.FAIL));
        });
    } else if (actionType === ACTION_ITEM_TABLE.DELETE) {
      setShowModalConfirmDel(true);
      setAdminIdsSelected([id]);
    } else if (actionType === ACTION_ITEM_TABLE.RESET) {
      setShowModalConfirmReset(true);
      setItemIdActionOnTable(id);
    }
  }

  function handleSelectRowKeys(key: React.Key[], listData?: any[]) {
    const idsSelected: string[] = getIdsSelectedByKeyFromTable(key, listData);
    setAdminIdsSelected(idsSelected);
  }

  function onCreateNewRegistration() {
    setObjCreateOrEdit(prevState => ({
      ...prevState,
      isEdit: false,
      showModal: true,
    }));
  }

  function onHandleClosePopUpCreateOrEdit() {
    setObjCreateOrEdit(prevState => ({ ...prevState, showModal: false }));
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

  function onHandleCreateOrEditClick(admin: any) {
    const dataBody: { name: string; email?: string } = {
      name: admin.name,
    };
    if (!objCreateOrEdit.isEdit) {
      dispatch(onSetShowLoading('loading'));
      dataBody.email = admin.email;
      post(API_PATH.ADMIN_MANAGEMENT, dataBody)
        .then((res: any) => {
          if (res && res.status === 200) {
            setObjCreateOrEdit(prevState => ({ ...prevState, showModal: false }));
            dispatch(
              onSetToastStatus({
                message: TOAST_MESSAGE.ADMIN_MANAGEMENT.ADMIN.ADD_NEW.SUCCESS,
                showToast: true,
                status: 'success',
              }),
            );
            dispatch(onReLoadDataTableByLink({ isCreate: true }));
          } else {
            onDispatchErrorResponse(TOAST_MESSAGE.ADMIN_MANAGEMENT.ADMIN.ADD_NEW.FAIL);
          }
        })
        .catch(err => {
          dispatch(onReLoadDataTableByLink({ isCreate: true }));
          onDispatchErrorResponse(handleErrorFromResponse(err, TOAST_MESSAGE.ADMIN_MANAGEMENT.ADMIN.ADD_NEW.FAIL));
        });
    } else {
      // Updating company
      dispatch(onSetShowLoading('loading'));
      put(`${API_PATH.ADMIN_MANAGEMENT}/${objCreateOrEdit?.itemSelected?.id}`, dataBody)
        .then((res: any) => {
          if (res && res.status === 200) {
            setObjCreateOrEdit(prevState => ({ ...prevState, showModal: false }));
            dispatch(
              onSetToastStatus({
                message: TOAST_MESSAGE.ADMIN_MANAGEMENT.ADMIN.UPDATE.SUCCESS,
                showToast: true,
                status: 'success',
              }),
            );
            dispatch(onReLoadDataTableByLink({ isEdit: true }));
          } else {
            onDispatchErrorResponse(TOAST_MESSAGE.ADMIN_MANAGEMENT.ADMIN.UPDATE.FAIL);
          }
        })
        .catch(err => {
          onDispatchErrorResponse(handleErrorFromResponse(err, TOAST_MESSAGE.ADMIN_MANAGEMENT.ADMIN.UPDATE.FAIL));
        });
    }
  }

  function handleAgreeDeleteCompanies() {
    setShowModalConfirmDel(false);
    dispatch(onSetShowLoading('loading'));
    del(`${API_PATH.ADMIN_MANAGEMENT}`, adminIdsSelected)
      .then(res => {
        if (res && res?.status === 200) {
          dispatch(
            onSetToastStatus({
              message: TOAST_MESSAGE.ADMIN_MANAGEMENT.ADMIN.DELETE.SUCCESS,
              showToast: true,
              status: 'success',
            }),
          );
        } else {
          dispatch(
            onSetToastStatus({
              message: TOAST_MESSAGE.ADMIN_MANAGEMENT.ADMIN.DELETE.FAIL,
              showToast: true,
              status: 'error',
            }),
          );
        }
        setAdminIdsSelected([]);
        dispatch(onReLoadDataTableByLink({ isDelete: true }));
      })
      .catch(err => {
        onDispatchErrorResponse(handleErrorFromResponse(err, TOAST_MESSAGE.ADMIN_MANAGEMENT.ADMIN.DELETE.FAIL));
      });
  }

  function handleAgreeResetItem() {
    setShowModalConfirmReset(false);
    dispatch(onSetShowLoading('loading'));
    onResetPWD(itemIdActionOnTable)
      .then((res: any) => {
        dispatch(onSetShowLoading('idle'));
        if (res && res?.status === 200) {
          dispatch(
            onSetToastStatus({
              message: TOAST_MESSAGE.RESET_PASSWORD.SUCCESS,
              showToast: true,
              status: 'success',
            }),
          );
        } else {
          onSetToastStatus({
            message: TOAST_MESSAGE.RESET_PASSWORD.FAIL,
            showToast: true,
            status: 'error',
          });
        }
      })
      .catch(err => {
        dispatch(onSetShowLoading('idle'));
        dispatch(
          onSetToastStatus({
            message: handleErrorFromResponse(err, TOAST_MESSAGE.RESET_PASSWORD.FAIL),
            showToast: true,
            status: 'error',
          }),
        );
      });
  }

  return (
    <>
      <MainWrapper title="運用者管理">
        <div className={'admin-management-list-root'}>
          <div className="table-container">
            <TableLayout
              tableTitle={'運用者一覧'}
              tableApiLink={API_PATH.ADMIN_MANAGEMENT}
              listKeyName={{
                names: ['運用者名', 'メールアドレス', 'アクション'],
                keys: [
                  { keyName: 'name', sorter: true },
                  { keyName: 'email', sorter: true },
                  { keyName: 'edit_act_admin_admin_management', sorter: false },
                  { keyName: 'id', sorter: false },
                  { keyName: 'is_edit', sorter: false },
                  { keyName: KEYS_DISABLED_SELECT_TABLE_ROW.ADMIN_MANAGEMENT.KEY, sorter: false },
                ],
              }}
              searchList={searchList}
              onActionItemById={handleActionItemById}
              onSelectedRows={handleSelectRowKeys}
              typeActionShow={actionTables}
            />
          </div>
        </div>
      </MainWrapper>
      <AdminCreateAndEditAdmin
        onCreateOrEditClick={onHandleCreateOrEditClick}
        onCloseModal={onHandleClosePopUpCreateOrEdit}
        objCreateOrEdit={objCreateOrEdit}
      />
      <ModalDelete
        onCancelClick={() => setShowModalConfirmDel(false)}
        message={MSG_CONFIRM.DELETE}
        onOkClick={handleAgreeDeleteCompanies}
        isModalVisible={showModalConfirmDel}
      >
        このアイテムを<span className={'high-line'}>削除</span>してもよろしいですか。
      </ModalDelete>
      <ModalWarning
        title={'パスワードのリセット'}
        onCancelClick={() => setShowModalConfirmReset(false)}
        message={MSG_CONFIRM.RESET}
        onOkClick={handleAgreeResetItem}
        isModalVisible={showModalConfirmReset}
      >
        パスワードをリセットしてもよろしいですか?
      </ModalWarning>
    </>
  );
};

export default AdminManagement;
