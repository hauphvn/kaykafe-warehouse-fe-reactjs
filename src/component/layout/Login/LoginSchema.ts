import { email, passwordLogin, stringNormal } from 'src/app/yupValidation';
import * as yup from 'yup';
export const loginSchema = yup.object().shape({
  email,
  password: passwordLogin,
  companyId: stringNormal,
});
