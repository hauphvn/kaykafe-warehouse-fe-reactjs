import MainWrapper from 'src/component/layout/MainWrapper/MainWrapper';
import 'src/component/layout/Document/New/DocumentNew.scss';
import { Button, Checkbox, DatePickers, Input, Select, Table } from 'src/component/common';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import {
  defaultValues,
  documentSchema,
  endDateDefault,
  startDateDefault,
} from 'src/component/layout/Document/New/DocumentSchema';
import {
  ACTION_ITEM_TABLE,
  API_PATH,
  CONTACT_TYPE,
  FILE_EXTEND_ARRAY,
  FILE_EXTEND_UPLOAD,
  FILE_TYPE_UPLOAD_FOR_DOCUMENT,
  FORMAT_DATE_TIME,
  HEIGHT_TABLE,
  KEYS_DISABLED_SELECT_TABLE_ROW,
  MESSAGE_UPLOAD_DOCUMENT,
  NAVIGATION_PATH,
  OPTIONS_DOCUMENT_TYPE,
  REGEX_FILE_NAME_DOCUMENT_UPLOAD,
  SIZE_FILE,
  TYPE_COMMON_GET_ALL_API,
  TYPE_DOCUMENTS,
} from 'src/app/constant';
import { IconUpload } from 'src/assets/icons';
import React, { useEffect, useRef, useState } from 'react';
import { onSetShowLoading, onSetToastStatus } from 'src/redux/auth/authSlice';
import { get, post } from 'src/ultils/request';
import {
  convertDateEnd,
  convertDateStart,
  delayNavigate,
  generateId,
  getIconExtendFile,
  getIdsSelectedByKeyFromTable,
  handleErrorFromResponse,
  handleErrorFromResponseByKeyError,
  uploadToAzure,
} from 'src/ultils/common';
import { TOAST_MESSAGE } from 'src/app/validation_msg';
import { useAppDispatch } from 'src/app/hooks';
import IconSetting from 'src/assets/svg/icon-setting-bold.svg';
import ExcelPNG from 'src/assets/imgs/excel-file.png';
import PDFImg from 'src/assets/imgs/pdf-file.png';
import DocumentInValid, { IObjDataPreview } from 'src/component/layout/Document/New/InValid/DocumentInValid';
import { useNavigate } from 'react-router-dom';
import ImageUpload from 'src/assets/svg/icon-img-upload.svg';
import DocsUpload from 'src/assets/svg/icon-docs-upload.svg';
import OthersFileUpload from 'src/assets/svg/icon-others-file-upload.svg';
import CSVUpload from 'src/assets/svg/icon-csv-upload.svg';
import GIFUpload from 'src/assets/svg/icon-gif-upload.svg';
import TiffUpload from 'src/assets/svg/icon-tiff-upload.svg';
import TxtUpload from 'src/assets/svg/icon-txt-upload.svg';
import PPTUpload from 'src/assets/svg/icon-ppt-upload.svg';
import TemplateNotificationDocument, {
  INotificationPopup,
} from 'src/component/layout/Document/TemplateNotificationDocument/TemplateNotificationDocument';

interface IFileUpload {
  icon_file_upload_document: string;
  file_name: string;
  message: string;
  is_error: boolean;
  id: string;
}

interface IOption {
  value: string;
  text: string;
}

interface IObjDocumentSubmitted {
  file_name: string;
  url: string;
  file_size: number;
}

interface IObjDocumentSubmit {
  document_type: number;
  representative_name?: null | string;
  public_date: string;
  expired_date: string;
  group_ids: null | string[];
  approver_id: string | undefined;
  documents: IObjDocumentSubmitted[];
  notification?: null | INotification[];
}

export interface INotification {
  type: number;
  title?: string;
  content: string;
}

export interface IObjTemplateNotificationDocument {
  showModal: boolean;
  isEdit?: boolean;
  data: {
    typeDocument: string;
    title: string;
    content: string;
    sms?: string;
    line?: string;
  };
}

export interface IFile {
  key: string;
  data: File;
}

type DataTableGroup = {
  name: string;
  id: string;
};

function DocumentNew() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [files, setFiles] = useState<IFile[]>([]);
  const [groupIdsItems, setGroupIdsItems] = useState<DataTableGroup[]>([]);
  const [groupIdsPreSelected, setGroupIdsPreSelected] = useState<string[]>([]);
  const [checkedNotification, setCheckedNotification] = useState([]);
  const [showFieldRepresent, setShowFieldRepresent] = useState(false);
  const [objDataPreview, setObjDataPreview] = useState<IObjDataPreview>({
    showModal: false,
    data: [],
    total: 0,
    fromLocal: true,
  });
  const refUploadFile = useRef<HTMLInputElement>(null);
  const [isCommon, setIsCommon] = useState(true);
  const [dataTable, setDataTable] = useState<IFileUpload[]>([]);
  const {
    formState: { isDirty, isValid, errors },
    control,
    getValues,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(documentSchema(isCommon)),
    mode: 'all',
    defaultValues: defaultValues,
  });
  const [isPostSomeDocumentSuccess, setIsPostSomeDocumentSuccess] = useState(false);
  const [authorizerOptions, setAuthorizerOptions] = useState<IOption[]>([]);
  const [notification, setNotification] = useState<INotification[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [preSelectedRowKeys, setPreSelectedRowKeys] = useState<React.Key[]>([]);
  const [objTemplate, setObjTemplate] = useState<IObjTemplateNotificationDocument>({
    showModal: false,
    data: {
      title: '',
      content: '',
      typeDocument: '',
    },
  });
  useEffect(() => {
    getGroupIds();
    getAuthorizerList();
  }, []);
  useEffect(() => {
    if (getValues('typeDocument') === TYPE_DOCUMENTS.INDIVIDUAL) {
      setPreSelectedRowKeys(selectedRowKeys);
      setGroupIdsPreSelected(getValues('groupIds') ? getValues().groupIds : ['']);
      setValue('groupIds', [], { shouldValidate: true });
      setSelectedRowKeys([]);
      setShowFieldRepresent(true);
    } else {
      setSelectedRowKeys(preSelectedRowKeys);
      setValue('groupIds', groupIdsPreSelected);
      setShowFieldRepresent(false);
    }
  }, watch(['typeDocument']));
  useEffect(() => {
    convertFilesToTableData();
    if (isCommon) {
      setValue('nameRepresentFile', '');
    }
  }, [files, isCommon]);

  async function getUrlForFile(file: File) {
    const body = {
      file_name: file.name,
      file_size: file.size,
      content_type: file.type,
      document_type: +getValues('typeDocument'),
    };
    return new Promise((resolve, reject) => {
      post(API_PATH.COMPANY_DOCUMENT_GET_URL, body)
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
                  resolve({
                    file_size: file.size,
                    file_name: file.name,
                    url: urlMain,
                  });
                } else {
                  reject(resUrl);
                }
              })
              .catch(err => {
                resolve({
                  isError: true,
                  dataError: {
                    errorMsg: handleErrorFromResponse(err, 'error uploadToAzure'),
                    fileName: file?.name,
                  },
                });
              });
          } else {
            resolve({
              isError: true,
              dataError: {
                errorMsg: 'error uploadToAzure',
                fileName: file?.name,
              },
            });
          }
        })
        .catch(err => {
          resolve({
            isError: true,
            dataError: {
              errorMsg: handleErrorFromResponse(err, 'error get url'),
              fileName: file?.name,
            },
          });
        });
    });
  }

  async function onCheckListDocumentError(listErrorDocuments: any[]) {
    const dataConvert: {
      icon_file_upload_document: string;
      file_name: string;
      error_message: string;
      is_error: boolean;
      id: string;
      no?: number;
    }[] = [];
    listErrorDocuments.forEach((item: any, index: number) => {
      dataConvert.push({
        icon_file_upload_document: getIconExtendFile(item?.fileName) || '',
        file_name: item?.fileName || '',
        error_message: item?.errorMsg || '',
        is_error: true,
        id: index + '',
        no: index + 1,
      });
    });
    if (dataConvert?.length > 0) {
      setObjDataPreview(prevState => ({
        ...prevState,
        data: dataConvert,
        showModal: true,
        fromLocal: false,
        total: dataTable.length,
      }));
    }
    dispatch(onSetShowLoading('idle'));
  }

  function getAuthorizerList() {
    dispatch(onSetShowLoading('loading'));
    get(`${API_PATH.COMMON}?type=${TYPE_COMMON_GET_ALL_API.USER_ADMIN}`)
      .then((author: any) => {
        const authorizers = author?.data?.data;
        const items: IOption[] = [];
        authorizers.forEach((item: any) => {
          const option: IOption = {
            value: item?.id,
            text: item?.value,
          };
          items.push(option);
        });
        setAuthorizerOptions(items);
        dispatch(onSetShowLoading('idle'));
      })
      .catch(err => {
        onDispatchErrorResponse(handleErrorFromResponse(err, TOAST_MESSAGE.COMPANY.DOCUMENT.GET_AUTHORIZER.FAIL));
        dispatch(onSetShowLoading('idle'));
      });
  }

  function getIconTypeFile(type: string) {
    switch (type) {
      case FILE_EXTEND_UPLOAD.JPG_JPEG:
      case FILE_EXTEND_UPLOAD.PNG:
        return ImageUpload;
      case FILE_EXTEND_UPLOAD.EXCEL_NEW:
      case FILE_EXTEND_UPLOAD.EXCEL_OLD:
        return ExcelPNG;
      case FILE_EXTEND_UPLOAD.WORD_NEW:
      case FILE_EXTEND_UPLOAD.WORD_OLD:
        return DocsUpload;
      case FILE_EXTEND_UPLOAD.CSV:
        return CSVUpload;
      case FILE_EXTEND_UPLOAD.PDF:
        return PDFImg;
      case FILE_EXTEND_UPLOAD.GIF:
        return GIFUpload;
      case FILE_EXTEND_UPLOAD.TIFF:
        return TiffUpload;
      case FILE_EXTEND_UPLOAD.TXT:
        return TxtUpload;
      case FILE_EXTEND_UPLOAD.PPT:
      case FILE_EXTEND_UPLOAD.PPTX:
        return PPTUpload;
      default:
        return OthersFileUpload;
    }
  }

  function getValidateFile(
    size: number,
    type: string,
    fileName: string,
  ): {
    messageString: string;
    isError: boolean;
  } {
    if (!FILE_EXTEND_ARRAY.includes(type)) {
      return {
        messageString: MESSAGE_UPLOAD_DOCUMENT.WRONG_FILE_TYPE,
        isError: true,
      };
    } else if (size > SIZE_FILE.MAX_SIZE_UPLOAD_FOR_COMPANY_FILE * 1024 * 1024) {
      return {
        messageString: MESSAGE_UPLOAD_DOCUMENT.WRONG_FILE_SIZE_OVER,
        isError: true,
      };
    } else if (!isCommon && !fileName.match(REGEX_FILE_NAME_DOCUMENT_UPLOAD)) {
      return {
        messageString: MESSAGE_UPLOAD_DOCUMENT.WRONG_FILE_NAME,
        isError: true,
      };
    } else {
      return {
        messageString: MESSAGE_UPLOAD_DOCUMENT.IS_VALID,
        isError: false,
      };
    }
  }

  function convertFilesToTableData() {
    const dataTableTemp: IFileUpload[] = [];
    const len = files?.length || 0;
    for (let i = 0; i < len; i++) {
      if (files) {
        const { messageString, isError } = getValidateFile(files[i].data.size, files[i].data.type, files[i].data.name);
        dataTableTemp.push({
          icon_file_upload_document: getIconTypeFile(files[i].data.type),
          file_name: files[i].data.name,
          message: messageString,
          is_error: isError,
          id: files[i].key,
        });
      }
    }
    setDataTable(dataTableTemp);
    setValue('fileIds', dataTableTemp.toString(), { shouldValidate: true });
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

  function onCheckedNotification(data: any) {
    setCheckedNotification(data);
  }

  function onSelectTimes(data: any) {
    setValue('periodDate', data);
  }

  function onClosePreviewInvalid() {
    setObjDataPreview(prevState => ({
      ...prevState,
      showModal: false,
    }));
    if (!objDataPreview?.fromLocal && isPostSomeDocumentSuccess) {
      delayNavigate(navigate, NAVIGATION_PATH.DOCUMENT);
    }
  }

  function preOnSubmit() {
    const dataConvert = dataTable
      ?.filter((filter: any) => filter?.is_error)
      .map((item: any, index: number) => ({
        icon_file_upload_document: item.icon_file_upload_document,
        file_name: item.file_name,
        error_message: item.message,
        is_error: item.is_error,
        id: item.id,
        no: index + 1,
      }));
    if (dataConvert?.length > 0) {
      setObjDataPreview(prevState => ({
        ...prevState,
        data: dataConvert,
        showModal: true,
        fromLocal: true,
        total: dataTable.length,
      }));
    } else {
      onSubmit();
    }
  }

  function handleChangeUploadFileByClick(event: any, dragDropFile?: File[]) {
    const listFiles: any = dragDropFile && dragDropFile ? dragDropFile : event.target.files;
    if (listFiles && listFiles?.length > 0) {
      const len = listFiles?.length;
      const arr: {
        key: string;
        data: File;
      }[] = [];
      for (let i = 0; i < len; i++) {
        arr.push({
          key: generateId(),
          data: listFiles[i],
        });
      }
      setFiles(prevState => [...prevState, ...arr]);
    }
  }

  function onHandleCloseTemplate() {
    const preData = objTemplate.data;
    setObjTemplate({
      data: {
        ...preData,
        typeDocument: getValues().typeDocument,
      },
      showModal: false,
    });
  }

  function onHandleCreateOrEditClickTemplate(obj: INotificationPopup) {
    setNotification([
      {
        type: CONTACT_TYPE.EMAIL,
        title: obj.title,
        content: obj.content,
      },
      {
        type: CONTACT_TYPE.SMS,
        content: obj?.sms || '',
      },
      {
        type: CONTACT_TYPE.LINE,
        content: obj?.line || '',
      },
    ]);
    setObjTemplate({
      showModal: false,
      data: {
        title: obj.title,
        content: obj.content,
        sms: obj?.sms || '',
        line: obj?.line || '',
        typeDocument: getValues().typeDocument,
      },
    });
  }

  function preOnShowTemplate() {
    if (notification && notification.length === 0) {
      const preData = objTemplate.data;
      setObjTemplate({
        data: {
          ...preData,
          typeDocument: getValues().typeDocument,
        },
        showModal: true,
      });
    } else {
      setObjTemplate(preData => ({
        ...preData,
        showModal: true,
      }));
    }
  }

  function handleActionItemById(id: string, actionType: number) {
    if (actionType === ACTION_ITEM_TABLE.DELETE) {
      const newList = files.filter((item: IFile) => item.key !== id);
      setFiles(newList);
      if (newList?.length === 0) {
        setValue('fileIds', '', { shouldValidate: true });
      }
    }
  }

  function onSubmit() {
    dispatch(onSetShowLoading('loading'));
    setIsPostSomeDocumentSuccess(false);
    const promises = [];
    const len = files?.length || 0;
    for (let i = 0; i < len; i++) {
      if (files && files[i].data) {
        promises.push(getUrlForFile(files[i].data));
      }
    }
    Promise.all(promises)
      .then((result: any) => {
        const listDocumentsValid: any[] = [];
        const listErrorDocuments: any[] = [];
        result?.forEach((item: any) => {
          if (item?.isError) {
            listErrorDocuments.push(item?.dataError);
          } else {
            listDocumentsValid.push(item);
          }
        });
        if (listDocumentsValid?.length > 0) {
          const dataPost: IObjDocumentSubmit = {
            public_date: convertDateStart(getValues('periodDate').startDate),
            expired_date: convertDateEnd(getValues('periodDate').endDate),
            group_ids: getValues('groupIds')?.length === 0 ? [] : getValues('groupIds'),
            approver_id: getValues('authorizer'),
            documents: listDocumentsValid,
            notification,
            representative_name: getValues('nameRepresentFile') ? getValues('nameRepresentFile') : '',
            document_type: +getValues('typeDocument'),
          };
          post(API_PATH.COMPANY_DOCUMENT, dataPost)
            .then(async (res: any) => {
              if (res && res?.status === 200) {
                setIsPostSomeDocumentSuccess(true);
                if (res?.data?.error?.length > 0) {
                  res?.data?.error?.forEach((item: any) => {
                    listErrorDocuments.push({
                      errorMsg: handleErrorFromResponseByKeyError(item?.error_code),
                      fileName: item?.filename,
                    });
                  });
                  await onCheckListDocumentError(listErrorDocuments);
                } else if (listErrorDocuments?.length > 0) {
                  await onCheckListDocumentError(listErrorDocuments);
                } else {
                  dispatch(
                    onSetToastStatus({
                      message: TOAST_MESSAGE.COMPANY.DOCUMENT.ADD_NEW.SUCCESS,
                      showToast: true,
                      status: 'success',
                    }),
                  );
                  dispatch(onSetShowLoading('idle'));
                  delayNavigate(navigate, NAVIGATION_PATH.DOCUMENT);
                }
              } else {
                dispatch(onSetShowLoading('idle'));
                dispatch(
                  onSetToastStatus({
                    message: TOAST_MESSAGE.COMPANY.DOCUMENT.ADD_NEW.FAIL,
                    showToast: true,
                    status: 'error',
                  }),
                );
              }
            })
            .catch((err: any) => {
              dispatch(onSetShowLoading('idle'));
              dispatch(
                onSetToastStatus({
                  message: handleErrorFromResponse(err, TOAST_MESSAGE.COMPANY.DOCUMENT.ADD_NEW.FAIL),
                  showToast: true,
                  status: 'error',
                }),
              );
            });
        } else {
          onCheckListDocumentError(listErrorDocuments);
        }
      })
      .catch((err: any) => {
        dispatch(onSetShowLoading('idle'));
        dispatch(
          onSetToastStatus({
            message: handleErrorFromResponse(err, TOAST_MESSAGE.COMPANY.DOCUMENT.UPLOAD.FAIL),
            showToast: true,
            status: 'error',
          }),
        );
      });
  }

  function handleOnForceSubmit() {
    if (objDataPreview?.fromLocal) {
      onSubmit();
    }
  }

  function dragOverHandler(ev: any) {
    ev.preventDefault();
  }

  function dropHandler(ev: any) {
    ev.preventDefault();
    const files: File[] = [];
    if (ev.dataTransfer.items) {
      [...ev.dataTransfer.items].forEach(item => {
        if (item.kind === 'file') {
          const file = item.getAsFile();
          files.push(file);
        }
      });
      handleChangeUploadFileByClick(null, files);
    } else {
      // Use DataTransfer interface to access the file(s)
      [...ev.dataTransfer.files].forEach(file => {
        files.push(file);
      });
      handleChangeUploadFileByClick(null, files);
    }
  }

  function handleSelectRowKeys(key: React.Key[], listData?: any[]) {
    setSelectedRowKeys(key);
    const idsSelected: string[] = getIdsSelectedByKeyFromTable(key, listData);
    setValue('groupIds', idsSelected, { shouldValidate: true });
  }

  function handleClickUploadFile() {
    if (refUploadFile && refUploadFile?.current) {
      refUploadFile?.current?.click();
    }
  }

  return (
    <MainWrapper title="書類登録" className="document-new-root">
      <div className="document-content-container">
        <div className="top-wrapper">
          <Controller
            control={control}
            name="typeDocument"
            render={({ field: { onChange, onBlur, value } }) => (
              <Select
                options={OPTIONS_DOCUMENT_TYPE}
                handleChange={(ev: any) => {
                  setIsCommon(ev === TYPE_DOCUMENTS.COMMON);
                  onChange(ev);
                }}
                label={'書類種類'}
                className="text-item"
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
                <div className="range-date-wrapper">
                  <DatePickers
                    formats={[FORMAT_DATE_TIME.DATE_TIME_TEXT_MINUTE, FORMAT_DATE_TIME.DATE_FULL_SLASH]}
                    onSelect={onSelectTimes}
                    showTimeArray={[true, false]}
                    value={value}
                    defaultValue={{
                      startDate: startDateDefault,
                      endDate: endDateDefault,
                    }}
                    label={['書類公開日', '参照期限']}
                    onChange={onChange}
                    customFormatShowTimes={[{ format: FORMAT_DATE_TIME.HOUR_00 }, undefined]}
                  />
                </div>
              </div>
            )}
          />
          {showFieldRepresent && (
            <Controller
              control={control}
              name="nameRepresentFile"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder={'書類名（代表）を入力して下さい'}
                  onChange={onChange}
                  label={'書類名（代表）'}
                  className="text-item"
                  onBlur={onBlur}
                  value={value}
                  required={true}
                  textWarning={errors?.nameRepresentFile?.message ? errors?.nameRepresentFile?.message + '' : ''}
                />
              )}
            />
          )}
        </div>
        <div
          onDragOver={(event: any) => dragOverHandler(event)}
          onDrop={(event: any) => dropHandler(event)}
          id="drop_zone"
          className="drag-drop-wrapper"
        >
          {IconUpload()}
          {/*<img src={IconUpload} alt="icon" />*/}
          <div className="title">
            Drag & drop files or{' '}
            <span onClick={handleClickUploadFile} className="high-line">
              Browse
            </span>
          </div>
          <div className="sub-title">
            対応するファイルフォーマット: Pdf, Word, PPT, Excel, Jpg/jpeg, png, gif, tiff, txt, csv
          </div>
          <div className="sub-title">
            ※フォルダをアップロードしたい場合は「Browse」ボタンでフォルダを選択してください。
          </div>
        </div>
        <div className="view-wrapper">
          <div className="table-data-wrapper">
            <div className="table-title">
              ファイル確認状況
              {/*<div className={'required'}>{errors?.fileIds?.message ? errors?.fileIds?.message + '' : ''}</div>*/}
            </div>
            <div className="table-main">
              <Table
                isHiddenRowSelection={true}
                data={dataTable}
                listKeyName={{
                  names: ['ICON', 'FILE_NAME', 'ERR_MSG', 'ACTION'],
                  keys: [
                    { keyName: 'icon_file_upload_document', sorter: false },
                    { keyName: 'file_name', sorter: false },
                    { keyName: 'message', sorter: false },
                    { keyName: 'action_file_upload_document', sorter: false },
                    { keyName: 'id', sorter: false },
                    { keyName: 'is_error', sorter: false },
                  ],
                }}
                scroll={{ x: 'fit-content', y: HEIGHT_TABLE }}
                onActionItemById={handleActionItemById}
              />
            </div>
            <div className="table-footer">
              <div className="check-boxe-wrapper">
                <Checkbox
                  onChange={onCheckedNotification}
                  items={[{ value: 'checked', label: '登録後、ユーザーに通知を行う' }]}
                  value={checkedNotification}
                />
              </div>
              <div className="select-wrapper">
                <Controller
                  control={control}
                  name="authorizer"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Select
                      placeHolder={'選択して下さい'}
                      options={authorizerOptions}
                      handleChange={onChange}
                      label={'承認者'}
                      className="text-item"
                      onBlur={onBlur}
                      value={value}
                      textWarning={errors?.authorizer?.message ? errors?.authorizer?.message + '' : ''}
                    />
                  )}
                />
              </div>
            </div>
          </div>
          <div className="options-wrapper">
            {/*<div className={'required warning-space'}>*/}
            {/*    {errors?.groupIds?.message ? errors?.groupIds?.message + '' : ''}*/}
            {/*</div>*/}
            <Controller
              control={control}
              name="groupIds"
              render={() => (
                <div className="control-checkbox-list">
                  <Table
                    className={'custom-color-checkbox'}
                    data={groupIdsItems}
                    listKeyName={{
                      names: ['所属（グループ）'],
                      keys: isCommon
                        ? [
                            { keyName: 'name', sorter: false },
                            { keyName: 'id', sorter: false },
                          ]
                        : [
                            { keyName: 'name', sorter: false },
                            { keyName: 'id', sorter: false },
                            {
                              keyName: KEYS_DISABLED_SELECT_TABLE_ROW.COMPANY_ADD_DOCUMENT__GET_GROUPS.KEY,
                              sorter: false,
                            },
                          ],
                    }}
                    scroll={{ x: 'fit-content', y: 158 }}
                    onActionItemById={handleActionItemById}
                    onSelectChange={handleSelectRowKeys}
                    selectedRowKeys={selectedRowKeys}
                  />
                </div>
              )}
            />
          </div>
        </div>

        <div className="actions-wrapper">
          <div
            onClick={() => (checkedNotification.length > 0 ? preOnShowTemplate() : null)}
            className={`setting ${checkedNotification.length > 0 ? ' active' : ''}`}
          >
            <img
              className={`${checkedNotification?.length > 0 && notification?.length === 0 ? 'fadeIn zoom-out' : ''}`}
              src={IconSetting}
              alt="icon"
            />
            <div className="label">通知テンプレート</div>
          </div>
          <div className="buttons-action">
            <Button
              onClick={() => navigate(NAVIGATION_PATH.DOCUMENT)}
              className={'btn cancel-btn'}
              name={'キャンセル'}
            />
            <Button
              isDisable={
                checkedNotification.length > 0
                  ? (notification && notification?.length === 0) || !(isDirty && isValid)
                  : !(isDirty && isValid)
              }
              onClick={preOnSubmit}
              className={'btn submit-btn'}
              name={'登録'}
            />
          </div>
        </div>
      </div>
      <DocumentInValid
        onForceSubmit={handleOnForceSubmit}
        onClose={onClosePreviewInvalid}
        objDataPreview={objDataPreview}
      />
      <TemplateNotificationDocument
        objCreateOrEdit={objTemplate}
        onCloseModal={onHandleCloseTemplate}
        onCreateOrEditClick={onHandleCreateOrEditClickTemplate}
      />
      <input
        onChange={event => handleChangeUploadFileByClick(event)}
        ref={refUploadFile}
        id={'upload-files-company-document-id'}
        style={{ display: 'none' }}
        multiple
        type="file"
        accept={FILE_TYPE_UPLOAD_FOR_DOCUMENT.toString()}
        onClick={(event: any) => {
          const { target } = event || {};
          target.value = '';
        }}
      />
    </MainWrapper>
  );
}

export default DocumentNew;
