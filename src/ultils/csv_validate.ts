import { ValidatorConfig } from 'csv-file-validator';
import { REGEX_EMAIL } from 'src/app/constant';

const requiredError = (headerName: string, rowNumber: number, columnNumber: number) => {
  return `${headerName} is required in the ${rowNumber} row /${columnNumber} column`;
};

const validateError = (headerName: string, rowNumber: number, columnNumber: number) => {
  return `${headerName} is not valid in the ${rowNumber} row /${columnNumber} column`;
};

const uniqueError = (headerName: string, rowNumber: number) => {
  return `${headerName} is not unique at the ${rowNumber} row`;
};

const isEmailValid = function (email: string | number | boolean) {
  if (typeof email === 'string') {
    return REGEX_EMAIL.test(email);
  }
  return false;
};

export const CSVConfigUserCompany: ValidatorConfig = {
  headers: [
    { name: 'User ID', inputName: 'userId', required: true, requiredError },
    { name: 'User Name', inputName: 'userName', required: true, requiredError },
    {
      name: 'Email',
      inputName: 'email',
      required: true,
      requiredError,
      unique: true,
      uniqueError,
      validate: isEmailValid,
      validateError,
    },
  ],
  isColumnIndexAlphabetic: true,
};
