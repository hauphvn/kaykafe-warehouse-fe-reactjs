import * as yup from 'yup';
import { stringNormal, stringRequired } from 'src/app/yupValidation';
import { FORMAT_DATE_TIME, TIMESTAMP_REQUIRE, TYPE_DOCUMENTS } from 'src/app/constant';
import moment from 'moment';
import { VALIDATION_MESSAGE } from 'src/app/validation_msg';
export interface IExtendOptionDocument {
  isCommon: boolean;
  hasNotification: boolean;
}
export const startDateDefault = moment(new Date())
  .add(TIMESTAMP_REQUIRE.UPLOAD_DOCUMENT_START_DATE_ADDING_HOUR, 'hour')
  .format(FORMAT_DATE_TIME.DATE_HOUR_00);
export const endDateDefault = moment(new Date())
  .add(TIMESTAMP_REQUIRE.UPLOAD_DOCUMENT_END_DATE_ADDING_YEAR, 'year')
  .toString();

export const documentSchema = (isCommon: boolean) => {
  return yup.object().shape({
    typeDocument: stringRequired,
    periodDate: yup.object().nullable(),
    groupIds: isCommon
      ? yup.array().of(yup.string()).min(1, VALIDATION_MESSAGE.REQUIRED).required().nullable()
      : yup.array().of(yup.string()).min(0, VALIDATION_MESSAGE.REQUIRED).required().nullable(),
    nameRepresentFile: isCommon ? stringNormal : stringRequired,
    authorizer: stringRequired,
    fileIds: stringRequired,
  });
};

export const defaultValues = {
  typeDocument: TYPE_DOCUMENTS.COMMON,
  periodDate: { startDate: startDateDefault, endDate: endDateDefault },
  groupIds: [''],
  nameRepresentFile: '',
  authorizer: undefined,
  fileIds: '',
};
