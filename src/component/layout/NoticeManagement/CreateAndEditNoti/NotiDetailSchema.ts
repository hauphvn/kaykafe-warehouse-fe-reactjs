import { stringRequired } from 'src/app/yupValidation';
import * as yup from 'yup';
import { VALIDATION_MESSAGE } from 'src/app/validation_msg';

export const notificationDetailSchema = () => {
  return yup.object().shape({
    title: stringRequired,
    content: stringRequired,
    periodDate: yup.object().nullable(),
    companyIds: yup.array().of(yup.string()).min(0, VALIDATION_MESSAGE.REQUIRED).required().nullable(),
  });
};
export const defaultValues = {
  title: '',
  content: '',
  periodDate: {},
  companyIds: [''],
};
