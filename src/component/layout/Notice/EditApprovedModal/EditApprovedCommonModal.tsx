import ModalCustom from 'src/component/common/Modal/ModalCustom/ModalCustom';
import './EditApprovedModal.scss';
import iconNoticeDocument from 'src/assets/svg/icon_notice_document.svg';
import { DatePickers, Input } from 'src/component/common';
import iconDownload from 'src/assets/svg/icon-download.svg';
import { useEffect, useState } from 'react';
import { get } from 'src/ultils/request';
import { API_PATH, FORMAT_DATE_TIME } from 'src/app/constant';
import { onSetShowLoading, onSetToastStatus } from 'src/redux/auth/authSlice';
import { downloadURI, getDocumentTypeByTypeNumber, handleErrorFromResponse } from 'src/ultils/common';
import { useAppDispatch } from 'src/app/hooks';
import { TOAST_MESSAGE } from 'src/app/validation_msg';

interface EditApprovedCommonModalPropsI {
  onCancelApproval: (e?: any) => void;
  onOkApproval: () => void;
  isShow: boolean;
  idEdit: string;
}
function EditApprovedCommonModal(props: EditApprovedCommonModalPropsI) {
  const { onCancelApproval, onOkApproval, isShow, idEdit } = props;
  const dispatch = useAppDispatch();
  const [data, setData] = useState<any>({});

  useEffect(() => {
    if (idEdit && isShow) {
      getApproveInfo(idEdit);
    }
  }, [idEdit, isShow]);

  const getApproveInfo = (id: string | number) => {
    dispatch(onSetShowLoading('loading'));
    get(API_PATH.COMPANY_APPROVE + '/' + id)
      .then(res => {
        if (res?.data) {
          setData(res?.data);
        }
      })
      .catch(err => {
        dispatch(
          onSetToastStatus({
            message: handleErrorFromResponse(err, TOAST_MESSAGE.COMPANY.NOTICE.GET_DETAIL.FAIL),
            showToast: true,
            status: 'error',
          }),
        );
      })
      .finally(() => {
        dispatch(onSetShowLoading('idle'));
      });
  };
  function onClickDownload() {
    dispatch(onSetShowLoading('loading'));
    get(API_PATH.COMPANY_DOCUMENT_DOWNLOAD + '/' + idEdit)
      .then((res: any) => {
        if (res?.data) {
          downloadURI(res?.data?.url);
        }
      })
      .catch(err => {
        dispatch(
          onSetToastStatus({
            message: handleErrorFromResponse(err, TOAST_MESSAGE.COMPANY.NOTICE.DOWNLOAD.FAIL),
            showToast: true,
            status: 'error',
          }),
        );
      })
      .finally(() => {
        dispatch(onSetShowLoading('idle'));
      });
  }
  const getNodeSettingOrDownload = () => {
    return (
      <div className={'download-content-wrapper'} onClick={onClickDownload}>
        <img src={iconDownload} alt="icon" />
        <div className={'label'}>ファイル・ダウンロード</div>
      </div>
    );
  };

  return (
    <ModalCustom
      destroyOnClose={true}
      classNameExtendElementRight="download-file"
      className={'modal-edit-notice-approved'}
      iconLeftPath={iconNoticeDocument}
      onCancel={onCancelApproval}
      title={'書類（共通）承認'}
      isShow={isShow}
      okText={`承認`}
      cancelText={'非承認'}
      onSubmit={onOkApproval}
      isDisable={false}
      extendElementRight={getNodeSettingOrDownload()}
    >
      <div className={'notice-approved-edit-root'}>
        <div className={'notice-approved-detail-module-root'}>
          <div className="form">
            <Input
              label={'書類種類'}
              className="text-item"
              value={getDocumentTypeByTypeNumber(data?.document_type)}
              disable={true}
            />
            <Input label={'ファイル名'} className="text-item" value={data?.document_name} disable={true} />
            <DatePickers
              formats={[FORMAT_DATE_TIME.DATE_TIME_TEXT_MINUTE, FORMAT_DATE_TIME.DATE_FULL_SLASH]}
              value={{ startDate: data?.public_date, endDate: data?.expired_date }}
              showTimeArray={[true, false]}
              label={['公開日〜期限日']}
              disabledDates={[false, false]}
              disabled={[true, true]}
            />
            <div className="group-block">
              <label className="label">グループ </label>
              <ul className="group-list">
                {data?.groups_name?.map((item: string | number, index: number) => {
                  return <li key={index}>{item}</li>;
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ModalCustom>
  );
}

export default EditApprovedCommonModal;
