import { stringRequired } from 'src/app/yupValidation';
import * as yup from 'yup';

export const companyGroupSchema = () => {
  return yup.object().shape({
    groupId: stringRequired,
    groupName: stringRequired,
    groupAbbreviation: stringRequired,
  });
};
export const defaultValues = {
  groupId: '',
  groupName: '',
  groupAbbreviation: '',
};
