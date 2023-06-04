import './CreateEditCompanyGroup.scss';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { Input } from 'src/component/common';
import { useEffect } from 'react';
import { ObjectCreateOrEdit } from 'src/component/layout/ContractManagement/Companies/AdminManageCompanies';
import ModalCustom from 'src/component/common/Modal/ModalCustom/ModalCustom';
import IconUserAddingPath from 'src/assets/svg/icon-user-add-new.svg';
import {
  companyGroupSchema,
  defaultValues,
} from 'src/component/layout/GroupManagement/CreateAndEditCompanyGroup/CompanyGroupSchema';
type IISCreateAndEditCompanyProps = {
  objCreateOrEdit: ObjectCreateOrEdit;
  onCloseModal: () => void;
  onCreateOrEditClick: (company: any) => void;
};
const CreateEditCompanyGroup = (props: IISCreateAndEditCompanyProps) => {
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
    resolver: yupResolver(companyGroupSchema()),
    mode: 'all',
    defaultValues: defaultValues,
  });

  useEffect(() => {
    if (!objCreateOrEdit.isEdit) {
      reset(defaultValues);
    } else {
      if (objCreateOrEdit?.itemSelected) {
        reset({
          groupId: objCreateOrEdit.itemSelected?.groupId,
          groupName: objCreateOrEdit.itemSelected?.groupName,
          groupAbbreviation: objCreateOrEdit.itemSelected?.groupAbbreviation,
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
    <div className={'company-group-create-edit-root'}>
      <ModalCustom
        className={'modal-create-edit-company-group'}
        classNameExtendElementRight="setting-template-create-edit-company-group"
        iconLeftPath={IconUserAddingPath}
        onCancel={onCancel}
        title={'グループ登録'}
        isShow={objCreateOrEdit.showModal}
        okText={`${objCreateOrEdit?.isEdit ? '保存' : '登録'}`}
        cancelText={'キャンセル'}
        onSubmit={onSubmit}
        isDisable={!(isDirty && isValid)}
      >
        <div className={'company-group-add-new-and-edit-root'}>
          <div className={'company-group-detail-module-root'}>
            <div className="form">
              <Controller
                control={control}
                name="groupId"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    required={true}
                    label={'グループID '}
                    placeholder={'ユーザーIDを入力して下さい'}
                    className="text-item"
                    textWarning={errors?.groupId?.message ? errors?.groupId?.message + '' : ''}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                  />
                )}
              />

              <Controller
                control={control}
                name="groupName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    required={true}
                    label={'グループ名 '}
                    className="text-item"
                    placeholder={'グループ名を入力して下さい'}
                    textWarning={errors?.groupName?.message ? errors?.groupName?.message + '' : ''}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                  />
                )}
              />

              <Controller
                control={control}
                name="groupAbbreviation"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    required={true}
                    label={'グループ略称 '}
                    placeholder={'グループ省略を入力して下さい'}
                    className="text-item"
                    textWarning={errors?.groupAbbreviation?.message ? errors?.groupAbbreviation?.message + '' : ''}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
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

export default CreateEditCompanyGroup;
