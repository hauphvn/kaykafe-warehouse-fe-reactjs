import { email, stringRequired } from 'src/app/yupValidation';
import * as yup from 'yup';

export const companyAdminManagementSchema = () => {
  return yup.object().shape({
    email,
    name: stringRequired,
    acceptable: yup.object().nullable(),
  });
};

export const defaultValues = {
  email: '',
  name: '',
  acceptable: ['false'],
};
