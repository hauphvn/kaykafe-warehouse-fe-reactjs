import './UserManagement.scss';
import MainWrapper from 'src/component/layout/MainWrapper/MainWrapper';
import { ACTION_ITEM_TABLE, API_PATH, ELEMENT_LIST_SEARCH, TYPE_COMMON_GET_ALL_API } from 'src/app/constant';
import TableLayout from 'src/component/layout/TableLayout/TableLayout';
import React, { useEffect, useState } from 'react';
import { ObjectCreateOrEdit } from 'src/component/layout/NoticeManagement/NoticeManagement';
import { onSetShowLoading, onSetToastStatus } from 'src/redux/auth/authSlice';
import { get, post, put } from 'src/ultils/request';
import { MSG_CONFIRM, TOAST_MESSAGE } from 'src/app/validation_msg';
import { onReLoadDataTableByLink } from 'src/redux/table/tableSlice';
import { useAppDispatch } from 'src/app/hooks';
import ModalDelete from 'src/component/common/Modal/ModalDelete/ModalDelete';
import { getIdsSelectedByKeyFromTable, handleErrorFromResponse, onResetPWD } from 'src/ultils/common';
import iconAddNew from 'src/assets/svg/icon-add-new.svg';
import { ACTION_TYPE, TypeActionTableRowShowT } from 'src/component/layout/TableLayout/TableRowAction';
import iconSend from 'src/assets/svg/icon-send.svg';
import iconSetting from 'src/assets/svg/icon-setting-bold.svg';
import CreateCompanyUser from 'src/component/layout/UserManagement/CreateAndEditCompanyUser/CreateNew/CreateCompanyUser';
import TemplateNotification from 'src/component/layout/UserManagement/TemplateNotification/TemplateNotification';
import templateNotification from 'src/component/layout/UserManagement/TemplateNotification/TemplateNotification';
import ModalWarning from 'src/component/common/Modal/ModalWarning/ModalWarning';
import EditCompanyUser from 'src/component/layout/UserManagement/CreateAndEditCompanyUser/Edit/EditCompanyUser';
import PreviewCSVIsValid from 'src/component/layout/UserManagement/CreateAndEditCompanyUser/PreviewValidationCSV/Valid/PreviewCSVIsValid';
import PreviewCSVInValid from 'src/component/layout/UserManagement/CreateAndEditCompanyUser/PreviewValidationCSV/InValid/PreviewCSVInValid';

export interface IObjTemplateNotification {
  showModal: boolean;
  isEdit?: boolean;
  data: any;
}

export interface IObjPreview {
  showModal: boolean;
  data: any;
}

export enum DOING_ACTION {
  NOTHING,
  INDIVIDUAL,
  DASHBOARD_USER_MANAGEMENT,
  BULK_IS_VALID,
  NOTIFICATION_RESENT,
}

interface IItemClickedOnTableCell {
  id: string;
  options?: any;
}

export interface IOption {
  value: string;
  text: string;
}

interface INotification {
  title: string;
  content: string;
}

const UserManagement = () => {
  const dispatch = useAppDispatch();
  const [itemIdActionOnTable, setItemIdActionOnTable] = useState<string>('');
  const [groupOptions, setGroupOptions] = useState<IOption[]>([]);
  const searchList = [
    {
      label: 'グループ',
      key: 'group_id',
      type: ELEMENT_LIST_SEARCH.MULTI_SELECT,
      optionsList: groupOptions,
      allowClear: true,
      placeHolder: '選択して下さい',
    },
    { label: 'ユーザーID', key: 'user_id', type: ELEMENT_LIST_SEARCH.INPUT, placeHolder: 'ユーザーIDを入力して下さい' },
    {
      label: 'ユーザー名',
      key: 'user_name',
      type: ELEMENT_LIST_SEARCH.INPUT,
      placeHolder: 'ユーザー名を入力して下さい',
    },
    {
      label: 'メールアドレス',
      key: 'email',
      type: ELEMENT_LIST_SEARCH.INPUT,
      placeHolder: 'メールアドレスを入力して下さい',
    },
  ];
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [objCreateOrEdit, setObjCreateOrEdit] = useState<ObjectCreateOrEdit>({
    isEdit: false,
    showModal: false,
  });
  const [dataPreviewInValid, setDataPreviewInValid] = useState<IObjPreview>({
    data: null,
    showModal: false,
  });
  const [objTemplate, setObjTemplate] = useState<IObjTemplateNotification>({
    showModal: false,
    data: null,
  });
  const [showModalConfirmChangeActivate, setShowModalConfirmChangeActivate] = useState(false);
  const [showModalConfirmReset, setShowModalConfirmReset] = useState(false);
  const [notification, setNotification] = useState<INotification>();
  const [dataPreviewIsValid, setDataPreviewIsValid] = useState<IObjPreview>({
    showModal: false,
    data: null,
  });
  const [itemsSelected, setItemsSelected] = useState<string[]>([]);

  const [itemOnClickOnTableCell, setItemOnClickOnTableCell] = useState<IItemClickedOnTableCell>({
    id: '',
    options: null,
  });

  function onSendActivateBulk() {
    if (notification?.content && notification?.title) {
      dispatch(onSetShowLoading('loading'));
      const bodyData = {
        ids: itemsSelected,
        notification: {
          title: notification.title,
          content: notification.content,
        },
      };
      post(API_PATH.COMPANY_USER_RESEND_NOTIFICATION, bodyData)
        .then((res: any) => {
          dispatch(onSetShowLoading('idle'));
          if (res && res?.status === 200) {
            setIsSubmitted(true);
            setNotification({
              title: '',
              content: '',
            });
            dispatch(
              onSetToastStatus({
                message: TOAST_MESSAGE.COMPANY.USER.NOTIFICATION_RESEND.RE_SEND.SUCCESS,
                showToast: true,
                status: 'success',
              }),
            );
            dispatch(onReLoadDataTableByLink({ isResetSelected: true }));
            setItemsSelected([]);
          } else {
            dispatch(
              onSetToastStatus({
                message: TOAST_MESSAGE.COMPANY.USER.NOTIFICATION_RESEND.RE_SEND.FAIL,
                showToast: true,
                status: 'error',
              }),
            );
          }
        })
        .catch(err => {
          dispatch(onSetShowLoading('idle'));
          onSetToastStatus({
            message: handleErrorFromResponse(err, TOAST_MESSAGE.COMPANY.USER.NOTIFICATION_RESEND.RE_SEND.FAIL),
            showToast: true,
            status: 'error',
          });
        });
    } else {
      dispatch(
        onSetToastStatus({
          message: TOAST_MESSAGE.COMPANY.USER.NOTIFICATION_RESEND.REQUIRED,
          showToast: true,
          status: 'error',
        }),
      );
    }
  }

  const actionTables: TypeActionTableRowShowT[] = [
    {
      key: '1',
      label: 'アクティベーション送信',
      icon: iconSend,
      onClick: onSendActivateBulk,
      actionType: ACTION_TYPE.SEND,
      isDisable: itemsSelected.length === 0,
    },
    {
      key: '2',
      label: '新規登録',
      icon: iconAddNew,
      onClick: onCreateNewRegistration,
    },
  ];
  const [doingAction, setDoingAction] = useState<DOING_ACTION>(DOING_ACTION.NOTHING);
  useEffect(() => {
    getDataGroupOptions();
  }, []);

  function getDataGroupOptions() {
    dispatch(onSetShowLoading('loading'));
    get(`${API_PATH.COMMON}?type=${TYPE_COMMON_GET_ALL_API.ALL_GROUP}`)
      .then((res: any) => {
        if (res && res?.data) {
          const items: IOption[] = [];
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

  function onChangeActivateUser() {
    dispatch(onSetShowLoading('loading'));
    put(`${API_PATH.COMPANY_USER_ACTIVE}/${itemOnClickOnTableCell.id}`, {
      active: !itemOnClickOnTableCell?.options?.oldStatus,
    })
      .then((res: any) => {
        dispatch(onSetShowLoading('idle'));
        if (res && res?.status === 200) {
          dispatch(
            onSetToastStatus({
              message: TOAST_MESSAGE.COMPANY.USER.UPDATE_ACTIVE.SUCCESS,
              showToast: true,
              status: 'success',
            }),
          );
          dispatch(onReLoadDataTableByLink({ isEdit: true }));
        } else {
          dispatch(
            onSetToastStatus({
              message: TOAST_MESSAGE.COMPANY.USER.UPDATE_ACTIVE.FAIL,
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
            message: handleErrorFromResponse(err, TOAST_MESSAGE.COMPANY.USER.UPDATE_ACTIVE.FAIL),
            showToast: true,
            status: 'error',
          }),
        );
      })
      .finally(() => {
        setShowModalConfirmChangeActivate(false);
      });
  }

  function handleActionItemById(id: string, actionType: number, options?: any) {
    setItemOnClickOnTableCell({
      id,
      options,
    });
    if (actionType === ACTION_ITEM_TABLE.EDIT) {
      dispatch(onSetShowLoading('loading'));
      get(`${API_PATH.COMPANY_USER}/${id}`)
        .then((res: any) => {
          if (res && res?.data) {
            const userEdit = {
              userId: res.data?.user_id,
              userName: res.data?.user_name,
              group: res.data?.group_id,
              email: res.data?.email,
              id: res.data?.id,
            };
            setObjCreateOrEdit({
              itemSelected: userEdit,
              isEdit: true,
              showModal: true,
            });
            dispatch(onSetShowLoading('idle'));
          } else {
            onDispatchErrorResponse(TOAST_MESSAGE.COMPANY.USER.GET_DETAIL.FAIL);
          }
        })
        .catch(err => {
          onDispatchErrorResponse(handleErrorFromResponse(err, TOAST_MESSAGE.COMPANY.USER.GET_DETAIL.FAIL));
        });
    } else if (actionType === ACTION_ITEM_TABLE.DELETE) {
      setShowModalConfirmChangeActivate(true);
    } else if (actionType === ACTION_ITEM_TABLE.RESET) {
      setShowModalConfirmReset(true);
      setItemIdActionOnTable(id);
    } else if (actionType === ACTION_ITEM_TABLE.CHANGE_ACTIVE_USER_COMPANY) {
      setShowModalConfirmChangeActivate(true);
    }
  }

  function onCreateNewRegistration() {
    setIsSubmitted(false);
    setObjCreateOrEdit(prevState => ({
      ...prevState,
      isEdit: false,
      showModal: true,
    }));
  }

  function onHandleClosePopUpCreateOrEdit() {
    if (dataPreviewInValid?.data?.listUsers?.length > 0) {
      setIsSubmitted(true);
    }
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

  function onHandleCreateOrEditClick(user: any) {
    if (!objCreateOrEdit.isEdit) {
      const dataBody: any = {
        ...user,
        notification: objTemplate?.data
          ? {
              title: objTemplate?.data?.title,
              content: objTemplate?.data?.content,
            }
          : null,
      };
      dispatch(onSetShowLoading('loading'));
      post(API_PATH.COMPANY_USER, dataBody)
        .then((res: any) => {
          dispatch(onSetShowLoading('idle'));
          if (res && res?.status === 200) {
            dispatch(onReLoadDataTableByLink({ isCreate: true }));
            setIsSubmitted(true);
            setObjCreateOrEdit(prevState => ({ ...prevState, showModal: false }));
            dispatch(
              onSetToastStatus({
                message: handleErrorFromResponse(null, TOAST_MESSAGE.COMPANY.USER.ADD_NEW.SUCCESS),
                showToast: true,
                status: 'success',
              }),
            );
          } else {
            dispatch(
              onSetToastStatus({
                message: handleErrorFromResponse(null, TOAST_MESSAGE.COMPANY.USER.ADD_NEW.FAIL),
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
              message: handleErrorFromResponse(err, TOAST_MESSAGE.COMPANY.USER.ADD_NEW.FAIL),
              showToast: true,
              status: 'error',
            }),
          );
        });
    } else {
      dispatch(onSetShowLoading('loading'));
      const dataBody: any = {
        user_id: user?.user_id,
        user_name: user?.user_name,
        group_id: user?.group_id,
      };
      put(`${API_PATH.COMPANY_USER}/${objCreateOrEdit?.itemSelected?.id}`, dataBody)
        .then((res: any) => {
          if (res && res.status === 200) {
            setObjCreateOrEdit(prevState => ({ ...prevState, showModal: false }));
            dispatch(
              onSetToastStatus({
                message: TOAST_MESSAGE.COMPANY.USER.UPDATE.SUCCESS,
                showToast: true,
                status: 'success',
              }),
            );
            dispatch(onReLoadDataTableByLink({ isEdit: true }));
          } else {
            onDispatchErrorResponse(TOAST_MESSAGE.COMPANY.USER.UPDATE.FAIL);
          }
        })
        .catch((err: any) => {
          onDispatchErrorResponse(handleErrorFromResponse(err, TOAST_MESSAGE.COMPANY.USER.UPDATE.FAIL));
        });
    }
  }

  function handleAgreeChangeActivate() {
    setShowModalConfirmChangeActivate(false);
    onChangeActivateUser();
  }

  function onClickSetting() {
    setDoingAction(DOING_ACTION.NOTIFICATION_RESENT);
    setObjTemplate({
      showModal: true,
      data: null,
    });
  }

  function onHandleCloseTemplate() {
    switch (doingAction) {
      case DOING_ACTION.INDIVIDUAL: {
        setObjTemplate(prevState => ({
          ...prevState,
          showModal: false,
        }));
        setObjCreateOrEdit(prevState => ({
          ...prevState,
          showModal: true,
        }));
        break;
      }
      case DOING_ACTION.BULK_IS_VALID: {
        setObjTemplate(prevState => ({
          ...prevState,
          showModal: false,
        }));
        setDataPreviewIsValid(prevState => ({
          ...prevState,
          showModal: true,
        }));
        break;
      }
      case DOING_ACTION.NOTIFICATION_RESENT: {
        setObjTemplate(prevState => ({
          ...prevState,
          showModal: false,
        }));
        break;
      }
      default:
        break;
    }
  }

  function onHandleCreateOrEditClickTemplate(data: any) {
    switch (doingAction) {
      case DOING_ACTION.INDIVIDUAL: {
        setObjCreateOrEdit(prevState => ({
          ...prevState,
          showModal: true,
        }));
        setObjTemplate(prevState => ({
          ...prevState,
          showModal: false,
          data,
        }));
        break;
      }
      case DOING_ACTION.BULK_IS_VALID: {
        setDataPreviewIsValid(prevState => ({
          ...prevState,
          notification: templateNotification,
          showModal: true,
        }));
        setObjTemplate(prevState => ({
          ...prevState,
          showModal: false,
          data,
        }));
        break;
      }
      case DOING_ACTION.NOTIFICATION_RESENT: {
        setObjTemplate(prevState => ({
          ...prevState,
          showModal: false,
          data,
        }));
        setNotification({
          title: data?.title,
          content: data?.content,
        });
        break;
      }
      default:
        break;
    }
  }

  function onHandleClickSetting(from: DOING_ACTION) {
    switch (from) {
      case DOING_ACTION.INDIVIDUAL: {
        setDoingAction(DOING_ACTION.INDIVIDUAL);
        // setObjCreateOrEdit(prevState => ({
        //   ...prevState,
        //   showModal: false,
        // }));
        setObjTemplate(prevState => ({
          ...prevState,
          showModal: true,
        }));
        break;
      }
      case DOING_ACTION.BULK_IS_VALID: {
        setDoingAction(DOING_ACTION.BULK_IS_VALID);
        setDataPreviewIsValid(prevState => ({
          ...prevState,
          showModal: false,
        }));
        setObjTemplate(prevState => ({
          ...prevState,
          showModal: true,
        }));
        break;
      }
      case DOING_ACTION.DASHBOARD_USER_MANAGEMENT: {
        break;
      }
      default:
        break;
    }
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

  function onClosePreviewIsValid() {
    setObjCreateOrEdit(prevState => ({ ...prevState, showModal: true }));
    setDataPreviewIsValid(prevState => ({
      ...prevState,
      showModal: false,
    }));
  }

  function onClosePreviewInValid() {
    setDataPreviewInValid(prevState => ({
      ...prevState,
      showModal: false,
    }));
    if (!isSubmitted) {
      setObjCreateOrEdit(prevState => ({ ...prevState, showModal: true }));
    }
  }

  function onHandleCreateByCSV(optionsChange: any) {
    dispatch(onSetShowLoading('loading'));
    setIsSubmitted(true);
    const userList: any = dataPreviewIsValid?.data?.body?.user_list?.map((item: any) => ({
      user_id: item?.user_id,
      user_name: item?.user_name,
      email: item?.email,
    }));
    const dataBody = {
      ...dataPreviewIsValid.data.body,
      user_list: userList,
      notification:
        optionsChange?.notification && objTemplate?.data
          ? {
              title: objTemplate?.data?.title,
              content: objTemplate?.data?.content,
            }
          : null,
    };

    post(API_PATH.COMPANY_USER_LIST, dataBody)
      .then((res: any) => {
        dispatch(onSetShowLoading('idle'));
        if (res && res?.status === 200) {
          if (res?.data?.length > 0) {
            const errorList = res?.data;
            const listUserError: any[] = errorList.map((item: any, index: number) => ({
              user_id: item?.user_id,
              user_name: item?.user_name,
              email: item?.email,
              error_message: item?.error_msg,
              no: index + 1,
            }));
            const dataViewOnTable = {
              listUsers: listUserError,
              totalRecord: userList.length,
            };
            setDataPreviewIsValid(prevState => ({
              ...prevState,
              showModal: false,
            }));
            setDataPreviewInValid({
              data: dataViewOnTable,
              showModal: true,
            });
          } else {
            setDataPreviewIsValid(pre => ({
              ...pre,
              showModal: false,
            }));
            setObjCreateOrEdit(prevState => ({ ...prevState, showModal: false }));
            dispatch(
              onSetToastStatus({
                message: handleErrorFromResponse(null, TOAST_MESSAGE.COMPANY.USER.ADD_NEW.SUCCESS),
                showToast: true,
                status: 'success',
              }),
            );
          }
          setIsSubmitted(true);
          dispatch(onReLoadDataTableByLink({ isCreate: true }));
        } else {
          dispatch(
            onSetToastStatus({
              message: handleErrorFromResponse(null, TOAST_MESSAGE.COMPANY.USER.ADD_NEW.FAIL),
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
            message: handleErrorFromResponse(err, TOAST_MESSAGE.COMPANY.USER.ADD_NEW.FAIL),
            showToast: true,
            status: 'error',
          }),
        );
      });
  }

  function onHandleCreateByBulkClick(users: any) {
    if (users?.showPreviewIsValid) {
      setObjCreateOrEdit(prevState => ({ ...prevState, showModal: false }));
      setDataPreviewIsValid({
        showModal: true,
        data: users,
      });
    } else if (users?.showPreviewInValid) {
      setObjCreateOrEdit(prevState => ({ ...prevState, showModal: false }));
      setDataPreviewInValid({
        showModal: true,
        data: users,
      });
    }
  }

  function handleSelectRowKeys(key: React.Key[], listData?: any[]) {
    const idsSelected: string[] = getIdsSelectedByKeyFromTable(key, listData);
    setItemsSelected(idsSelected);
  }

  return (
    <>
      <MainWrapper title="ユーザー管理">
        <div className={'company-user-list-root'}>
          <div className="table-container">
            <TableLayout
              tableTitle={'ユーザー一覧'}
              tableApiLink={API_PATH.COMPANY_USER}
              listKeyName={{
                names: [
                  'ID',
                  'ユーザー名',
                  'グループ',
                  'メールアドレス',
                  '通知',
                  '最終ログイン日時',
                  '有効・無効',
                  'アクティベーション',
                ],
                keys: [
                  { keyName: 'user_id', sorter: true },
                  { keyName: 'user_name', sorter: true },
                  { keyName: 'group_name', sorter: true },
                  { keyName: 'email', sorter: true },
                  { keyName: 'contact_method', sorter: false },
                  { keyName: 'last_login_time', sorter: true },
                  { keyName: 'is_active_user_company', sorter: true },
                  { keyName: 'edit_btn_company_user', sorter: true },
                  { keyName: 'status', sorter: false },
                  { keyName: 'id', sorter: false },
                  { keyName: 'is_active', sorter: true },
                ],
              }}
              searchList={searchList}
              onActionItemById={handleActionItemById}
              onSelectedRows={handleSelectRowKeys}
              typeActionShow={actionTables}
              actionsOnTableFooter={[
                {
                  key: '1',
                  node: (
                    <div onClick={onClickSetting} className={'setting-action'}>
                      <img src={iconSetting} alt="icon" />
                      <div className={'label'}>通知テンプレート</div>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </MainWrapper>
      <CreateCompanyUser
        groupOptions={groupOptions}
        isSubmitted={isSubmitted}
        onClickSetting={() => onHandleClickSetting(DOING_ACTION.INDIVIDUAL)}
        onCreateOrEditClick={onHandleCreateOrEditClick}
        onCloseModal={onHandleClosePopUpCreateOrEdit}
        objCreateOrEdit={objCreateOrEdit}
        onCreateByBulkClick={onHandleCreateByBulkClick}
      />
      <EditCompanyUser
        groupOptions={groupOptions}
        objCreateOrEdit={objCreateOrEdit}
        onCloseModal={onHandleClosePopUpCreateOrEdit}
        onCreateOrEditClick={onHandleCreateOrEditClick}
      />
      <ModalDelete
        onCancelClick={() => setShowModalConfirmChangeActivate(false)}
        message={MSG_CONFIRM.CHANGE_ACTIVATE_USER}
        onOkClick={handleAgreeChangeActivate}
        title={'Change activate'}
        isModalVisible={showModalConfirmChangeActivate}
      >
        ARE YOU SURE
      </ModalDelete>
      <TemplateNotification
        isSubmitted={isSubmitted}
        objCreateOrEdit={objTemplate}
        onCloseModal={onHandleCloseTemplate}
        onCreateOrEditClick={onHandleCreateOrEditClickTemplate}
      />
      <ModalWarning
        title={'パスワードのリセット'}
        onCancelClick={() => setShowModalConfirmReset(false)}
        message={MSG_CONFIRM.RESET}
        onOkClick={handleAgreeResetItem}
        isModalVisible={showModalConfirmReset}
      >
        パスワードをリセットしてもよろしいですか?
      </ModalWarning>
      <PreviewCSVIsValid
        isSubmitted={isSubmitted}
        objDataPreview={dataPreviewIsValid}
        onClose={onClosePreviewIsValid}
        onSubmit={onHandleCreateByCSV}
        onClickSetting={() => onHandleClickSetting(DOING_ACTION.BULK_IS_VALID)}
      />
      <PreviewCSVInValid objDataPreview={dataPreviewInValid} onClose={onClosePreviewInValid} />
    </>
  );
};
export default UserManagement;
