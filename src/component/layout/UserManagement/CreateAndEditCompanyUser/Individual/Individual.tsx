import 'src/component/layout/UserManagement/CreateAndEditCompanyUser/Individual/Individual.scss';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { Input, Select } from 'src/component/common';
import {
  companyUserIndividualSchema,
  defaultValuesIndividual,
} from 'src/component/layout/UserManagement/CreateAndEditCompanyUser/CompanyUserSchema';
import { useEffect } from 'react';

export interface IndividualPropsT {
  className?: string;
  groupOptions: any[];
  checkingValid: (event: any) => void;
  dataItemEdit?: any;
}

const Individual = (props: IndividualPropsT) => {
  const { className = '', groupOptions = [], checkingValid = () => null, dataItemEdit = null } = props;
  const {
    formState: { errors, isDirty, isValid, isValidating },
    control,
    getValues,
    reset,
  } = useForm({
    resolver: yupResolver(companyUserIndividualSchema()),
    mode: 'all',
    defaultValues: defaultValuesIndividual,
  });
  useEffect(() => {
    if (dataItemEdit?.itemSelected) {
      reset(dataItemEdit?.itemSelected);
    }
  }, [dataItemEdit]);
  useEffect(() => {
    checkingValid({ isValid, isDirty, data: getValues() });
  }, [isValid, isDirty, isValidating]);

  return (
    <div className={`${className} individual-user-root`}>
      <div className="form">
        <Controller
          control={control}
          name="userId"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              required={true}
              label={'ID '}
              placeholder={'ユーザーIDを入力して下さい'}
              className="text-item"
              textWarning={errors?.userId?.message ? errors?.userId?.message + '' : ''}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />

        <Controller
          control={control}
          name="userName"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              required={true}
              label={'ユーザー名'}
              placeholder={'ユーザー名を入力して下さい'}
              className="text-item"
              textWarning={errors?.userName?.message ? errors?.userName?.message + '' : ''}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              required={true}
              label={'メールアドレス'}
              placeholder={'メールアドレスを入力して下さい'}
              className="text-item"
              textWarning={errors?.email?.message ? errors?.email?.message + '' : ''}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              disable={dataItemEdit?.isEdit}
            />
          )}
        />

        <Controller
          control={control}
          name="group"
          render={({ field: { onChange, onBlur, value } }) => (
            <Select
              options={groupOptions}
              handleChange={onChange}
              required={true}
              label={'グループ略称 '}
              className="text-item"
              textWarning={errors?.group?.message ? errors?.group?.message + '' : ''}
              onBlur={onBlur}
              value={value}
              placeHolder={'グループを選択して下さい'}
            />
          )}
        />
      </div>
    </div>
  );
};

export default Individual;
