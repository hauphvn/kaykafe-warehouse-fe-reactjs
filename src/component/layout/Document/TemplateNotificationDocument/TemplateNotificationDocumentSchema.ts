import { stringNormal, stringRequired } from 'src/app/yupValidation';
import * as yup from 'yup';

export const templateNotificationDocumentSchema = () => {
  return yup.object().shape({
    type: stringNormal,
    title: stringRequired,
    content: stringRequired,
    sms: stringNormal,
    line: stringNormal,
  });
};

export const defaultValues = {
  type: '',
  title: '',
  content: '',
  sms: '',
  line: '',
};
