export const NAVIGATION_PATH = {
  LOGIN: '/login',
  DOCUMENT: '/document',
  DOCUMENT_USER: '/document/user',
  NEW_DOCUMENT: '/document/new',
  USER_MANAGEMENT: '/user_management',
  GROUP_MANAGEMENT: '/group_management',
  ADMIN_MANAGEMENT: '/admin_management',
  NOTIFICATION_MANAGEMENT: '/notification_management',
  CHANGE_PASSWORD: '/change_password',
  CHANGE_PASSWORD_FIRST: '/change_password_first',
  CONTRACT_MANAGEMENT: '/contract_management',
  NOTICE_MANAGEMENT: '/notice_management',
  OPERATION_MANAGEMENT: '/operation_management',
  OPERATION_HISTORY: '/operation_history',
  HELP: '/help',
  DESIGN_CHANGE: '/setting_change',
  COMPANY_NOTICE: '/notice',
  COMPANY_ADMIN_MANAGEMENT: '/maintenance',
  TERM_OF_SERVICE: '/term_of_service',
  PRIVATE_POLICY: '/private_policy',
  ENVIROMENT: '/enviroment',
};

export const API_PATH = {
  LOGIN: '/login',
  LOGOUT: '/logout',
  REFRESH_TOKEN: '/token/refresh',
  ADMIN_COMPANY: '/admin/company',
  ADMIN_NOTI: '/admin/noti',
  ADMIN_MANAGEMENT: '/admin',
  CHANGE_PASSWORD: '/change-password',
  CHANGE_PASSWORD_FIRST: '/change-password-first',
  COMPANY_NOTIFICATION: '/maintenance/noti',
  COMPANY_NOTIFICATION_IIS: '/maintenance/noti-iis',
  ADMIN_HISTORY: '/admin/history',
  COMPANY_DOCUMENT: '/maintenance/document',
  COMPANY_APPROVE: '/maintenance/approve',
  COMPANY_REJECT: '/maintenance/reject',
  COMPANY_GROUP: '/maintenance/group',
  COMPANY_ADMIN_MANAGEMENT: '/maintenance',
  COMPANY_USER: '/maintenance/user',
  COMPANY_USER_LIST: '/maintenance/user-list',
  COMMON_COLOR: '/common/color',
  ADMIN_COMPANY_UPLOAD: '/admin/company/upload',
  COMMON: '/common',
  COMMON_TEMPLATE: '/common/template',
  COMPANY_USER_ACTIVE: '/maintenance/user/active',
  COMPANY_DOCUMENT_GET_URL: '/maintenance/document/upload',
  USER_DOCUMENT: '/user/document',
  USER_NOTIFICATION: '/user/noti',
  USER_DOCUMENT_DOWNLOAD: '/user/document-download',
  ADMIN_COMPANY_RESET_PASSWORD: '/reset-password',
  COMPANY_DOCUMENT_DOWNLOAD: '/maintenance/document/download',
  USER_SETTING: '/user/setting',
  COMPANY_DOCUMENT_ERROR_NOTIFICATION: '/maintenance/document/noti-error',
  USER_CHECK_CONTACT: '/user/check-contact',
  USER_TERM: '/user/terms',
  USER_RECOMMEND: '/user/recommend',
  USER_POLICY: '/user/policy',
  COMPANY_USER_RESEND_NOTIFICATION: '/maintenance/user/resend-noti',
};

export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATE_FORMAT_T = 'YYYY-MM-DDTHH:00:00.000\\Z';
export const DATE_HOUR_FORMAT = 'YYYY-MM-DD HH:mm';

export const REGEX_PASSWORD_STRONG =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d!@#$%^&*()\-_=+{};:,<.>]{8,32}$/;

export const REGEX_EMAIL = /^[a-z0-9.]+@[a-z0-9.-]+\.[a-z]{2,6}$/;
export const REGEX_FILE_NAME_DOCUMENT_UPLOAD = /^([^-]+)-([^-]+)-/;
export const REGEX_SPACING = /^\s+$/;
export const REGEX_PHONE_NUMBER_JP = /^0\d{2}-\d{4}-\d{4}$/;
export const REGEX_PHONE_NUMBER_SIMPLE = /^0\d{9,10}$/;
export const LOCALSTORAGE_ITEM = {
  ACCESS_TOKEN: 'access_token',
  ROLE: 'role',
  REFRESH_TOKEN: 'refresh_token',
  TOKEN_EXPRIED: 'token_expried',
  IS_FIRST: 'is_first',
  INFO_COLOR: 'color',
};

export const ROLE_USER = {
  ADMIN: 'admin', // iis
  CUSTOMER: 'user',
  COMPANY: 'maintenance',
};

export const SORT_MESSAGE = {
  ASCENDING: '昇順に並べ替え',
  DESCENDING: '降順に並べ替え',
  CANCEL: '並べ替えキャンセル',
};

export const ELEMENT_LIST_SEARCH = {
  INPUT: 'input',
  DATE: 'date',
  RANGE_DATE: 'range_date',
  SELECT: 'select',
  MULTI_SELECT: 'multiSelect',
  AUTOCOMPLETE: 'autocomplete',
};

export const ROUTER_TYPE = {
  PRIVATE: 'private',
  PUBLIC: 'public',
};

export enum ACTION_ITEM_TABLE {
  EDIT,
  DELETE,
  RESET,
  CHANGE_ACTIVE_USER_COMPANY,
  SHOW_ERROR_NOTIFICATION,
}

export const TIMESTAMP_REQUIRE = {
  END_AFTER_START_DEFAULT: 2, // unit: Month
  UPLOAD_DOCUMENT_START_DATE_ADDING_HOUR: 1,
  UPLOAD_DOCUMENT_END_DATE_ADDING_YEAR: 3,
};

export const TYPE_SEND_NOTIFICATION = {
  M: 'm',
  S: 's',
  L: 'l',
};

export const ERROR_CODE_RESPONSE = [
  {
    error_code: '000',
    message: 'File Name must pdf',
    msgJP: 'File Name must pdf',
  },
  {
    error_code: '001',
    message: 'Email already exist',
    msgJP: 'Email already exist',
  },
];

export const SIZE_FILE = {
  MAX_SIZE_UPLOAD_FOR_COMPANY_FILE: 100,
};

export const TYPE_COMMON_GET_ALL_API = {
  COMPANY: 1,
  GROUP_HAS_USER: 2,
  USER_ADMIN: 3,
  ALL_GROUP: 4,
};

export enum FORM_COMPANY_USER_TYPE {
  INDIVIDUAL,
  BULK,
}

export const FILE_EXTEND_UPLOAD = {
  PDF: 'application/pdf',
  CSV: 'text/csv',
  WORD_NEW: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  WORD_OLD: 'application/msword',
  JPG_JPEG: 'image/jpeg',
  PNG: 'image/png',
  GIF: 'image/gif',
  TIFF: 'image/tiff',
  TXT: 'text/plain',
  PPT: 'application/vnd.ms-powerpoint',
  PPTX: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  EXCEL_NEW: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  EXCEL_OLD: 'application/vnd.ms-excel',
};

export const HEIGHT_TABLE = 520;
export const CSV_CREATE_USER_TEMPLATE_ERROR = {
  FILE_NAME: 'UsersError',
  COL_NO: 'No',
  COL_ID: 'ID',
  COL_USER_NAME: 'ユーザー名',
  COL_EMAIL: 'メールアドレス',
  COL_ERROR_MSG: 'エラー内容',
};

export const CSV_CREATE_DOCUMENT_TEMPLATE_ERROR = {
  FILE_NAME: 'DocumentsError',
  COL_NO: 'No',
  COL_FILE_NAME: 'ファイル名',
  COL_MESSAGE: 'エラー内容',
};
export const CSV_CREATE_NOTIFICATION_TEMPLATE_ERROR = {
  FILE_NAME: 'NotificationsError',
  COL_NO: 'No',
  COL_NAME: 'ユーザー名',
  COL_METHOD: '通知',
  COL_ADDRESS: '通知先アドレス',
};
export const TYPE_DOCUMENTS = {
  COMMON: '1',
  INDIVIDUAL: '0',
};
export const OPTIONS_DOCUMENT_TYPE = [
  { value: TYPE_DOCUMENTS.COMMON, text: '共通文書' },
  { value: TYPE_DOCUMENTS.INDIVIDUAL, text: '個別文書' },
];
export const FILE_TYPE_UPLOAD_FOR_DOCUMENT = [
  '.JPG',
  '.PNG',
  '.GIF',
  '.CSV',
  '.DOCX',
  '.DOC',
  '.PPT',
  '.PPTX',
  '.XLSX',
  '.TXT',
  '.JPEG',
  '.PDF',
  '.XLS',
  '.TIFF',
];

export const MESSAGE_UPLOAD_DOCUMENT = {
  WRONG_FILE_NAME: '不正なファイル名',
  WRONG_FILE_SIZE_OVER: 'サイズ上限超え',
  IS_VALID: 'ファイルアップ可能',
  WRONG_FILE_TYPE: '不正なファイルタイプ',
};

export const FILE_EXTEND_ARRAY = [
  FILE_EXTEND_UPLOAD.TXT,
  FILE_EXTEND_UPLOAD.GIF,
  FILE_EXTEND_UPLOAD.TIFF,
  FILE_EXTEND_UPLOAD.JPG_JPEG,
  FILE_EXTEND_UPLOAD.PPT,
  FILE_EXTEND_UPLOAD.EXCEL_OLD,
  FILE_EXTEND_UPLOAD.EXCEL_NEW,
  FILE_EXTEND_UPLOAD.WORD_NEW,
  FILE_EXTEND_UPLOAD.WORD_OLD,
  FILE_EXTEND_UPLOAD.PNG,
  FILE_EXTEND_UPLOAD.PDF,
  FILE_EXTEND_UPLOAD.CSV,
];

export const CONTACT_TYPE = {
  EMAIL: 1,
  SMS: 2,
  LINE: 3,
};

export const OPTIONS_NOTIFICATION_DOCUMENT_TYPE = [
  {
    text: 'アクティベーション',
    value: CONTACT_TYPE.EMAIL + '',
  },
  {
    text: '個別ファイル',
    value: CONTACT_TYPE.SMS + '',
  },
  {
    text: '共通ファイル',
    value: CONTACT_TYPE.LINE + '',
  },
];

export const COMPANY_DOCUMENT_STATUS_STRING = [
  {
    value: '0',
    text: '承認待ち',
  },
  {
    value: '1',
    text: '承認済み',
  },
  {
    value: '2',
    text: '非承認',
  },
];

export const FORMAT_DATE_TIME = {
  HOUR_MINUTE: 'HH:mm',
  HOUR_00: 'HH:00',
  DATE_FULL_SLASH: 'YYYY/MM/DD',
  DATE_TIME: 'YYYY-MM-DD HH:00',
  DATE_TIME_TEXT_MINUTE: 'YYYY/MM/DD  HH:時',
  DATE_TIME_TEXT_H_MINUTE: 'YYYY/MM/DD H時',
  DATE_HOUR_00: 'YYYY/MM/DD HH:00',
};

export const OPTIONS_DOCUMENT_NOTIFICATION = [
  { value: '0', text: '通知済み' },
  { value: '1', text: 'エラー' },
];

export const KEYS_DISABLED_SELECT_TABLE_ROW = {
  ADMIN_MANAGEMENT: {
    KEY: 'admin_management_checked_disabled_select_row',
    value: 'is_edit',
  },
  COMPANY_ADD_DOCUMENT__GET_GROUPS: {
    KEY: 'company_add_document_checked_disabled_select_row',
    value: 'disabled',
  },
  COMPANY_ADMIN_MANAGEMENT: {
    KEY: 'company_admin_management_checked_disabled_select_row',
    value: 'is_edit',
  },
  COMPANY_GROUP: {
    KEY: 'company_group_checked_disabled_select_row',
    value: 'is_delete',
  },
};

export const TYPES_NOTIFICATION = {
  SUCCESS: '0',
  FAILED: '1',
  UN_SENT: '2',
};
export const TYPES_NOTIFICATION_STRING = [
  {
    type: TYPES_NOTIFICATION.UN_SENT,
    text: '未送信',
  },
  {
    type: TYPES_NOTIFICATION.FAILED,
    text: 'エラー',
  },
  {
    type: TYPES_NOTIFICATION.SUCCESS,
    text: '通知済み',
  },
];

export const DOCUMENT_APPROVE_STATUS = {
  REVIEWING: 0,
  APPROVED: 1,
  REJECT: 2,
};
