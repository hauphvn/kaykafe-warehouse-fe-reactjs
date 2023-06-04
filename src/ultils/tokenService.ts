import { LOCALSTORAGE_ITEM } from 'src/app/constant';

const getToken = () => localStorage.getItem(LOCALSTORAGE_ITEM.ACCESS_TOKEN);
const getRoleToken = () => localStorage.getItem(LOCALSTORAGE_ITEM.ROLE);
const setRoleToken = (data: string) => localStorage.setItem(LOCALSTORAGE_ITEM.ROLE, data);
const setInfoIsFirst = (data: string) => localStorage.setItem(LOCALSTORAGE_ITEM.IS_FIRST, data);
const setToken = (data: any) => localStorage.setItem(LOCALSTORAGE_ITEM.ACCESS_TOKEN, data);
const getRefreshToken = () => localStorage.getItem(LOCALSTORAGE_ITEM.REFRESH_TOKEN);
const setRefreshToken = (data: any) => localStorage.setItem(LOCALSTORAGE_ITEM.REFRESH_TOKEN, data);
const getTokenExpried = () => Boolean(localStorage.getItem(LOCALSTORAGE_ITEM.TOKEN_EXPRIED));
const setTokenExpried = (data: string) => localStorage.setItem(LOCALSTORAGE_ITEM.TOKEN_EXPRIED, data);
const removeTokenExpried = () => localStorage.removeItem(LOCALSTORAGE_ITEM.TOKEN_EXPRIED);
const setInfoColor = (data: any) => localStorage.setItem(LOCALSTORAGE_ITEM.INFO_COLOR, data);
const getInfoColor = () => localStorage.getItem(LOCALSTORAGE_ITEM.INFO_COLOR);
const clearLocalStorage = () => localStorage.clear();

export const TokenService = {
  getToken,
  setToken,
  getRefreshToken,
  setRefreshToken,
  getTokenExpried,
  setTokenExpried,
  removeTokenExpried,
  clearLocalStorage,
  getRoleToken,
  setRoleToken,
  setInfoIsFirst,
  setInfoColor,
  getInfoColor,
};
