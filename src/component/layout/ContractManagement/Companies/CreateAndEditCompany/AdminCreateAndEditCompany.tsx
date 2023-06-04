import './AdminCreateAndEditCompany.scss';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { Button, Input } from 'src/component/common';
import { useEffect, useRef, useState } from 'react';
import {
  companyDetailSchema,
  defaultValues,
} from 'src/component/layout/ContractManagement/Companies/CreateAndEditCompany/CompanyDetailSchema';
import { ObjectCreateOrEdit } from 'src/component/layout/ContractManagement/Companies/AdminManageCompanies';
import ModalCustom from 'src/component/common/Modal/ModalCustom/ModalCustom';
import IconUserAddingPath from 'src/assets/svg/icon-user-add-new.svg';
import ColorSelect from 'src/component/common/ColorSelect/ColorSelect';
import { useAppDispatch } from 'src/app/hooks';
import { onSetShowLoading, onSetToastStatus } from 'src/redux/auth/authSlice';
import { get } from 'src/ultils/request';
import { API_PATH, FILE_EXTEND_UPLOAD, SIZE_FILE } from 'src/app/constant';
import { TOAST_MESSAGE } from 'src/app/validation_msg';
import { handleErrorFromResponse } from 'src/ultils/common';

type IISCreateAndEditCompanyProps = {
  objCreateOrEdit: ObjectCreateOrEdit;
  onCloseModal: () => void;
  onCreateOrEditClick: (company: any) => void;
};

export enum TYPE_FILE_UPLOAD {
  TERMS,
  POLICY,
  RECOMMEND,
  USER_COMPANY_BULK,
}

interface FileUploadCompanyT {
  terms: {
    data: any;
  };
  policy: {
    data: any;
  };
  recommend: {
    data: any;
  };
}

export interface MarkUpdateFileI {
  terms: boolean;
  policy: boolean;
  recommend: boolean;
}

const AdminCreateAndEditCompany = (props: IISCreateAndEditCompanyProps) => {
  const refUploadFile = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const [colorsList, setColorsList] = useState<any[]>([]);
  const [colorCurrent, setColorCurrent] = useState<any>({
    backgroundColor: '',
    textColor: '',
  });
  const [markUpdateFile, setMarkUpdateFile] = useState<MarkUpdateFileI>({
    terms: false,
    policy: false,
    recommend: false,
  });
  const [fileTypeUploading, setFileTypeUploading] = useState(-1);
  const [fileUploadCompany, setFileUploadCompany] = useState<FileUploadCompanyT>({
    policy: {
      data: null,
    },
    terms: {
      data: null,
    },
    recommend: {
      data: null,
    },
  });
  const {
    objCreateOrEdit = { isEdit: false, showModal: false },
    onCloseModal = () => null,
    onCreateOrEditClick = () => null,
  } = props;
  const {
    formState: { errors, isDirty, isValid },
    control,
    getValues,
    reset,
    setValue,
    trigger,
  } = useForm({
    resolver: yupResolver(companyDetailSchema()),
    mode: 'all',
    defaultValues: defaultValues,
  });

  useEffect(() => {
    getColors();
  }, []);
  useEffect(() => {
    if (!objCreateOrEdit.isEdit) {
      reset(defaultValues);
    } else {
      if (objCreateOrEdit?.itemSelected) {
        reset({
          email: objCreateOrEdit.itemSelected?.email,
          companyName: objCreateOrEdit.itemSelected?.companyName,
          companyId: objCreateOrEdit.itemSelected?.companyId,
          representativeManager: objCreateOrEdit.itemSelected?.representativeManager,
          recommendENV: objCreateOrEdit.itemSelected?.recommendENV,
          privatePolicy: objCreateOrEdit.itemSelected?.privatePolicy,
          termsOfService: objCreateOrEdit.itemSelected?.termsOfService,
          color: objCreateOrEdit.itemSelected?.color,
          phone: objCreateOrEdit.itemSelected.phone,
        });
        preOnChangeColor(objCreateOrEdit.itemSelected?.color);
      }
    }
    return () => {
      if (colorsList?.length > 0) {
        setColorCurrent({
          backgroundColor: colorsList[0].backgroundColor,
          textColor: colorsList[0].textColor,
        });
      }
    };
  }, [objCreateOrEdit.showModal]);

  function getColors() {
    dispatch(onSetShowLoading('loading'));
    get(API_PATH.COMMON_COLOR)
      .then((res: any) => {
        dispatch(onSetShowLoading('idle'));
        if (res && res?.data?.data) {
          const objColors: any[] = [];
          res?.data?.data.forEach((color: any, i: number) => {
            if (i === res?.data?.data?.length - 1) {
              setColorCurrent({
                backgroundColor: color['background-color'],
                textColor: color['text-color'],
              });
            }
            objColors.unshift({
              backgroundColor: color['background-color'],
              textColor: color['text-color'],
              id: color?.id,
            });
          });
          setColorsList(objColors);
        } else {
          dispatch(
            onSetToastStatus({
              message: TOAST_MESSAGE.COMMON.COLOR.GET_ALL.FAIL,
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
            message: handleErrorFromResponse(err, TOAST_MESSAGE.COMMON.COLOR.GET_ALL.FAIL),
            showToast: true,
            status: 'error',
          }),
        );
      });
  }

  function onSubmit() {
    const body: any = {
      ...getValues(),
      color: getValues().color ? getValues().color : colorsList[0].id,
      termsOfService: getValues().termsOfService.trim(),
      privatePolicy: getValues().privatePolicy.trim(),
      recommendENV: getValues().recommendENV.trim(),
      dataUpload: fileUploadCompany,
    };
    if (objCreateOrEdit?.isEdit) {
      body['markUpdateFile'] = markUpdateFile;
    }
    if (body) {
      onCreateOrEditClick(body);
    }
  }

  function onCancel() {
    onCloseModal();
  }

  function preOnChangeColor(id: string) {
    setValue('color', id);
    trigger('color');
    const indexColor = colorsList?.findIndex((color: any) => color.id === id);
    if (indexColor > -1) {
      setColorCurrent(colorsList[indexColor]);
    }
  }

  function handleChangeUploadFile(event: any) {
    const file = event.target.files[0];
    if (file && file.type === FILE_EXTEND_UPLOAD.PDF) {
      if (file.size > SIZE_FILE.MAX_SIZE_UPLOAD_FOR_COMPANY_FILE * 1024 * 1024) {
        dispatch(
          onSetToastStatus({
            message: TOAST_MESSAGE.COMMON.FILE.OVER_SIZE_100MB,
            showToast: true,
            status: 'error',
          }),
        );
      } else {
        const reader = new FileReader();
        reader.onloadend = event => {
          if (event) {
            switch (fileTypeUploading) {
              case TYPE_FILE_UPLOAD.TERMS:
                setFileUploadCompany(prevState => ({
                  ...prevState,
                  terms: {
                    data: file,
                  },
                }));
                setValue('termsOfService', file.name + ' ', { shouldDirty: true, shouldTouch: true });
                trigger('termsOfService');
                if (objCreateOrEdit?.isEdit) {
                  setMarkUpdateFile(prevState => ({
                    ...prevState,
                    terms: true,
                  }));
                }
                break;
              case TYPE_FILE_UPLOAD.POLICY:
                setFileUploadCompany(prevState => ({
                  ...prevState,
                  policy: {
                    data: file,
                  },
                }));
                setValue('privatePolicy', file.name + ' ', { shouldDirty: true, shouldTouch: true });
                trigger('privatePolicy');
                if (objCreateOrEdit?.isEdit) {
                  setMarkUpdateFile(prevState => ({
                    ...prevState,
                    policy: true,
                  }));
                }
                break;
              case TYPE_FILE_UPLOAD.RECOMMEND:
                setFileUploadCompany(prevState => ({
                  ...prevState,
                  recommend: {
                    data: file,
                  },
                }));
                setValue('recommendENV', file.name + ' ', { shouldDirty: true, shouldTouch: true });
                trigger('recommendENV');
                if (objCreateOrEdit?.isEdit) {
                  setMarkUpdateFile(prevState => ({
                    ...prevState,
                    recommend: true,
                  }));
                }
                break;
            }
          }
        };
        reader.readAsText(file);
      }
    } else {
      dispatch(
        onSetToastStatus({
          message: TOAST_MESSAGE.COMMON.FILE.PDF.NOT_ALLOW,
          showToast: true,
          status: 'error',
        }),
      );
    }
  }

  function handleClickUploadFile(typeFile: TYPE_FILE_UPLOAD) {
    if (refUploadFile && refUploadFile?.current) {
      setFileTypeUploading(typeFile);
      refUploadFile?.current?.click();
    }
  }

  return (
    <div className={'admin-create-edit-company-root'}>
      <ModalCustom
        className={'modal-admin-create-edit-company'}
        classNameExtendElementRight="setting-template-create-edit-company"
        iconLeftPath={IconUserAddingPath}
        onCancel={onCancel}
        title={`${objCreateOrEdit?.isEdit ? '契約企業編集' : '契約企業登録'}`}
        isShow={objCreateOrEdit.showModal}
        okText={`${objCreateOrEdit?.isEdit ? '編集' : '登録'}`}
        cancelText={'キャンセル'}
        onSubmit={onSubmit}
        isDisable={!(isDirty && isValid)}
      >
        <div className={'iis-add-new-and-edit-company-root'}>
          <div className={'iis-company-detail-module-root'}>
            <div className="form">
              <Controller
                control={control}
                name="companyId"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    required={true}
                    label={'企業ID *'}
                    className="text-item"
                    textWarning={errors?.companyId?.message ? errors?.companyId?.message + '' : ''}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    disable={objCreateOrEdit?.isEdit}
                    placeholder={'企業IDを入力して下さい'}
                  />
                )}
              />

              <Controller
                control={control}
                name="companyName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    required={true}
                    label={'企業名'}
                    className="text-item"
                    textWarning={errors?.companyName?.message ? errors?.companyName?.message + '' : ''}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    placeholder={'企業名を入力して下さい'}
                  />
                )}
              />

              <Controller
                control={control}
                name="representativeManager"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    required={true}
                    label={'代表管理者'}
                    className="text-item"
                    textWarning={
                      errors?.representativeManager?.message ? errors?.representativeManager?.message + '' : ''
                    }
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    placeholder={'代表管理者を入力して下さい'}
                  />
                )}
              />

              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    required={true}
                    label={'電話番号'}
                    className="text-item"
                    textWarning={errors?.phone?.message ? errors?.phone?.message + '' : ''}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    placeholder={'電話番号を入力して下さい'}
                  />
                )}
              />

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    required={true}
                    label={'メールアドレス'}
                    className="text-item"
                    textWarning={errors?.email?.message ? errors?.email?.message + '' : ''}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    placeholder={'メールアドレスを入力して下さい'}
                  />
                )}
              />

              <Controller
                control={control}
                name="termsOfService"
                render={({ field: { onChange, onBlur, value } }) => (
                  <div className={'upload-file-wrapper'}>
                    <Input
                      disable={true}
                      required={true}
                      label={'利用規約'}
                      className="text-item"
                      textWarning={errors?.termsOfService?.message ? errors?.termsOfService?.message + '' : ''}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      placeholder={'ファイルを参照して下さい'}
                    />
                    <Button
                      onClick={() => {
                        handleClickUploadFile(TYPE_FILE_UPLOAD.TERMS);
                      }}
                      className={'btn-upload'}
                      name={'参照'}
                    />
                  </div>
                )}
              />

              <Controller
                control={control}
                name="privatePolicy"
                render={({ field: { onChange, onBlur, value } }) => (
                  <div className={'upload-file-wrapper'}>
                    <Input
                      disable={true}
                      required={true}
                      label={'プライバシー・ポリシー '}
                      className="text-item"
                      textWarning={errors?.privatePolicy?.message ? errors?.privatePolicy?.message + '' : ''}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      placeholder={'ファイルを参照して下さい'}
                    />
                    <Button
                      onClick={() => {
                        handleClickUploadFile(TYPE_FILE_UPLOAD.POLICY);
                      }}
                      className={'btn-upload'}
                      name={'参照'}
                    />
                  </div>
                )}
              />

              <Controller
                control={control}
                name="recommendENV"
                render={({ field: { onChange, onBlur, value } }) => (
                  <div className={'upload-file-wrapper'}>
                    <Input
                      disable={true}
                      required={true}
                      label={'推奨環境'}
                      className="text-item"
                      textWarning={errors?.recommendENV?.message ? errors?.recommendENV?.message + '' : ''}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      placeholder={'ファイルを参照して下さい'}
                    />
                    <Button
                      onClick={() => {
                        handleClickUploadFile(TYPE_FILE_UPLOAD.RECOMMEND);
                      }}
                      className={'btn-upload'}
                      name={'参照'}
                    />
                  </div>
                )}
              />
              <div>
                <div className={'control-wrapper'}>
                  <div className="control">
                    <Controller
                      control={control}
                      name="color"
                      render={({ field: { onBlur, value, onChange } }) => (
                        <ColorSelect
                          required={true}
                          colorsList={colorsList}
                          onChange={(event: any) => {
                            preOnChangeColor(event);
                            onChange(event);
                          }}
                          label={'ブランド色'}
                          onBlur={onBlur}
                          value={value}
                          textWarning={errors?.color?.message ? errors?.color?.message + '' : ''}
                        />
                      )}
                    />
                  </div>
                  <div
                    style={{
                      backgroundColor: colorCurrent.backgroundColor,
                      color: colorCurrent.textColor,
                    }}
                    className="color-preview-wrapper"
                  >
                    <div>サンプル</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ModalCustom>
      <input
        onChange={event => handleChangeUploadFile(event)}
        ref={refUploadFile}
        id={'upload-files-company-id'}
        style={{ display: 'none' }}
        type="file"
        accept={FILE_EXTEND_UPLOAD.PDF}
        onClick={(event: any) => {
          const { target } = event || {};
          target.value = '';
        }}
      />
    </div>
  );
};

export default AdminCreateAndEditCompany;
