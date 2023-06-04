import { email, stringRequired } from 'src/app/yupValidation';
import * as yup from 'yup';

export const companyUserIndividualSchema = () => {
  return yup.object().shape({
    userId: stringRequired,
    userName: stringRequired,
    group: stringRequired,
    email,
  });
};

export const companyUserBulkSchema = () => {
  return yup.object().shape({
    groupId: stringRequired,
    files: stringRequired,
  });
};
export const defaultValuesIndividual = {
  userId: '',
  userName: '',
  group: undefined,
  email: '',
};
export const defaultValuesBulk = {
  groupId: '',
  files: '',
};
