import axios from 'axios';
import CONFIG from 'src/config/enviroment';
import { NAVIGATION_PATH } from 'src/app/constant';
import { refreshTokenExpried } from 'src/ultils/common';
import { checkRefreshToken } from 'src/api/authenApi';
import { TokenService } from 'src/ultils/tokenService';

export const headerOptions: any = (isRefreshToken: boolean) => {
  const token = TokenService.getToken();
  const objHeader = {
    'Content-Type': 'application/json',
  };
  if (!isRefreshToken && token) {
    return {
      ...objHeader,
      Authorization: `Bearer ${token}`,
    };
  } else {
    return objHeader;
  }
};

export default function request(url: string, options: any, isRefreshToken = false) {
  const tokenExpried: any = TokenService.getTokenExpried();
  return axios({ ...options, url: url })
    .then((response: any) => {
      if (JSON.parse(tokenExpried)) {
        TokenService.removeTokenExpried();
      }
      return response;
    })
    .catch(error => {
      if (error?.response?.status === 401) {
        if (!isRefreshToken) {
          return checkRefreshToken({ options, url: url });
        } else {
          refreshTokenExpried();
        }
      } else if (error?.response?.status === 403) {
        refreshTokenExpried();
      } else {
        // throw new Error(error.response?.data?.error_code);
        if (error?.response?.data) {
          throw error?.response?.data;
        } else {
          throw new Error(error?.response?.status);
        }
      }
    });
}

export function get(url: string, optionsRequest?: any) {
  const fullUrl = CONFIG.API_ENDPOINT + url;
  const headers = headerOptions();
  let options = {
    method: 'GET',
    headers: headers,
    credentials: 'include',
  };
  if (optionsRequest) {
    options = {
      ...options,
      ...optionsRequest,
    };
  }
  return request(fullUrl, options);
}

export function post(url: string, bodyData: any, isRefreshToken = false) {
  const fullUrl = CONFIG.API_ENDPOINT + url;
  const headers = headerOptions(isRefreshToken);
  const options = {
    method: 'POST',
    headers: headers,
    credentials: 'include',
    data: bodyData,
  };

  return request(fullUrl, options, isRefreshToken);
}

export function put(url: string, bodyData: any) {
  const fullUrl = CONFIG.API_ENDPOINT + url;
  const headers = headerOptions();
  const options = {
    method: 'PUT',
    headers: headers,
    credentials: 'include',
    data: bodyData,
  };

  return request(fullUrl, options);
}

export function patch(url: string, bodyData: any) {
  const fullUrl = CONFIG.API_ENDPOINT + url;
  const headers = headerOptions();
  const options = {
    method: 'PATCH',
    headers: headers,
    credentials: 'include',
    data: bodyData,
  };

  return request(fullUrl, options);
}

export function del(url: string, bodyData?: any) {
  const fullUrl = CONFIG.API_ENDPOINT + url;
  const headers = headerOptions();
  const options: any = {
    method: 'DELETE',
    headers: headers,
    credentials: 'include',
  };
  if (bodyData) {
    options['data'] = bodyData;
  }
  return request(fullUrl, options);
}

export function postLogout(url: string, bodyData: any) {
  const fullUrl = CONFIG.API_ENDPOINT + url;
  const headers = headerOptions();
  const options: any = {
    method: 'POST',
    headers: headers,
    credentials: 'include',
    data: bodyData,
  };

  return axios({ ...options, url: fullUrl })
    .then((response: any) => {
      return response;
    })
    .catch(error => {
      if (error?.response?.status === 401) {
        TokenService.clearLocalStorage();
        window.location.replace(`${window.location.origin}${NAVIGATION_PATH.LOGIN}`);
        window.location.reload();
      } else {
        throw error;
      }
    });
}

export function putChangePasswordFirst(url: string, bodyData: any, token: string) {
  const fullUrl = CONFIG.API_ENDPOINT + url;
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  const options: any = {
    method: 'PUT',
    headers: headers,
    credentials: 'include',
    data: bodyData,
  };

  return axios({ ...options, url: fullUrl })
    .then((response: any) => {
      return response;
    })
    .catch(error => {
      if (error?.response?.status === 401) {
        TokenService.clearLocalStorage();
        window.location.replace(`${window.location.origin}${NAVIGATION_PATH.LOGIN}`);
        window.location.reload();
      } else {
        throw error;
      }
    });
}
