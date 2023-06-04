import { email, phoneNumberSimple, stringRequired } from 'src/app/yupValidation';
import * as yup from 'yup';

export const companyDetailSchema = () => {
  return yup.object().shape({
    email,
    companyName: stringRequired,
    companyId: stringRequired,
    representativeManager: stringRequired,
    phone: phoneNumberSimple,
    recommendENV: stringRequired,
    privatePolicy: stringRequired,
    termsOfService: stringRequired,
  });
};

export const defaultValues = {
  email: '',
  companyName: '',
  representativeManager: '',
  color: '',
  phone: '',
  recommendENV: '',
  privatePolicy: '',
  termsOfService: '',
  companyId: '',
};
