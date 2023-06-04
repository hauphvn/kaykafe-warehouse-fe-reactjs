import './AdminManageCompanies.scss';
import MainWrapper from 'src/component/layout/MainWrapper/MainWrapper';
import { ACTION_ITEM_TABLE, API_PATH, ELEMENT_LIST_SEARCH } from 'src/app/constant';
import TableLayout from 'src/component/layout/TableLayout/TableLayout';
import AdminCreateAndEditCompany, { TYPE_FILE_UPLOAD } from './CreateAndEditCompany/AdminCreateAndEditCompany';
import React, { useState } from 'react';
import { del, get, post, put } from 'src/ultils/request';
import { useAppDispatch } from 'src/app/hooks';
import { onSetShowLoading, onSetToastStatus } from 'src/redux/auth/authSlice';
import { MSG_CONFIRM, TOAST_MESSAGE } from 'src/app/validation_msg';
import { onReLoadDataTableByLink } from 'src/redux/table/tableSlice';
import { getIdsSelectedByKeyFromTable, handleErrorFromResponse, onResetPWD, uploadToAzure } from 'src/ultils/common';
import ModalDelete from 'src/component/common/Modal/ModalDelete/ModalDelete';
import { ACTION_TYPE, TypeActionTableRowShowT } from 'src/component/layout/TableLayout/TableRowAction';
import iconAddNew from 'src/assets/svg/icon-add-new.svg';
import iconRecycle from 'src/assets/svg/icon-recycle.svg';
import ModalWarning from 'src/component/common/Modal/ModalWarning/ModalWarning';

export type ObjectCreateOrEdit = {
  isEdit: boolean;
  showModal: boolean;
  itemSelected?: any;
};

const AdminManageCompanies = () => {
  const dispatch = useAppDispatch();
  const searchList = [
    { label: '企業名', key: 'company_name', type: ELEMENT_LIST_SEARCH.INPUT, placeHolder: '企業名を入力して下さい' },
  ];
  const [showModalConfirmDel, setShowModalConfirmDel] = useState(false);
  const [objCreateOrEdit, setObjCreateOrEdit] = useState<ObjectCreateOrEdit>({
    isEdit: false,
    showModal: false,
  });
  const [companyIdsSelected, setCompanyIdsSelected] = useState<string[]>([]);
  const [showModalConfirmReset, setShowModalConfirmReset] = useState(false);
  const [companyIdActionOnTable, setCompanyIdActionOnTable] = useState<string>('');

  function onDeleteItems() {
    setShowModalConfirmDel(true);
  }

  const actionTables: TypeActionTableRowShowT[] = [
    {
      key: '1',
      label: '削除',
      icon: iconRecycle,
      onClick: onDeleteItems,
      actionType: ACTION_TYPE.DELETE,
      isDisable: companyIdsSelected.length === 0,
    },
    {
      key: '2',
      label: '新規登録',
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

  function getUrlForFile(param: any, type: TYPE_FILE_UPLOAD, dataBody: any) {
    const body = {
      file_name: param.file_name,
      file_size: param.file_size,
      content_type: param.content_type,
    };
    return new Promise((resolve, reject) => {
      post(API_PATH.ADMIN_COMPANY_UPLOAD, body)
        .then((resUrl: any) => {
          if (resUrl && resUrl?.data) {
            uploadToAzure(resUrl?.data.url, type)
              .then((resAzure: any) => {
                if (resAzure && resAzure?.status === 201) {
                  const arrTemp = resUrl?.data.url.split('?');
                  let urlMain = '';
                  if (arrTemp?.length > 0) {
                    urlMain = arrTemp[0];
                  }
                  const fileTypeObj = {
                    name: param.file_name,
                    url: urlMain,
                  };
                  if (type === TYPE_FILE_UPLOAD.TERMS) {
                    dataBody['terms'] = fileTypeObj;
                  } else if (type === TYPE_FILE_UPLOAD.POLICY) {
                    dataBody['policy'] = fileTypeObj;
                  } else if (type === TYPE_FILE_UPLOAD.RECOMMEND) {
                    dataBody['recommend'] = fileTypeObj;
                  }
                  resolve(dataBody);
                } else {
                  reject({ ...param, status: false });
                }
              })
              .catch(() => {
                reject({ ...param, status: false });
              });
          } else {
            reject({ ...param, status: false });
          }
        })
        .catch(() => {
          reject({ ...param, status: false });
        });
    });
  }

  function onHandleCreateOrEditClick(company: any) {
    dispatch(onSetShowLoading('loading'));
    let dataBody: any = {
      company_id: company.companyId,
      company_name: company.companyName,
      representative_manager: company.representativeManager,
      color_id: company.color,
      phone_number: company.phone,
      email: company.email,
    };
    let promises: any[] = [];
    if (!objCreateOrEdit?.isEdit) {
      dataBody = {
        ...dataBody,
        terms: null,
        policy: null,
        recommend: null,
      };
      promises = [
        getUrlForFile(
          {
            file_name: company.dataUpload.terms.data.name,
            file_size: company.dataUpload.terms.data.size,
            content_type: company.dataUpload.terms.data.type,
          },
          TYPE_FILE_UPLOAD.TERMS,
          dataBody,
        ),
        getUrlForFile(
          {
            file_name: company.dataUpload.policy.data.name,
            file_size: company.dataUpload.policy.data.size,
            content_type: company.dataUpload.policy.data.type,
          },
          TYPE_FILE_UPLOAD.POLICY,
          dataBody,
        ),
        getUrlForFile(
          {
            file_name: company.dataUpload.recommend.data.name,
            file_size: company.dataUpload.recommend.data.size,
            content_type: company.dataUpload.recommend.data.type,
          },
          TYPE_FILE_UPLOAD.RECOMMEND,
          dataBody,
        ),
      ];
    } else {
      if (company.dataUpload?.terms?.data) {
        promises.push(
          getUrlForFile(
            {
              file_name: company.dataUpload.terms.data.name,
              file_size: company.dataUpload.terms.data.size,
              content_type: company.dataUpload.terms.data.type,
            },
            TYPE_FILE_UPLOAD.TERMS,
            dataBody,
          ),
        );
      }
      if (company.dataUpload?.recommend?.data) {
        promises.push(
          getUrlForFile(
            {
              file_name: company.dataUpload.recommend.data.name,
              file_size: company.dataUpload.recommend.data.size,
              content_type: company.dataUpload.recommend.data.type,
            },
            TYPE_FILE_UPLOAD.RECOMMEND,
            dataBody,
          ),
        );
      }
      if (company.dataUpload?.policy?.data) {
        promises.push(
          getUrlForFile(
            {
              file_name: company.dataUpload.policy.data.name,
              file_size: company.dataUpload.policy.data.size,
              content_type: company.dataUpload.policy.data.type,
            },
            TYPE_FILE_UPLOAD.POLICY,
            dataBody,
          ),
        );
      }
    }
    Promise.all(promises)
      .then((results: any) => {
        if (results) {
          if (!objCreateOrEdit?.isEdit) {
            const size = results?.length;
            for (let i = size - 1; i >= 0; i--) {
              if (
                Object.prototype.hasOwnProperty.call(results[i], 'terms') &&
                Object.prototype.hasOwnProperty.call(results[i], 'policy') &&
                Object.prototype.hasOwnProperty.call(results[i], 'recommend')
              ) {
                post(API_PATH.ADMIN_COMPANY, dataBody)
                  .then((res: any) => {
                    if (res && res.status === 200) {
                      setObjCreateOrEdit(prevState => ({ ...prevState, showModal: false }));
                      dispatch(
                        onSetToastStatus({
                          message: TOAST_MESSAGE.ADMIN_MANAGEMENT.COMPANY.ADD_NEW.SUCCESS,
                          showToast: true,
                          status: 'success',
                        }),
                      );
                      dispatch(onReLoadDataTableByLink({ isCreate: true }));
                    } else {
                      onDispatchErrorResponse(TOAST_MESSAGE.ADMIN_MANAGEMENT.COMPANY.ADD_NEW.FAIL);
                    }
                  })
                  .catch(err => {
                    dispatch(onReLoadDataTableByLink({ isCreate: true }));
                    onDispatchErrorResponse(
                      handleErrorFromResponse(err, TOAST_MESSAGE.ADMIN_MANAGEMENT.COMPANY.ADD_NEW.FAIL),
                    );
                  });
                break;
              }
            }
          } else {
            put(`${API_PATH.ADMIN_COMPANY}/${objCreateOrEdit?.itemSelected?.id}`, dataBody)
              .then((res: any) => {
                if (res && res.status === 200) {
                  setObjCreateOrEdit(prevState => ({ ...prevState, showModal: false }));
                  dispatch(
                    onSetToastStatus({
                      message: TOAST_MESSAGE.ADMIN_MANAGEMENT.COMPANY.UPDATE.SUCCESS,
                      showToast: true,
                      status: 'success',
                    }),
                  );
                  dispatch(onReLoadDataTableByLink({ isEdit: true }));
                } else {
                  onDispatchErrorResponse(TOAST_MESSAGE.ADMIN_MANAGEMENT.COMPANY.UPDATE.FAIL);
                }
              })
              .catch(err => {
                onDispatchErrorResponse(
                  handleErrorFromResponse(err, TOAST_MESSAGE.ADMIN_MANAGEMENT.COMPANY.UPDATE.FAIL),
                );
              });
          }
        } else {
          dispatch(onSetShowLoading('idle'));
          dispatch(
            onSetToastStatus({
              message: !objCreateOrEdit?.isEdit
                ? TOAST_MESSAGE.ADMIN_MANAGEMENT.COMPANY.ADD_NEW.FAIL
                : TOAST_MESSAGE.ADMIN_MANAGEMENT.COMPANY.UPDATE.FAIL,
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
            message: !objCreateOrEdit?.isEdit
              ? handleErrorFromResponse(err, TOAST_MESSAGE.ADMIN_MANAGEMENT.COMPANY.ADD_NEW.FAIL)
              : handleErrorFromResponse(err, TOAST_MESSAGE.ADMIN_MANAGEMENT.COMPANY.UPDATE.FAIL),
            showToast: true,
            status: 'error',
          }),
        );
      });
  }

  function handleActionItemById(id: string, actionType: number) {
    if (actionType === ACTION_ITEM_TABLE.EDIT) {
      dispatch(onSetShowLoading('loading'));
      get(`${API_PATH.ADMIN_COMPANY}/${id}`)
        .then((res: any) => {
          if (res && res?.data) {
            const companyEdit = {
              email: res.data?.email,
              companyName: res.data?.company_name,
              companyId: res.data?.company_id,
              representativeManager: res.data?.representative_manager,
              phone: res?.data?.phone_number,
              recommendENV: res.data?.recommend?.name,
              privatePolicy: res.data?.policy?.name,
              termsOfService: res.data?.terms?.name,
              id: res.data?.id,
              color: res.data?.color_id,
            };
            setObjCreateOrEdit({
              itemSelected: companyEdit,
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
    } else if (actionType === ACTION_ITEM_TABLE.DELETE) {
      setShowModalConfirmDel(true);
      setCompanyIdsSelected([id]);
    } else if (actionType === ACTION_ITEM_TABLE.RESET) {
      setShowModalConfirmReset(true);
      setCompanyIdActionOnTable(id);
    }
  }

  function handleSelectRowKeys(key: React.Key[], listData?: any[]) {
    const idsSelected: string[] = getIdsSelectedByKeyFromTable(key, listData);
    setCompanyIdsSelected(idsSelected);
  }

  function handleAgreeDeleteCompanies() {
    setShowModalConfirmDel(false);
    dispatch(onSetShowLoading('loading'));
    return del(`${API_PATH.ADMIN_COMPANY}`, companyIdsSelected)
      .then(res => {
        if (res && res?.status === 200) {
          dispatch(
            onSetToastStatus({
              message: TOAST_MESSAGE.ADMIN_MANAGEMENT.COMPANY.DELETE.SUCCESS,
              showToast: true,
              status: 'success',
            }),
          );
        } else {
          dispatch(
            onSetToastStatus({
              message: TOAST_MESSAGE.ADMIN_MANAGEMENT.COMPANY.DELETE.FAIL,
              showToast: true,
              status: 'error',
            }),
          );
        }
        setCompanyIdsSelected([]);
        dispatch(onReLoadDataTableByLink({ isDelete: true }));
      })
      .catch(err => {
        onDispatchErrorResponse(handleErrorFromResponse(err, TOAST_MESSAGE.ADMIN_MANAGEMENT.COMPANY.DELETE.FAIL));
      });
  }

  function handleAgreeResetItem() {
    setShowModalConfirmReset(false);
    dispatch(onSetShowLoading('loading'));
    onResetPWD(companyIdActionOnTable)
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
      <MainWrapper title="契約企業管理">
        <div className={'iis-management-companies-root'}>
          <div className="table-container">
            <TableLayout
              tableTitle={'企業一覧'}
              tableApiLink={API_PATH.ADMIN_COMPANY}
              listKeyName={{
                names: [
                  '企業名',
                  '代表管理者',
                  '電話番号',
                  'メールアドレス',
                  '社員数',
                  'グループ数',
                  '容量(GB)',
                  'ファイル数',
                  'アクション',
                ],
                keys: [
                  { keyName: 'company_name', sorter: true },
                  { keyName: 'representative_manager', sorter: true },
                  { keyName: 'phone_number', sorter: true },
                  { keyName: 'email', sorter: true },
                  { keyName: 'number_of_employees', sorter: true },
                  { keyName: 'number_of_groups', sorter: true },
                  { keyName: 'capacity', sorter: true },
                  { keyName: 'number_of_files', sorter: true },
                  { keyName: 'edit_act_iis_company', sorter: false },
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
      <AdminCreateAndEditCompany
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

export default AdminManageCompanies;
