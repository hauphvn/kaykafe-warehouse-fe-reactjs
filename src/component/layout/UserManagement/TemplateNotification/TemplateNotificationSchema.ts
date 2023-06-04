import { stringNormal, stringRequired } from 'src/app/yupValidation';
import * as yup from 'yup';

export const templateNotificationSchema = () => {
  return yup.object().shape({
    type: stringNormal,
    title: stringRequired,
    content: stringRequired,
  });
};

export const defaultValues = {
  type: '',
  title: '',
  content: '',
};
