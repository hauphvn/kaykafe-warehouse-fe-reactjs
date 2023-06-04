import * as yup from 'yup';
import { email, stringRequired } from 'src/app/yupValidation';

export const defaultValues = {
  username: '',
  email: '',
  email1: '',
  sms: '',
  line: '',
  notiEmail: '',
  notiSms: '',
  notiNg: '',
};

export const designChangeSchema = () => {
  return yup.object().shape({
    username: stringRequired,
    email,
    email1: email,
    sms: stringRequired,
    line: stringRequired,
  });
};
