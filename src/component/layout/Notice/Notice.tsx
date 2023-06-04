import MainWrapper from 'src/component/layout/MainWrapper/MainWrapper';
import './Notice.scss';
import { ACTION_ITEM_TABLE, API_PATH, TYPE_DOCUMENTS } from 'src/app/constant';
import TableLayout from 'src/component/layout/TableLayout/TableLayout';
import React, { useEffect, useRef, useState } from 'react';
import { getIdsSelectedByKeyFromTable, handleErrorFromResponse } from 'src/ultils/common';
import { useAppDispatch } from 'src/app/hooks';
import { get, put } from 'src/ultils/request';
import { onSetShowLoading, onSetToastStatus } from 'src/redux/auth/authSlice';
import { TOAST_MESSAGE } from 'src/app/validation_msg';
import { Empty } from 'antd';
import { onReLoadDataTableByLink } from 'src/redux/table/tableSlice';
import { TypeActionTableRowShowT } from 'src/component/layout/TableLayout/TableRowAction';
import iconWarning from 'src/assets/svg/badge-warning.svg';
import iconChecked from 'src/assets/svg/icon-checked.svg';
import DOMPurify from 'dompurify';
import EditApprovedModal from './EditApprovedModal/EditApprovedModal';
import EditApprovedCommonModal from './EditApprovedModal/EditApprovedCommonModal';
import ModalWarning from 'src/component/common/Modal/ModalWarning/ModalWarning';
import { ModalDelete, TextArea } from 'src/component/common';
function Notice() {
  const dispatch = useAppDispatch();
  const [documentIdsSelected, setDocumentIdsSelected] = useState<string[]>([]);
  const [contentNotification, setContentNotification] = useState('');
  const refTableLayout = useRef(null);
  const [contentSafe, setContentSafe] = useState<string>('');
  const [idEdit, setIdEdit] = useState<string>('');
  const [typeEdit, setTypeEdit] = useState<string>('');
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const [isShowModalWarning, setIsShowModalWarning] = useState<boolean>(false);
  const [isShowModalConfirm, setIsShowModalConfirm] = useState<boolean>(false);
  const [actionTables, setActionTables] = useState<TypeActionTableRowShowT[]>([
    {
      key: '1',
      label: '非承認',
      icon: iconWarning,
      onClick: onNonApprove,
      isDisable: true,
    },
    {
      key: '2',
      label: '承認',
      icon: iconChecked,
      onClick: onApprove,
      isDisable: true,
    },
  ]);
  const [rejectReason, serRejectReason] = useState<string>('');
  useEffect(() => {
    const sanitizedHtmlString = DOMPurify.sanitize(contentNotification);
    setContentSafe(sanitizedHtmlString);
  }, [contentNotification]);
  useEffect(() => {
    getContentNotification();
  }, []);

  useEffect(() => {
    const newAction = [...actionTables];
    if (documentIdsSelected?.length > 0) {
      newAction[0].isDisable = false;
      newAction[1].isDisable = false;
    } else {
      newAction[0].isDisable = true;
      newAction[1].isDisable = true;
    }
    setActionTables(newAction);
  }, [documentIdsSelected]);
  function getContentNotification() {
    dispatch(onSetShowLoading('loading'));
    get(API_PATH.COMPANY_NOTIFICATION_IIS)
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
      })
      .finally(() => {
        dispatch(onSetShowLoading('idle'));
      });
  }
  function handleSelectRowKeys(key: React.Key[], listData?: any[]) {
    const idsSelected: string[] = getIdsSelectedByKeyFromTable(key, listData);
    setDocumentIdsSelected(idsSelected);
  }

  function onHandleApprove() {
    dispatch(onSetShowLoading('loading'));
    put(API_PATH.COMPANY_APPROVE, { document_id: idEdit ? [idEdit] : documentIdsSelected })
      .then(res => {
        if (res) {
          dispatch(
            onSetToastStatus({
              message: TOAST_MESSAGE.COMPANY.NOTICE.APPROVE.SUCCESS,
              showToast: true,
              status: 'success',
            }),
          );
          setDocumentIdsSelected([]);
          dispatch(onReLoadDataTableByLink({ isDelete: true, isResetSelected: true }));
        }
      })
      .catch(err => {
        dispatch(
          onSetToastStatus({
            message: handleErrorFromResponse(err, TOAST_MESSAGE.COMPANY.NOTICE.APPROVE.FAIL),
            showToast: true,
            status: 'error',
          }),
        );
      })
      .finally(() => {
        dispatch(onSetShowLoading('idle'));
      });
  }

  function onHandleReject() {
    dispatch(onSetShowLoading('loading'));
    put(API_PATH.COMPANY_REJECT, { document_id: idEdit ? [idEdit] : documentIdsSelected, reject_reason: rejectReason })
      .then(res => {
        if (res) {
          dispatch(
            onSetToastStatus({
              message: TOAST_MESSAGE.COMPANY.NOTICE.REJECT.SUCCESS,
              showToast: true,
              status: 'success',
            }),
          );
          setDocumentIdsSelected([]);
          dispatch(onReLoadDataTableByLink({ isDelete: true, isResetSelected: true }));
        }
      })
      .catch(err => {
        dispatch(
          onSetToastStatus({
            message: handleErrorFromResponse(err, TOAST_MESSAGE.COMPANY.NOTICE.REJECT.FAIL),
            showToast: true,
            status: 'error',
          }),
        );
      })
      .finally(() => {
        dispatch(onSetShowLoading('idle'));
        serRejectReason('');
      });
  }

  function onNonApprove() {
    setIdEdit('');
    setIsShowModalWarning(true);
  }
  function onApprove() {
    setIdEdit('');
    setIsShowModalConfirm(true);
  }
  function handleActionItemById(id: string, actionType: number, type: any) {
    if (actionType === ACTION_ITEM_TABLE.EDIT) {
      setIsShowModal(true);
      setIdEdit(id);
      setTypeEdit(type);
    }
  }

  const onCancelEditApproval = (e: any) => {
    if (e?.target?.nodeName === 'DIV') {
      setIsShowModalWarning(true);
    }
    setIsShowModal(false);
  };
  const onOkEditApproval = () => {
    onHandleApprove();
    setIsShowModal(false);
  };
  const handleUnApproved = () => {
    setIsShowModalWarning(false);
    onHandleReject();
  };
  const handleApproved = () => {
    onHandleApprove();
    setIsShowModalConfirm(false);
  };

  return (
    <div>
      <MainWrapper title="お知らせ">
        <div className={'company-notice-root'}>
          <div
            style={refTableLayout?.current ? { height: '24rem' } : { height: '100%' }}
            className={`company-notice__container ${!contentNotification ? 'empty-data' : ''} `}
          >
            {contentNotification ? (
              // <div>{contentNotification}</div>
              <div dangerouslySetInnerHTML={{ __html: contentSafe }} />
            ) : (
              <Empty className={'empty-data'} image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </div>
          <div className="table-container">
            <TableLayout
              refTableLayout={refTableLayout}
              isHiddenEmptyData={true}
              tableTitle={'未承認一覧'}
              tableApiLink={API_PATH.COMPANY_APPROVE}
              listKeyName={{
                names: [
                  '書類名',
                  '書類種類',
                  '公開日時',
                  '参照期限',
                  '   ユーザー\n（グループ）',
                  '対象ユーザー',
                  'アクション',
                ],
                keys: [
                  { keyName: 'notice_name_custom', sorter: false },
                  { keyName: 'notice_type_custom', sorter: false },
                  { keyName: 'public_date', sorter: false },
                  { keyName: 'expired_date', sorter: false },
                  { keyName: 'group_name', sorter: false },
                  { keyName: 'number_of_target_users', sorter: false },
                  { keyName: 'edit_notcie_top_page', sorter: false },
                  { keyName: 'name', sorter: false },
                  { keyName: 'type', sorter: false },
                ],
              }}
              onActionItemById={handleActionItemById}
              onSelectedRows={handleSelectRowKeys}
              typeActionShow={actionTables}
            />
          </div>
        </div>
        <EditApprovedModal
          idEdit={idEdit}
          isShow={isShowModal && +typeEdit === +TYPE_DOCUMENTS.INDIVIDUAL}
          onCancelApproval={onCancelEditApproval}
          onOkApproval={onOkEditApproval}
        />
        <EditApprovedCommonModal
          idEdit={idEdit}
          isShow={isShowModal && +typeEdit === +TYPE_DOCUMENTS.COMMON}
          onCancelApproval={onCancelEditApproval}
          onOkApproval={onOkEditApproval}
        />
        <ModalDelete
          className="modal-unapproved-root"
          title={'非承認の理由'}
          onCancelClick={() => {
            setIsShowModalWarning(false);
            serRejectReason('');
          }}
          onOkClick={handleUnApproved}
          isModalVisible={isShowModalWarning}
          isDisable={rejectReason?.length > 0 ? false : true}
        >
          <div>ここに拒否の理由を入力してください。</div>
          <TextArea onChange={(e: any) => serRejectReason(e?.target?.value)} value={rejectReason} />
        </ModalDelete>
        <ModalWarning
          title={'パスワードのリセット'}
          onCancelClick={() => setIsShowModalConfirm(false)}
          onOkClick={handleApproved}
          isModalVisible={isShowModalConfirm}
        >
          パスワードをリセットしてもよろしいですか?
        </ModalWarning>
      </MainWrapper>
    </div>
  );
}

export default Notice;
