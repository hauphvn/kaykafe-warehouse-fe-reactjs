import moment from 'moment';
import {
  API_PATH,
  COMPANY_DOCUMENT_STATUS_STRING,
  CONTACT_TYPE,
  DATE_FORMAT,
  DATE_FORMAT_T,
  NAVIGATION_PATH,
  OPTIONS_DOCUMENT_TYPE,
} from 'src/app/constant';
import React from 'react';
import { TOAST_MESSAGE } from 'src/app/validation_msg';
import { onSetShowLoading } from 'src/redux/auth/authSlice';
import CSVFileValidator from 'csv-file-validator';
import ImageUpload from 'src/assets/svg/icon-img-upload.svg';
import DocsUpload from 'src/assets/svg/icon-docs-upload.svg';
import OthersFileUpload from 'src/assets/svg/icon-others-file-upload.svg';
import CSVUpload from 'src/assets/svg/icon-csv-upload.svg';
import GIFUpload from 'src/assets/svg/icon-gif-upload.svg';
import TiffUpload from 'src/assets/svg/icon-tiff-upload.svg';
import TxtUpload from 'src/assets/svg/icon-txt-upload.svg';
import PPTUpload from 'src/assets/svg/icon-ppt-upload.svg';
import ExcelPNG from 'src/assets/imgs/excel-file.png';
import PDFImg from 'src/assets/imgs/pdf-file.png';
import { put } from 'src/ultils/request';

export const refreshTokenExpried = () => {
  localStorage.clear();
  window.location.replace(`${window.location.origin}${NAVIGATION_PATH.LOGIN}`);
  setTimeout(() => {
    window.location.reload();
  }, 200);
};

export const convertDateStart = (date: any) => {
  if (!date) {
    return '';
  }
  const d: any = moment(date).subtract(9, 'hour');
  return d.format(DATE_FORMAT_T);
};
export const convertDateStartWithoutSelectHour = (date: any) => {
  if (!date) {
    return '';
  }
  return moment(date).subtract('1', 'day').format(DATE_FORMAT) + 'T15:00:00.000Z';
};

export const convertDateEnd = (date: any) => {
  if (!date) {
    return '';
  }
  const d = moment(date).format(DATE_FORMAT);
  return d + 'T14:59:59.999Z';
};

export const convertDateJP = (date: any) => {
  if (!date) {
    return '';
  }
  const d = moment(date).format(DATE_FORMAT);
  return d;
};

export const objIsEmpty = (obj: any) => {
  if (obj === null || obj === undefined || Array.isArray(obj) || typeof obj !== 'object') {
    return true;
  }
  return Object.getOwnPropertyNames(obj).length === 0;
};

export const preventInputWrongNumber = (e: any) => {
  ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();
};

export const buildParams = (data: any) => {
  const params = new URLSearchParams();

  Object.entries(data).forEach(([key, value]: any) => {
    if (Array.isArray(value)) {
      value.forEach(value => params.append(key, value?.toString()));
    } else {
      params.append(key, value?.toString());
    }
  });

  return params?.toString();
};

export const checkHasValueInOption = (options: { key: string; value: string }[] | any, value: string) => {
  let result = false;
  options?.map((item: { key: string; value: string }) => {
    if (item?.key === value) {
      result = true;
    }
  });
  return result;
};

export const getObjsSelectedByKeyFromTable = (keys: React.Key[], selectedKey: string, listData?: any[]): any[] => {
  if (listData?.length === 0) return [];
  const results: any[] = [];
  keys.forEach((key: React.Key) => {
    const item = listData?.find((data: any) => data?.key === key);
    if (item) {
      results.push({
        id: item?.id,
        [selectedKey]: item[selectedKey],
      });
    }
  });
  return results;
};
export const getIdsSelectedByKeyFromTable = (keys: React.Key[], listData?: any[]): string[] => {
  if (listData?.length === 0) return [];
  const results: string[] = [];
  keys.forEach((key: React.Key) => {
    const item = listData?.find((data: any) => data?.key === key);
    if (item) {
      results.push(item?.id);
    }
  });
  return results;
};
export const convertTimeStampToBackEnd = (time: string) => {
  if (!time) {
    return '';
  }
  return new Date(time).toISOString();
};

export const uploadToAzure = async (sasUrl: string, file: any) => {
  const formData = new FormData();
  formData.append('file', file);
  return await fetch(sasUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
      'x-ms-blob-type': 'BlockBlob',
    },
  });
};

export const handleErrorFromResponse = (error: any, errorDefault = TOAST_MESSAGE.SOMETHING_WRONG): string => {
  // const errorFound = ERROR_CODE_RESPONSE.find((item: any) => item?.error_code === error?.error_code);
  return error?.message ? error?.message : errorDefault;
};
export const handleErrorFromResponseByKeyError = (errorKey: string, errorDefault = 'Error'): string => {
  // const errorFound = ERROR_CODE_RESPONSE.find((item: any) => item?.error_code === error?.error_code);
  return errorKey ? errorKey : errorDefault;
};

export const downloadURI = async (uri: string, dispatch?: any) => {
  if (!uri) {
    return;
  }
  const link: any = await document.createElement('a');
  link.href = await uri;
  await document.body.appendChild(link);
  await link.click();
  await document.body.removeChild(link);
  if (dispatch) {
    dispatch(onSetShowLoading('idle'));
  }
};

export const validateCSVFile = async (file: any, config: any) => {
  return CSVFileValidator(file, config);
};

export const handleAddStt = (dataPage: any, dataList: any) => {
  const newData = dataList?.map((item: any, index: number) => {
    let noItem = index + 1;
    if (dataPage.page > 1) {
      noItem = dataPage.limit * (dataPage.page - 1) + index + 1;
    }
    return { ...item, no: noItem };
  });
  return newData;
};

export const handleSort = (data: any, order: string, dataList: any) => {
  if (!data?.sorter) {
    return dataList;
  }
  const newData = dataList?.sort(function (a: any, b: any) {
    const dataA = a[data.key] + ''?.toLowerCase();
    const dataB = b[data.key] + ''?.toLowerCase();
    if (order === 'alphabetically' ? dataA < dataB : dataA > dataB) {
      return -1;
    }
    if (a[data.key] > b[data.key]) {
      return 1;
    }
    return 0;
  });
  return newData;
};

export const delayNavigate = (navigate: any, location: string, time?: number) => {
  setTimeout(() => {
    navigate(location);
  }, time || 600);
};

export function generateId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

export const getGroupIdByDocumentFile = (fileName: string): string => {
  const arr = fileName.split('_');
  if (arr?.length > 0) {
    return arr[0];
  }
  return '';
};
export const getIconExtendFile = (fileName: string): string => {
  const arr = fileName.split('.');
  if (arr?.length > 0) {
    const extend = arr[arr.length - 1];
    switch (extend) {
      case 'pdf':
        return PDFImg;
      case 'tiff':
        return TiffUpload;
      case 'xlsx':
      case 'xls':
        return ExcelPNG;
      case 'jpg':
      case 'png':
      case 'jpeg':
        return ImageUpload;
      case 'gif':
        return GIFUpload;
      case 'csv':
        return CSVUpload;
      case 'txt':
        return TxtUpload;
      case 'ppt':
      case 'pptx':
        return PPTUpload;
      case 'docs':
      case 'docx':
      case 'doc':
        return DocsUpload;
      default:
        return OthersFileUpload;
    }
  } else {
    return OthersFileUpload;
  }
};

export const getDocumentTypeByTypeNumber = (type: number): string => {
  return OPTIONS_DOCUMENT_TYPE.find((item: { value: string; text: string }) => item.value === type + '')?.text || '';
};
export const getDocumentStatusStringByStatusNumber = (status: number): string => {
  return (
    COMPANY_DOCUMENT_STATUS_STRING.find((item: { value: string; text: string }) => +item.value === status)?.text || ''
  );
};

export function onResetPWD(id: string) {
  return new Promise((resolve, reject) => {
    put(`${API_PATH.ADMIN_COMPANY_RESET_PASSWORD}`, { id })
      .then((res: any) => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export const onGetMethodNotification = (type: number) => {
  switch (type) {
    case CONTACT_TYPE.EMAIL:
      return 'M';
    case CONTACT_TYPE.SMS:
      return 'S';
    case CONTACT_TYPE.LINE:
      return 'L';
    default:
      return '';
  }
};
