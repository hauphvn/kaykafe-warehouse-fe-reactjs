import { email, stringRequired } from 'src/app/yupValidation';
import * as yup from 'yup';

export const adminDetailSchema = () => {
  return yup.object().shape({
    email,
    name: stringRequired,
  });
};
