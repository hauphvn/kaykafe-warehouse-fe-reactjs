import * as yup from 'yup';
import { validatePassword } from 'src/app/yupValidation';
import { yupResolver } from '@hookform/resolvers/yup';

export const resolver = yupResolver(
  yup.object().shape({
    ...validatePassword(),
  }),
);

export const defaultValues = {
  password: '',
  confirmPassword: '',
  oldPassword: '',
};
