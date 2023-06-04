import 'src/component/layout/AdminManagement/CreateAndEditAdmin/AdminCreateAndEditAdmin.scss';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { Input } from 'src/component/common';
import { useEffect } from 'react';
import { ObjectCreateOrEdit } from 'src/component/layout/ContractManagement/Companies/AdminManageCompanies';
import ModalCustom from 'src/component/common/Modal/ModalCustom/ModalCustom';
import IconUserAddingPath from 'src/assets/svg/icon-user-add-new.svg';
import { adminDetailSchema } from 'src/component/layout/AdminManagement/CreateAndEditAdmin/AdminDetailSchema';

const defaultValues = {
  email: '',
  name: '',
};
type IISCreateAndEditCompanyProps = {
  objCreateOrEdit: ObjectCreateOrEdit;
  onCloseModal: () => void;
  onCreateOrEditClick: (company: any) => void;
};
const AdminCreateAndEditAdmin = (props: IISCreateAndEditCompanyProps) => {
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
    resolver: yupResolver(adminDetailSchema()),
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
        });
      }
    }
  }, [objCreateOrEdit.showModal]);

  function onSubmit() {
    onCreateOrEditClick(getValues());
  }

  function onCancel() {
    onCloseModal();
  }

  return (
    <div className={'admin-create-edit-admin-root'}>
      <ModalCustom
        className={'modal-create-edit-admin'}
        classNameExtendElementRight="setting-template-create-edit-admin"
        iconLeftPath={IconUserAddingPath}
        onCancel={onCancel}
        // title={'契約企業登録'}
        title={`${objCreateOrEdit?.isEdit ? '運用者編集' : '運用者登録'}`}
        isShow={objCreateOrEdit.showModal}
        okText={`${objCreateOrEdit?.isEdit ? '保存' : '登録'}`}
        cancelText={'キャンセル'}
        onSubmit={onSubmit}
        isDisable={!(isDirty && isValid)}
      >
        <div className={'iis-add-new-and-edit-admin-root'}>
          <div className={'iis-admin-detail-module-root'}>
            <div className="form">
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    required={true}
                    placeholder={'名称を入力して下さい'}
                    label={'名称'}
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
                    required={true}
                    placeholder={'メールアドレスを入力して下さい'}
                    label={'メールアドレス'}
                    className="text-item"
                    textWarning={errors?.email?.message ? errors?.email?.message + '' : ''}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    disable={objCreateOrEdit?.isEdit}
                  />
                )}
              />
            </div>
          </div>
        </div>
      </ModalCustom>
    </div>
  );
};

export default AdminCreateAndEditAdmin;
