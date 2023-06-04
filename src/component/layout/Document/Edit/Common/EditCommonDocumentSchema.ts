import { stringNormal, stringRequired } from 'src/app/yupValidation';
import * as yup from 'yup';
import { VALIDATION_MESSAGE } from 'src/app/validation_msg';
import moment from 'moment/moment';
import { FORMAT_DATE_TIME, TIMESTAMP_REQUIRE } from 'src/app/constant';

export const startDateDefault = moment(new Date())
  .add(TIMESTAMP_REQUIRE.UPLOAD_DOCUMENT_START_DATE_ADDING_HOUR, 'hour')
  .format(FORMAT_DATE_TIME.DATE_HOUR_00);
export const endDateDefault = moment(new Date())
  .add(TIMESTAMP_REQUIRE.UPLOAD_DOCUMENT_END_DATE_ADDING_YEAR, 'year')
  .toString();
export const editCommonDocumentSchema = () => {
  return yup.object().shape({
    documentType: stringNormal,
    authorizer: stringRequired,
    groupIds: yup.array().of(yup.string()).min(1, VALIDATION_MESSAGE.REQUIRED).required().nullable(),
    periodDate: yup.object().nullable(),
    documentName: stringNormal,
  });
};
export const editCommonDocumentDefaultValues = {
  documentType: '',
  authorizer: '',
  groupIds: [''],
  periodDate: { startDate: startDateDefault, endDate: endDateDefault },
  documentName: '',
};
