import './EditIndividualDocument.scss';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { Button, DatePickers, Input, Select } from 'src/component/common';
import { useEffect, useRef, useState } from 'react';
import {
  convertDateEnd,
  convertDateStart,
  downloadURI,
  generateId,
  handleErrorFromResponse,
  handleErrorFromResponseByKeyError,
  uploadToAzure,
} from 'src/ultils/common';
import { IItemDocumentSelected, IItemOption } from 'src/component/layout/Document/Document';
import { endDateDefault, startDateDefault } from 'src/component/layout/Document/Edit/Common/EditCommonDocumentSchema';
import IconDocument from 'src/assets/svg/icon-edit-document.svg';
import ModalCustom from 'src/component/common/Modal/ModalCustom/ModalCustom';
import { IFile } from 'src/component/layout/Document/New/DocumentNew';
import {
  API_PATH,
  DOCUMENT_APPROVE_STATUS,
  FILE_EXTEND_ARRAY,
  FILE_TYPE_UPLOAD_FOR_DOCUMENT,
  FORMAT_DATE_TIME,
  OPTIONS_DOCUMENT_TYPE,
} from 'src/app/constant';
import iconDownload from 'src/assets/svg/icon-download.svg';
import { get, post, put } from 'src/ultils/request';
import { onSetShowLoading, onSetToastStatus } from 'src/redux/auth/authSlice';
import { TOAST_MESSAGE } from 'src/app/validation_msg';
import { useAppDispatch } from 'src/app/hooks';
import {
  editIndividualDocumentDefaultValues,
  editIndividualDocumentSchema,
} from 'src/component/layout/Document/Edit/Individual/EditIndividualDocumentSchema';

export interface EditCommonDocumentPropsT {
  dataItemEdit: IItemDocumentSelected;
  groupOptions: IItemOption[];
  authorizerOptions: any[];
  onCloseModal: () => void;
  onEditClick: (company: any) => void;
}

interface IObjDisable {
  representative: boolean;
  authorizer: boolean;
  startDate: boolean;
  endDate: boolean;
  fileBtn: boolean;
}

const EditIndividualDocument = (props: EditCommonDocumentPropsT) => {
  const dispatch = useAppDispatch();
  const [objDisabled, setObjDisabled] = useState<IObjDisable>({
    representative: false,
    authorizer: false,
    startDate: false,
    endDate: false,
    fileBtn: false,
  });
  const {
    authorizerOptions = [],
    dataItemEdit = {
      showModalIndividual: false,
    },
    onCloseModal = () => null,
    onEditClick = () => null,
  } = props;
  const refUploadFile = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<IFile>();

  const {
    formState: { errors, isDirty, isValid },
    control,
    getValues,
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(editIndividualDocumentSchema()),
    mode: 'all',
    defaultValues: editIndividualDocumentDefaultValues,
  });

  function checkApprovalStatus(status: number) {
    if (status === DOCUMENT_APPROVE_STATUS.APPROVED) {
      setObjDisabled(prevState => ({
        ...prevState,
        authorizer: true,
        startDate: true,
        fileBtn: true,
        groupOption: true,
      }));
    }
  }

  function getDataConverted(dataBody: any) {
    const documentTypeString =
      OPTIONS_DOCUMENT_TYPE.find((item: any) => item.value === dataBody?.documentType + '')?.text || '';
    return {
      ...dataBody,
      documentType: documentTypeString,
      periodDate: {
        startDate: dataBody.publicDate,
        endDate: dataBody.expireDate,
      },
    };
  }

  useEffect(() => {
    if (dataItemEdit?.dataBody) {
      const dataConverted = getDataConverted(dataItemEdit?.dataBody);
      reset(dataConverted);
      checkApprovalStatus(
        dataItemEdit?.dataBody?.approvalStatus
          ? +dataItemEdit?.dataBody?.approvalStatus
          : DOCUMENT_APPROVE_STATUS.REVIEWING,
      );
    }
  }, [dataItemEdit]);

  function handleClickUploadFile() {
    if (refUploadFile && refUploadFile?.current) {
      refUploadFile?.current?.click();
    }
  }

  function onCancel() {
    onCloseModal();
  }

  function onUpdate(dataUpdate: {
    documents: { file_name: string; url: string; file_size: number }[];
    approver_id: string;
    representative_name: string;
    public_date: string;
    expired_date: string;
  }) {
    put(`${API_PATH.COMPANY_DOCUMENT}/${dataItemEdit.dataBody?.id}`, dataUpdate)
      .then((res: any) => {
        dispatch(onSetShowLoading('idle'));
        if (res && res?.status === 200) {
          dispatch(
            onSetToastStatus({
              message: TOAST_MESSAGE.COMPANY.DOCUMENT.UPDATE.SUCCESS,
              showToast: true,
              status: 'success',
            }),
          );
          onEditClick({
            dataBody: getValues(),
          });
        } else {
          dispatch(
            onSetToastStatus({
              message: TOAST_MESSAGE.COMPANY.DOCUMENT.UPDATE.FAIL,
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
            message: handleErrorFromResponse(err, TOAST_MESSAGE.COMPANY.DOCUMENT.UPDATE.FAIL),
            showToast: true,
            status: 'error',
          }),
        );
      });
  }

  function onSubmit() {
    const dataUpdate: any = {
      public_date: convertDateStart(getValues('periodDate').startDate),
      expired_date: convertDateEnd(getValues('periodDate').endDate),
      approver_id: getValues().authorizer,
      representative_name: getValues().representative,
    };
    if (file && dataItemEdit?.dataBody) {
      dispatch(onSetShowLoading('loading'));
      const bodyGetUrl = {
        file_name: file?.data?.name,
        file_size: file?.data?.size,
        content_type: file?.data?.type,
        document_type: +dataItemEdit?.dataBody.documentType,
      };
      post(API_PATH.COMPANY_DOCUMENT_GET_URL, bodyGetUrl)
        .then((resUrl: any) => {
          if (resUrl && resUrl?.data) {
            uploadToAzure(resUrl?.data.url, file)
              .then((resAzure: any) => {
                if (resAzure && resAzure?.status === 201) {
                  const arrTemp = resUrl?.data.url.split('?');
                  let urlMain = '';
                  if (arrTemp?.length > 0) {
                    urlMain = arrTemp[0];
                  }
                  dataUpdate['documents'] = [
                    {
                      file_name: file?.data?.name,
                      url: urlMain,
                      file_size: file?.data?.size,
                    },
                  ];
                  onUpdate(dataUpdate);
                } else {
                  dispatch(onSetShowLoading('idle'));
                  dispatch(
                    onSetToastStatus({
                      message: TOAST_MESSAGE.COMPANY.DOCUMENT.UPDATE.FAIL,
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
                    message: handleErrorFromResponse(err, TOAST_MESSAGE.COMPANY.DOCUMENT.UPDATE.FAIL),
                    showToast: true,
                    status: 'error',
                  }),
                );
              });
          } else {
            dispatch(onSetShowLoading('idle'));
            dispatch(
              onSetToastStatus({
                message: TOAST_MESSAGE.COMPANY.DOCUMENT.UPDATE.FAIL,
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
              message: handleErrorFromResponse(err, TOAST_MESSAGE.COMPANY.DOCUMENT.UPDATE.FAIL),
              showToast: true,
              status: 'error',
            }),
          );
        });
    } else {
      dataUpdate['documents'] = null;
      onUpdate(dataUpdate);
    }
  }

  function onDownloadFile() {
    if (dataItemEdit?.dataBody) {
      dispatch(onSetShowLoading('loading'));
      get(API_PATH.COMPANY_DOCUMENT_DOWNLOAD + '/' + dataItemEdit.dataBody.id)
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
  }

  const getNodeSettingOrDownload = () => {
    return (
      <div className={'setting-content-wrapper'} onClick={onDownloadFile}>
        <img src={iconDownload} alt="icon" />
        <div className={'label'}>ダウンロード</div>
      </div>
    );
  };

  function handleChangeUploadFile(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = event => {
      if (event) {
        if (!FILE_EXTEND_ARRAY.includes(file.type)) {
          dispatch(
            onSetToastStatus({
              message: handleErrorFromResponseByKeyError('Error file type'),
              showToast: true,
              status: 'error',
            }),
          );
        } else {
          setValue('documentName', file.name + ' ', { shouldDirty: true, shouldTouch: true });
          setFile({
            key: generateId(),
            data: file,
          });
        }
      }
    };
    reader.readAsText(file);
  }

  function onSelectTimes(data: any) {
    setValue('periodDate', data);
  }

  return (
    <ModalCustom
      className={'modal-edit-individual-document'}
      classNameExtendElementRight="setting-download-file-individual-editing"
      iconLeftPath={IconDocument}
      extendElementRight={getNodeSettingOrDownload()}
      onCancel={onCancel}
      title={'書類（個別）編集'}
      isShow={dataItemEdit?.showModalIndividual ? dataItemEdit?.showModalIndividual : false}
      okText={`編集`}
      cancelText={'キャンセル'}
      onSubmit={onSubmit}
      isDisable={!(isDirty && isValid)}
    >
      <div className={`edit-individual-document-root`}>
        <div className="form">
          <Controller
            control={control}
            name="documentType"
            render={({ field: { onChange, onBlur, value } }) => (
              <div className={'upload-files-bulk-wrapper'}>
                <Input
                  disable={true}
                  label={'書類種類'}
                  className="text-item"
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              </div>
            )}
          />
          <Controller
            control={control}
            name="representative"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                disable={objDisabled.representative}
                required={true}
                label={'書類名（代表） '}
                className="text-item"
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                textWarning={errors?.representative?.message ? errors?.representative?.message + '' : ''}
              />
            )}
          />
          <Controller
            control={control}
            name="authorizer"
            render={({ field: { onChange, onBlur, value } }) => (
              <Select
                disabled={objDisabled.authorizer}
                options={authorizerOptions}
                handleChange={onChange}
                required={true}
                label={'承認者 '}
                className="text-item"
                textWarning={errors?.authorizer?.message ? errors?.authorizer?.message + '' : ''}
                onBlur={onBlur}
                value={value}
              />
            )}
          />
          <Controller
            control={control}
            name="periodDate"
            render={({ field: { onChange, value } }) => (
              <div className="control-range-date">
                <div className="label">公開日〜期限日</div>
                <div className="range-date-wrapper">
                  <DatePickers
                    disabled={[objDisabled.startDate, objDisabled.endDate]}
                    onSelect={onSelectTimes}
                    showTimeArray={[true, false]}
                    customFormatShowTimes={[{ format: FORMAT_DATE_TIME.HOUR_00 }, undefined]}
                    value={value}
                    defaultValue={{
                      startDate: startDateDefault,
                      endDate: endDateDefault,
                    }}
                    label={['', '']}
                    onChange={onChange}
                  />
                </div>
              </div>
            )}
          />

          <Controller
            control={control}
            name="documentName"
            render={({ field: { onChange, onBlur, value } }) => (
              <div className={'upload-files-edit-document-wrapper'}>
                <Input
                  disable={true}
                  required={true}
                  label={'ファイル名'}
                  className="text-item item-upload"
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                />
                <Button
                  isDisable={objDisabled.fileBtn}
                  onClick={() => {
                    handleClickUploadFile();
                  }}
                  className={'btn-upload'}
                  name={'参照'}
                />
              </div>
            )}
          />
        </div>
      </div>
      <input
        onChange={event => handleChangeUploadFile(event)}
        ref={refUploadFile}
        id={'upload-files-edit-individual-document-id'}
        style={{ display: 'none' }}
        type="file"
        accept={FILE_TYPE_UPLOAD_FOR_DOCUMENT.toString()}
        onClick={(event: any) => {
          const { target } = event || {};
          target.value = '';
        }}
      />
    </ModalCustom>
  );
};

export default EditIndividualDocument;
