import './GroupManagement.scss';
import MainWrapper from 'src/component/layout/MainWrapper/MainWrapper';
import { ACTION_ITEM_TABLE, API_PATH, ELEMENT_LIST_SEARCH, KEYS_DISABLED_SELECT_TABLE_ROW } from 'src/app/constant';
import TableLayout from 'src/component/layout/TableLayout/TableLayout';
import React, { useState } from 'react';
import { ObjectCreateOrEdit } from 'src/component/layout/NoticeManagement/NoticeManagement';
import { onSetShowLoading, onSetToastStatus } from 'src/redux/auth/authSlice';
import { del, get, post, put } from 'src/ultils/request';
import { MSG_CONFIRM, TOAST_MESSAGE } from 'src/app/validation_msg';
import { onReLoadDataTableByLink } from 'src/redux/table/tableSlice';
import { useAppDispatch } from 'src/app/hooks';
import ModalDelete from 'src/component/common/Modal/ModalDelete/ModalDelete';
import { getIdsSelectedByKeyFromTable, handleErrorFromResponse } from 'src/ultils/common';
import CreateEditCompanyGroup from 'src/component/layout/GroupManagement/CreateAndEditCompanyGroup/CreateEditCompanyGroup';
import iconAddNew from 'src/assets/svg/icon-add-new.svg';
import { ACTION_TYPE, TypeActionTableRowShowT } from 'src/component/layout/TableLayout/TableRowAction';
import iconRecycle from 'src/assets/svg/icon-recycle.svg';

const GroupManagement = () => {
  const dispatch = useAppDispatch();
  const searchList = [
    {
      label: 'グループID',
      key: 'group_id',
      type: ELEMENT_LIST_SEARCH.INPUT,
      placeHolder: 'グループIDを入力して下さい',
    },
    {
      label: 'グループ名',
      key: 'group_name',
      type: ELEMENT_LIST_SEARCH.INPUT,
      placeHolder: '担当者グループ',
    },
  ];
  const [groupsSelected, setgroupsSelected] = useState<string[]>([]);
  const [objCreateOrEdit, setObjCreateOrEdit] = useState<ObjectCreateOrEdit>({
    isEdit: false,
    showModal: false,
  });
  const [showModalConfirmDel, setShowModalConfirmDel] = useState(false);
  const actionTables: TypeActionTableRowShowT[] = [
    {
      key: '1',
      label: '削除',
      icon: iconRecycle,
      onClick: onDeleteGroups,
      actionType: ACTION_TYPE.DELETE,
      isDisable: groupsSelected?.length === 0,
    },
    {
      key: '2',
      label: '新規登録',
      icon: iconAddNew,
      onClick: onCreateNewRegistration,
    },
  ];

  function handleActionItemById(id: string, actionType: number) {
    if (actionType === ACTION_ITEM_TABLE.EDIT) {
      dispatch(onSetShowLoading('loading'));
      get(`${API_PATH.COMPANY_GROUP}/${id}`)
        .then((res: any) => {
          if (res && res?.data) {
            const groupEdit = {
              groupId: res.data?.group_id,
              groupName: res.data?.group_name,
              groupAbbreviation: res.data?.abbreviations,
              id: res.data?.id,
            };
            setObjCreateOrEdit({
              itemSelected: groupEdit,
              isEdit: true,
              showModal: true,
            });
            dispatch(onSetShowLoading('idle'));
          } else {
            onDispatchErrorResponse(TOAST_MESSAGE.COMPANY.GROUP.GET_DETAIL.FAIL);
          }
        })
        .catch(err => {
          onDispatchErrorResponse(handleErrorFromResponse(err, TOAST_MESSAGE.COMPANY.GROUP.GET_DETAIL.FAIL));
        });
    } else if (actionType === ACTION_ITEM_TABLE.DELETE) {
      setShowModalConfirmDel(true);
      setgroupsSelected([id]);
    }
  }

  function handleSelectRowKeys(key: React.Key[], listData?: any[]) {
    const idsSelected: string[] = getIdsSelectedByKeyFromTable(key, listData);
    setgroupsSelected(idsSelected);
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

  function onHandleCreateOrEditClick(group: any) {
    const dataBody = {
      group_id: group.groupId,
      group_name: group.groupName,
      abbreviations: group.groupAbbreviation,
    };
    if (!objCreateOrEdit.isEdit) {
      dispatch(onSetShowLoading('loading'));
      post(API_PATH.COMPANY_GROUP, dataBody)
        .then((res: any) => {
          if (res && res.status === 200) {
            setObjCreateOrEdit(prevState => ({ ...prevState, showModal: false }));
            dispatch(
              onSetToastStatus({
                message: TOAST_MESSAGE.COMPANY.GROUP.ADD_NEW.SUCCESS,
                showToast: true,
                status: 'success',
              }),
            );
            dispatch(onReLoadDataTableByLink({ isCreate: true }));
          } else {
            onDispatchErrorResponse(TOAST_MESSAGE.COMPANY.GROUP.ADD_NEW.FAIL);
          }
        })
        .catch(err => {
          dispatch(onReLoadDataTableByLink({ isCreate: true }));
          onDispatchErrorResponse(handleErrorFromResponse(err, TOAST_MESSAGE.COMPANY.GROUP.ADD_NEW.FAIL));
        });
    } else {
      // Updating company
      dispatch(onSetShowLoading('loading'));
      put(`${API_PATH.COMPANY_GROUP}/${objCreateOrEdit?.itemSelected?.id}`, dataBody)
        .then((res: any) => {
          if (res && res.status === 200) {
            setObjCreateOrEdit(prevState => ({ ...prevState, showModal: false }));
            dispatch(
              onSetToastStatus({
                message: TOAST_MESSAGE.COMPANY.GROUP.UPDATE.SUCCESS,
                showToast: true,
                status: 'success',
              }),
            );
            dispatch(onReLoadDataTableByLink({ isEdit: true }));
          } else {
            onDispatchErrorResponse(TOAST_MESSAGE.COMPANY.GROUP.UPDATE.FAIL);
          }
        })
        .catch(err => {
          onDispatchErrorResponse(handleErrorFromResponse(err, TOAST_MESSAGE.COMPANY.GROUP.UPDATE.FAIL));
        });
    }
  }

  function handleAgreeDeleteCompanies() {
    dispatch(onSetShowLoading('loading'));
    return del(`${API_PATH.COMPANY_GROUP}`, groupsSelected)
      .then(res => {
        dispatch(onSetShowLoading('idle'));
        if (res && res?.status === 200) {
          dispatch(
            onSetToastStatus({
              message: TOAST_MESSAGE.COMPANY.GROUP.DELETE.SUCCESS,
              showToast: true,
              status: 'success',
            }),
          );
          setShowModalConfirmDel(false);
          setgroupsSelected([]);
          dispatch(onReLoadDataTableByLink({ isDelete: true }));
        } else {
          dispatch(
            onSetToastStatus({
              message: TOAST_MESSAGE.COMPANY.GROUP.DELETE.FAIL,
              showToast: true,
              status: 'error',
            }),
          );
        }
      })
      .catch(err => {
        dispatch(onSetShowLoading('idle'));
        onDispatchErrorResponse(handleErrorFromResponse(err, TOAST_MESSAGE.COMPANY.GROUP.DELETE.FAIL));
      });
  }

  function onDeleteGroups() {
    setShowModalConfirmDel(true);
  }

  return (
    <>
      <MainWrapper title="グループ管理">
        <div className={'company-group-list-root'}>
          <div className="table-container">
            <TableLayout
              tableApiLink={API_PATH.COMPANY_GROUP}
              listKeyName={{
                names: ['グループID', 'グループ名', 'グループ略称', 'ユーザー数', 'アクション'],
                keys: [
                  { keyName: 'group_id', sorter: true },
                  { keyName: 'group_name', sorter: true },
                  { keyName: 'abbreviations', sorter: true },
                  { keyName: 'number_of_users', sorter: true },
                  { keyName: 'edit_act_noti', sorter: true },
                  { keyName: 'is_delete', sorter: false },
                  { keyName: KEYS_DISABLED_SELECT_TABLE_ROW.COMPANY_GROUP.KEY, sorter: false },
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
      <CreateEditCompanyGroup
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
    </>
  );
};

export default GroupManagement;
