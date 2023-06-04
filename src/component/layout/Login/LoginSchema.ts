import { email, stringNormal } from 'src/app/yupValidation';
import * as yup from 'yup';
export const loginSchema = yup.object().shape({
  email,
  password: stringNormal,
});
