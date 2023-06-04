import { VALIDATION_MESSAGE } from 'src/app/validation_msg';
import * as yup from 'yup';
import { REGEX_EMAIL, REGEX_PASSWORD_STRONG, REGEX_PHONE_NUMBER_JP, REGEX_PHONE_NUMBER_SIMPLE } from 'src/app/constant';

export const email = yup
  .string()
  .required(VALIDATION_MESSAGE.REQUIRED)
  .email(VALIDATION_MESSAGE.INVALID_EMAIL)
  .matches(REGEX_EMAIL, VALIDATION_MESSAGE.INVALID_EMAIL);
export const stringRequired = yup.string().required(VALIDATION_MESSAGE.REQUIRED).nullable();
export const phoneNumberFormatJP = yup
  .string()
  .required(VALIDATION_MESSAGE.REQUIRED)
  .matches(REGEX_PHONE_NUMBER_JP, VALIDATION_MESSAGE.PHONE_NUMBER_WRONG_FORMAT)
  .nullable();
export const phoneNumberSimple = yup
  .string()
  .required(VALIDATION_MESSAGE.REQUIRED)
  .matches(REGEX_PHONE_NUMBER_SIMPLE, VALIDATION_MESSAGE.PHONE_NUMBER_WRONG_FORMAT);
export const stringNormal = yup.string().nullable();
export const password = yup
  .string()
  .required(VALIDATION_MESSAGE.REQUIRED)
  .matches(REGEX_PASSWORD_STRONG, VALIDATION_MESSAGE.PASSWORD_STRONG);
export const passwordLogin = yup
  .string()
  .required(VALIDATION_MESSAGE.REQUIRED)
  .matches(REGEX_PASSWORD_STRONG, VALIDATION_MESSAGE.PASSWORD_LOGIN);
export const passwordAllowEmpty = yup.lazy(value => (value === '' ? yup.string() : password));
export const confirmPassword = yup
  .string()
  .required(VALIDATION_MESSAGE.REQUIRED)
  .oneOf([yup.ref('password'), null], VALIDATION_MESSAGE.PASSWORD_NOT_MATCH);

export function validatePassword() {
  return {
    oldPassword: password,
    password: password,
    confirmPassword: confirmPassword,
  };
}
