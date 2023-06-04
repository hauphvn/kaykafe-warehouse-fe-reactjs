import './EditCompanyUser.scss';
import { useState } from 'react';
import { ObjectCreateOrEdit } from 'src/component/layout/ContractManagement/Companies/AdminManageCompanies';
import ModalCustom from 'src/component/common/Modal/ModalCustom/ModalCustom';
import IconUserAddingPath from 'src/assets/svg/icon-user-add-new.svg';
import Individual from 'src/component/layout/UserManagement/CreateAndEditCompanyUser/Individual/Individual';
import { FORM_COMPANY_USER_TYPE } from 'src/app/constant';
import { IOption } from 'src/component/layout/UserManagement/UserManagement';

type EditCompanyUserProps = {
  objCreateOrEdit: ObjectCreateOrEdit;
  onCloseModal: () => void;
  onCreateOrEditClick: (company: any) => void;
  groupOptions: IOption[];
};
const EditCompanyUser = (props: EditCompanyUserProps) => {
  const {
    objCreateOrEdit = { isEdit: false, showModal: false },
    onCloseModal = () => null,
    onCreateOrEditClick = () => null,
    groupOptions = [],
  } = props;
  const [checkingForm, setCheckingForm] = useState<any>({
    isDirty: false,
    isValid: false,
    data: null,
  });

  function handleCheckingValid(event: any, type: FORM_COMPANY_USER_TYPE) {
    if (type === FORM_COMPANY_USER_TYPE.INDIVIDUAL) {
      setCheckingForm({
        isDirty: event.isDirty,
        isValid: event.isValid,
        data: event.data,
      });
    }
  }

  function onSubmit() {
    if (checkingForm?.data) {
      const dataBody = {
        user_id: checkingForm.data.userId,
        user_name: checkingForm.data.userName,
        group_id: checkingForm.data.group,
        email: checkingForm.data.email,
        notification: checkingForm.data?.notification
          ? {
              title: 'title',
              content: 'content',
            }
          : null,
      };
      onCreateOrEditClick(dataBody);
    }
  }

  function onCancel() {
    onCloseModal();
  }

  // function onClickSetting() {
  //   alert('pending');
  // }

  // const getNodeSetting = () => {
  //   return (
  //       <div className={'setting-content-wrapper'} onClick={onClickSetting}>
  //         <img src={iconSetting} alt="icon" />
  //         <div className={'label'}>通知テンプレート</div>
  //       </div>
  //   );
  // };
  return (
    <div className={'company-user-edit-root'}>
      <ModalCustom
        destroyOnClose={true}
        className={'modal-create-edit-company-user modal-edit-individual-children'}
        iconLeftPath={IconUserAddingPath}
        onCancel={onCancel}
        title={'ユーザー登録'}
        isShow={objCreateOrEdit.showModal && objCreateOrEdit?.isEdit}
        okText={'保存'}
        cancelText={'キャンセル'}
        onSubmit={onSubmit}
        isDisable={!(checkingForm.isDirty && checkingForm.isValid)}
      >
        <div className={'company-user-create-root'}>
          <div className={'company-user-detail-module-root'}>
            <Individual
              dataItemEdit={objCreateOrEdit}
              checkingValid={(event: any) => handleCheckingValid(event, FORM_COMPANY_USER_TYPE.INDIVIDUAL)}
              groupOptions={groupOptions}
            />
          </div>
        </div>
      </ModalCustom>
    </div>
  );
};

export default EditCompanyUser;
