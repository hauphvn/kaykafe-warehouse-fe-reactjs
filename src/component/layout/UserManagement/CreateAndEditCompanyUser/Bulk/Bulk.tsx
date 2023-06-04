import './Bulk.scss';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { Button, Input, Select } from 'src/component/common';
import {
  companyUserBulkSchema,
  defaultValuesBulk,
} from 'src/component/layout/UserManagement/CreateAndEditCompanyUser/CompanyUserSchema';
import { useEffect, useRef, useState } from 'react';
import { FILE_EXTEND_UPLOAD, SIZE_FILE } from 'src/app/constant';
import { onSetToastStatus } from 'src/redux/auth/authSlice';
import { TOAST_MESSAGE } from 'src/app/validation_msg';
import { useAppDispatch } from 'src/app/hooks';
import { validateCSVFile } from 'src/ultils/common';
import { CSVConfigUserCompany } from 'src/ultils/csv_validate';

export interface BulkPropsT {
  className?: string;
  groupOptions: any[];
  checkingValid: (event: any) => void;
  dataItemEdit?: any;
}

const Bulk = (props: BulkPropsT) => {
  const dispatch = useAppDispatch();
  const { className = '', groupOptions = [], checkingValid = () => null, dataItemEdit = null } = props;
  const refUploadFile = useRef<HTMLInputElement>(null);
  const [dataFromCSV, setDataFromCSV] = useState<any>(null);

  const {
    formState: { errors, isDirty, isValid, isValidating },
    control,
    getValues,
    reset,
    trigger,
    setValue,
  } = useForm({
    resolver: yupResolver(companyUserBulkSchema()),
    mode: 'all',
    defaultValues: defaultValuesBulk,
  });
  useEffect(() => {
    if (dataItemEdit?.itemSelected) {
      reset(dataItemEdit?.itemSelected);
    }
  }, [dataItemEdit]);
  useEffect(() => {
    checkingValid({
      isValid,
      isDirty,
      data: {
        ...getValues(),
        groupName: groupOptions?.find((item: any) => item?.value === getValues()?.groupId)?.text || '',
        bulk: true,
        dataFromCSV,
      },
    });
  }, [isValid, isDirty, isValidating]);
  const preOnchange = (name: any, event: any, onChange: any) => {
    onChange(event);
  };

  function handleClickUploadFile() {
    if (refUploadFile && refUploadFile?.current) {
      refUploadFile?.current?.click();
    }
  }

  function handleChangeUploadFile(event: any) {
    const file = event.target.files[0];
    validateCSVFile(file, CSVConfigUserCompany)
      .then((result: any) => {
        const rowsIndexError: {
          rowIndex: number;
          message: string;
        }[] = [];

        if (result?.inValidData?.length > 0) {
          const dataInValid: any[] = [];
          result?.inValidData?.forEach((item: any) => {
            rowsIndexError.push({
              rowIndex: item?.rowIndex - 1,
              message: item?.message,
            });
          });
          let indexError = -1;
          result?.data?.forEach((item: any, index: number) => {
            indexError = rowsIndexError.findIndex((error: any) => error.rowIndex === index + 1);
            if (indexError > -1) {
              dataInValid.push({
                ...item,
                errorMessage: rowsIndexError[indexError].message,
              });
            }
          });
          setDataFromCSV({
            data: dataInValid,
            valid: false,
            totalRecord: result?.data?.length,
          });
          checkingValid({
            isValid,
            isDirty,
            data: {
              ...getValues(),
              groupName: groupOptions?.find((item: any) => item?.value === getValues()?.groupId)?.text || '',
              bulk: true,
              dataFromCSV: {
                data: dataInValid,
                valid: false,
                totalRecord: result?.data?.length,
              },
            },
          });
        } else {
          setDataFromCSV({
            data: result?.data,
            valid: true,
          });
          checkingValid({
            isValid,
            isDirty,
            data: {
              ...getValues(),
              groupName: groupOptions?.find((item: any) => item?.value === getValues()?.groupId)?.text || '',
              bulk: true,
              dataFromCSV: {
                data: result?.data,
                valid: true,
              },
            },
          });
        }
      })
      .catch(() => {
        dispatch(
          onSetToastStatus({
            message: TOAST_MESSAGE.COMMON.FILE.CSV.WRONG_TEMPLATE,
            showToast: true,
            status: 'error',
          }),
        );
      });
    if (file && file.type === FILE_EXTEND_UPLOAD.CSV) {
      if (file.size > SIZE_FILE.MAX_SIZE_UPLOAD_FOR_COMPANY_FILE * 1024 * 1024) {
        dispatch(
          onSetToastStatus({
            message: TOAST_MESSAGE.COMMON.FILE.OVER_SIZE_100MB,
            showToast: true,
            status: 'error',
          }),
        );
      } else {
        const reader = new FileReader();
        reader.onloadend = event => {
          if (event) {
            setValue('files', file.name + ' ', { shouldDirty: true, shouldTouch: true });
            trigger('files');
          }
        };
        reader.readAsText(file);
      }
    } else {
      dispatch(
        onSetToastStatus({
          message: TOAST_MESSAGE.COMMON.FILE.CSV.NOT_ALLOW,
          showToast: true,
          status: 'error',
        }),
      );
    }
  }

  return (
    <div className={`${className} bulk-user-root`}>
      <div className="form">
        <Controller
          control={control}
          name="groupId"
          render={({ field: { onChange, onBlur, value, name } }) => (
            <Select
              options={groupOptions}
              handleChange={(e: any) => preOnchange(name, e, onChange)}
              required={true}
              label={'グループ略称 '}
              className="text-item"
              textWarning={errors?.groupId?.message ? errors?.groupId?.message + '' : ''}
              onBlur={onBlur}
              value={value}
            />
          )}
        />
        <Controller
          control={control}
          name="files"
          render={({ field: { onChange, onBlur, value } }) => (
            <div className={'upload-files-bulk-wrapper'}>
              <Input
                disable={true}
                required={true}
                label={'ファイル名'}
                className="text-item"
                textWarning={errors?.files?.message ? errors?.files?.message + '' : ''}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
              />
              <Button
                onClick={() => {
                  handleClickUploadFile();
                }}
                className={'btn-upload'}
                name={'参照'}
              />
            </div>
          )}
        />
      </div>
      <input
        onChange={event => handleChangeUploadFile(event)}
        ref={refUploadFile}
        id={'upload-files-user-company-bulk'}
        style={{ display: 'none' }}
        type="file"
        accept={FILE_EXTEND_UPLOAD.CSV}
        onClick={(event: any) => {
          const { target } = event || {};
          target.value = '';
        }}
      />
    </div>
  );
};

export default Bulk;
