import './CreateAndEditCompanyAdmin.scss';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { Checkbox, Input } from 'src/component/common';
import { useEffect } from 'react';
import { ObjectCreateOrEdit } from 'src/component/layout/ContractManagement/Companies/AdminManageCompanies';
import ModalCustom from 'src/component/common/Modal/ModalCustom/ModalCustom';
import IconUserAddingPath from 'src/assets/svg/icon-user-add-new.svg';
import {
  companyAdminManagementSchema,
  defaultValues,
} from 'src/component/layout/CompanyAdminManagement/CreateAndEditCompanyAdmin/CompanyAdminManagementSchema';

type CreateAndEditCompanyAdminProps = {
  objCreateOrEdit: ObjectCreateOrEdit;
  onCloseModal: () => void;
  onCreateOrEditClick: (company: any) => void;
};
const CreateAndEditCompanyAdmin = (props: CreateAndEditCompanyAdminProps) => {
  const {
    objCreateOrEdit = { isEdit: false, showModal: false },
    onCloseModal = () => null,
    onCreateOrEditClick = () => null,
  } = props;
  const {
    formState: { errors, isDirty, isValid },
    control,
    getValues,
    reset,
  } = useForm({
    resolver: yupResolver(companyAdminManagementSchema()),
    mode: 'all',
    defaultValues: defaultValues,
  });

  useEffect(() => {
    if (!objCreateOrEdit.isEdit) {
      reset(defaultValues);
    } else {
      if (objCreateOrEdit?.itemSelected) {
        reset({
          email: objCreateOrEdit.itemSelected?.email,
          name: objCreateOrEdit.itemSelected?.name,
          acceptable: [objCreateOrEdit.itemSelected?.acceptable],
        });
      }
    }
  }, [objCreateOrEdit.showModal]);

  function onSubmit() {
    onCreateOrEditClick({
      ...getValues(),
      acceptable: getValues().acceptable[0],
    });
  }

  function onCancel() {
    onCloseModal();
  }
  return (
    <div className={'company-management-create-edit-root'}>
      <ModalCustom
        className={'modal-create-edit-company-management'}
        classNameExtendElementRight="setting-template-create-edit-admin"
        iconLeftPath={IconUserAddingPath}
        onCancel={onCancel}
        title={'契約企業登録'}
        isShow={objCreateOrEdit.showModal}
        okText={`${objCreateOrEdit?.isEdit ? '保存' : '登録'}`}
        cancelText={'キャンセル'}
        onSubmit={onSubmit}
        isDisable={!(isDirty && isValid)}
      >
        <div className={'company-management-add-new-and-edit-root'}>
          <div className={'company-management-detail-module-root'}>
            <div className="form">
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    required={true}
                    label={'管理者名'}
                    placeholder={'管理者名を入力して下さい'}
                    className="text-item"
                    textWarning={errors?.name?.message ? errors?.name?.message + '' : ''}
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
                    disable={objCreateOrEdit?.isEdit}
                    required={true}
                    label={'メールアドレス'}
                    placeholder={'メールアドレスを入力して下さい'}
                    className="text-item"
                    textWarning={errors?.email?.message ? errors?.email?.message + '' : ''}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                  />
                )}
              />

              <Controller
                control={control}
                name="acceptable"
                render={({ field: { onChange, value } }) => (
                  <Checkbox onChange={onChange} items={[{ value: 'true', label: '承認可能' }]} value={[...value]} />
                )}
              />
            </div>
          </div>
        </div>
      </ModalCustom>
    </div>
  );
};

export default CreateAndEditCompanyAdmin;
