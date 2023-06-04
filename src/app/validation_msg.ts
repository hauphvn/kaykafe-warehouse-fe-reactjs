export const TOAST_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
};

export const VALIDATION_MESSAGE = {
  REQUIRED: 'This field is required',
  PASSWORD_STRONG: 'Password strong',
  PASSWORD_LOGIN: 'The password you entered is invalid.',
  PASSWORD_NOT_MATCH: 'Confirm password does not match.',
  INVALID_EMAIL: 'The email you entered is invalid.',
  PHONE_NUMBER_WRONG_FORMAT: '10 to 11 numeric characters, starting with the digit 0',
};

export const TOAST_MESSAGE = {
  UPDATE_SUCCESS: 'Update success',
  UPDATE_FAIL: 'Update fail',
  DELETE_FAIL: 'Delete success',
  REGISTER_SUCCESS: 'Register success',
  REGISTER_FAIL: ' Register fail',
  DELETE_SUCCESS: 'Delete success',
  GET_FAIL: 'Get fail',
  ADMIN_MANAGEMENT: {
    COMPANY: {
      ADD_NEW: {
        SUCCESS: 'CREATED SUCCESSFUL',
        FAIL: 'CREATED FAIL',
      },
      UPDATE: {
        SUCCESS: 'UPDATED SUCCESSFUL',
        FAIL: 'UPDATED FAIL',
      },
      GET_DETAIL: {
        FAIL: 'GET DETAIL FAIL',
      },
      DELETE: {
        SUCCESS: 'DELETED SUCCESSFUL',
        FAIL: 'DELETE FAIL',
      },
    },
    ADMIN: {
      ADD_NEW: {
        SUCCESS: 'CREATED SUCCESSFUL',
        FAIL: 'CREATED FAIL',
      },
      UPDATE: {
        SUCCESS: 'UPDATED SUCCESSFUL',
        FAIL: 'UPDATED FAIL',
      },
      GET_DETAIL: {
        FAIL: 'GET DETAIL FAIL',
      },
      DELETE: {
        SUCCESS: 'DELETED SUCCESSFUL',
        FAIL: 'DELETE FAIL',
      },
    },
    NOTIFICATION: {
      GET_LIST: {
        FAIL: 'GET FAIL',
      },
      ADD_NEW: {
        SUCCESS: 'CREATED SUCCESSFUL',
        FAIL: 'CREATED FAIL',
      },
      UPDATE: {
        SUCCESS: 'UPDATED SUCCESSFUL',
        FAIL: 'UPDATED FAIL',
      },
      GET_DETAIL: {
        FAIL: 'GET DETAIL FAIL',
      },
      DELETE: {
        SUCCESS: 'DELETED SUCCESSFUL',
        FAIL: 'DELETE FAIL',
      },
    },
  },
  COMPANY: {
    NOTIFICATION_FOR_IIS: {
      GET_LIST: {
        FAIL: 'GET LIST NOTIFICATION FOR ISS FAIL',
      },
    },
    DOCUMENT: {
      GET_DETAIL: {
        FAIL: 'GET DOCUMENT FAIL',
      },
      DELETE: {
        SUCCESS: 'DELETED SUCCESSFUL',
        FAIL: 'DELETE FAIL',
      },
      GET_AUTHORIZER: {
        FAIL: 'GET AUTHORIZERS FAIL',
      },
      UPLOAD: {
        FAIL: 'UPLOAD DOCUMENT FAIL',
        SUCCESS: 'UPLOAD DOCUMENT SUCCESS',
      },
      UPDATE: {
        FAIL: 'UPDATE DOCUMENT FAIL',
        SUCCESS: 'UPDATE DOCUMENT SUCCESS',
      },
      ADD_NEW: {
        FAIL: 'ADD NEW DOCUMENT FAIL',
        SUCCESS: 'ADD NEW DOCUMENT SUCCESS',
      },
    },
    NOTICE: {
      GET_LIST: {
        FAIL: 'GET LIST NOTICE FOR ISS FAIL',
      },
      APPROVE: {
        FAIL: 'APPROVE NOTICE FOR ISS FAIL',
        SUCCESS: 'APPROVE NOTICE FOR ISS SUCCESS',
      },
      REJECT: {
        FAIL: 'REJECT NOTICE FOR ISS FAIL',
        SUCCESS: 'REJECT NOTICE FOR ISS SUCCESS',
      },
      GET_DETAIL: {
        FAIL: 'GET DETAIL NOTICE FOR ISS FAIL',
      },
      DOWNLOAD: {
        FAIL: 'DOWNLOAD FAIL',
      },
    },
    GROUP: {
      GET_LIST: {
        FAIL: 'GET LIST NOTICE FOR ISS FAIL',
      },
      GET_DETAIL: {
        FAIL: 'GET DETAIL FAIL',
      },
      DELETE: {
        SUCCESS: 'DELETED SUCCESSFUL',
        FAIL: 'DELETE FAIL',
      },
      ADD_NEW: {
        SUCCESS: 'CREATED SUCCESSFUL',
        FAIL: 'CREATED FAIL',
      },
      UPDATE: {
        SUCCESS: 'UPDATED SUCCESSFUL',
        FAIL: 'UPDATED FAIL',
      },
    },
    USER: {
      GET_LIST: {
        GROUP: {
          ERROR: 'GET LIST GROUP FAIL',
        },
      },
      GET_DETAIL: {
        FAIL: 'GET DETAIL FAIL',
      },
      DELETE: {
        SUCCESS: 'DELETED SUCCESSFUL',
        FAIL: 'DELETE FAIL',
      },
      ADD_NEW: {
        SUCCESS: 'CREATED SUCCESSFUL',
        FAIL: 'CREATED FAIL',
      },
      UPDATE: {
        SUCCESS: 'UPDATED SUCCESSFUL',
        FAIL: 'UPDATED FAIL',
      },
      DOWNLOAD_CSV: {
        FAIL: 'DOWNLOAD CSV FAIL',
      },
      UPDATE_ACTIVE: {
        SUCCESS: 'UPDATE SUCCESSFUL',
        FAIL: 'UPDATE FAIL',
      },
      NOTIFICATION_RESEND: {
        REQUIRED: 'NOTIFICATION IS REQUIRED',
        RE_SEND: {
          SUCCESS: 'RESENT NOTIFICATION SUCCESS',
          FAIL: 'RESENT NOTIFICATION FAIL ',
        },
      },
    },
    ADMIN_MANAGEMENT: {
      GET_LIST: {
        FAIL: 'GET LIST NOTICE FOR ISS FAIL',
      },
      GET_DETAIL: {
        FAIL: 'GET DETAIL FAIL',
      },
      DELETE: {
        SUCCESS: 'DELETED SUCCESSFUL',
        FAIL: 'DELETE FAIL',
      },
      ADD_NEW: {
        SUCCESS: 'CREATED SUCCESSFUL',
        FAIL: 'CREATED FAIL',
      },
      UPDATE: {
        SUCCESS: 'UPDATED SUCCESSFUL',
        FAIL: 'UPDATED FAIL',
      },
    },
    NOTIFICATION: {
      ERROR_LIST: {
        GET_ALL: {
          FAIL: 'GET LIST ERROR NOTIFICATION FAIL',
        },
      },
      GET_LIST: {
        FAIL: 'GET LIST NOTICE FOR ISS FAIL',
      },
      GET_DETAIL: {
        FAIL: 'GET DETAIL FAIL',
      },
      DELETE: {
        SUCCESS: 'DELETED SUCCESSFUL',
        FAIL: 'DELETE FAIL',
      },
      ADD_NEW: {
        SUCCESS: 'CREATED SUCCESSFUL',
        FAIL: 'CREATED FAIL',
      },
      UPDATE: {
        SUCCESS: 'UPDATED SUCCESSFUL',
        FAIL: 'UPDATED FAIL',
      },
    },
  },
  COMMON: {
    COLOR: {
      GET_ALL: {
        FAIL: 'GET COLOR ERROR',
      },
    },
    FILE: {
      PDF: {
        NOT_ALLOW: 'ONLY ACCEPT PDF FORMAT',
      },
      CSV: {
        NOT_ALLOW: 'ONLY ACCEPT CSV FORMAT',
        WRONG_TEMPLATE: 'ERROR TEMPLATE CSV',
        WRONG_EMAIL: 'WRONG THE EMAIL ADDRESS',
      },
      OVER_SIZE_100MB: 'Please select an file smaller than 100 MB',
    },
  },
  LOGIN: {
    FAIL: 'Login fail',
  },
  USER: {
    DOWNLOAD: {
      DOCUMENT: {
        FAIL: 'DOWNLOAD DOCUMENT FAIL',
      },
    },
    DOCUMENT: {
      GET_ALL: {
        FAIL: 'GET DATA DOCUMENT FAIL',
      },
    },
    SETTING: {
      GET_INFO: {
        FAIL: 'GET DATA SETTING FAIL',
      },
      PUT: {
        SUCCESS: 'PUT DATA SETTING SUCCESS',
        FAIL: 'PUT DATA SETTING FAIL',
      },
      CHECK_CONTACT: {
        FAIL: 'CHECK CONTACT STATUS FAIL',
      },
      LINE: {
        INIT_FAIL: 'LINE INIT FAIL',
        GET_PROFILE_FAIL: 'LINE GET PROFILE FAIL',
      },
    },
  },
  RESET_PASSWORD: {
    SUCCESS: 'RESET PWD SUCCESSFUL',
    FAIL: 'RESET PWD FAIL',
  },
  SOMETHING_WRONG: 'SERVER ERROR',
};

export const MSG_CONFIRM = {
  DELETE: 'このアイテムを削除してもよろしいですか。',
  RESET: 'パスワードをリセットしてもよろしいですか?',
  CHANGE_ACTIVATE_USER: 'ARE YOU SURE',
};

export const MSG_ERROR_POST = {
  AZURE_POST_DOCUMENT: {
    FAIL: 'UPLOAD DOCUMENT TO CLOUD FAIL',
  },
  GET_URL_UPLOAD_DOCUMENT: {
    FAIL: 'UPLOAD DOCUMENT FAIL',
  },
};
