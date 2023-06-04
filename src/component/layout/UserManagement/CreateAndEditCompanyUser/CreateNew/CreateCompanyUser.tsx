import './CreateCompanyUser.scss';
import { ObjectCreateOrEdit } from 'src/component/layout/ContractManagement/Companies/AdminManageCompanies';
import ModalCustom from 'src/component/common/Modal/ModalCustom/ModalCustom';
import IconUserAddingPath from 'src/assets/svg/icon-user-add-new.svg';
import Tabs, { TabsItem } from 'src/component/common/Tabs/Tabs';
import Individual from 'src/component/layout/UserManagement/CreateAndEditCompanyUser/Individual/Individual';
import iconSetting from 'src/assets/svg/icon-setting-bold.svg';
import iconDownload from 'src/assets/svg/icon-download.svg';
import { useEffect, useState } from 'react';
import { get } from 'src/ultils/request';
import { onSetShowLoading, onSetToastStatus } from 'src/redux/auth/authSlice';
import { useAppDispatch } from 'src/app/hooks';
import { API_PATH } from 'src/app/constant';
import { downloadURI, handleErrorFromResponse } from 'src/ultils/common';
import { TOAST_MESSAGE } from 'src/app/validation_msg';
import Bulk from 'src/component/layout/UserManagement/CreateAndEditCompanyUser/Bulk/Bulk';
import { IOption } from 'src/component/layout/UserManagement/UserManagement';

const TAB_KEY = {
  INDIVIDUAL: '1',
  BULK: '2',
};
type CreateCompanyUserProps = {
  objCreateOrEdit: ObjectCreateOrEdit;
  onCloseModal: () => void;
  onCreateOrEditClick: (user: any) => void;
  onCreateByBulkClick: (user: any) => void;
  onClickSetting?: () => void;
  isSubmitted?: boolean;
  groupOptions?: IOption[];
};
const CreateCompanyUser = (props: CreateCompanyUserProps) => {
  const dispatch = useAppDispatch();
  const {
    objCreateOrEdit = { isEdit: false, showModal: false },
    onCloseModal = () => null,
    onCreateOrEditClick = () => null,
    onCreateByBulkClick = () => null,
    onClickSetting = () => null,
    isSubmitted = false,
    groupOptions = [],
  } = props;
  const [checkingForm, setCheckingForm] = useState<any>({
    isDirty: false,
    isValid: false,
    data: null,
  });
  const [tabSelectedKey, setTabSelectedKey] = useState(TAB_KEY.INDIVIDUAL);

  const tabItems: TabsItem[] = [
    {
      key: TAB_KEY.INDIVIDUAL,
      label: '個別登録',
      children: (
        <Individual
          checkingValid={(event: any) => handleCheckingValid(event)}
          groupOptions={groupOptions}
          className={'modal-add-new-individual-children'}
        />
      ),
    },
    {
      key: TAB_KEY.BULK,
      label: '一括登録',
      children: <Bulk checkingValid={(event: any) => handleCheckingValid(event)} groupOptions={groupOptions} />,
    },
  ];
  useEffect(() => {
    if (isSubmitted) {
      setTabSelectedKey(TAB_KEY.INDIVIDUAL);
    }
  }, [isSubmitted]);

  function handleCheckingValid(event: any) {
    setCheckingForm({
      isDirty: event.isDirty,
      isValid: event.isValid,
      data: event.data,
    });
  }

  function onSubmit() {
    if (checkingForm?.data?.bulk) {
      const dataTable: any[] = [];
      checkingForm?.data?.dataFromCSV?.data?.forEach((item: any, index: number) => {
        dataTable.push({
          no: index + 1,
          user_id: item?.userId,
          user_name: item?.userName,
          email: item?.email,
          error_message: item?.errorMessage,
        });
      });
      if (checkingForm?.data?.dataFromCSV?.valid) {
        // Add new by bulk csv file
        const dataPost = {
          body: {
            group_id: checkingForm?.data?.groupId,
            user_list: dataTable,
            notification: null,
          },
          showPreviewIsValid: true,
          groupName: checkingForm?.data?.groupName,
          listUsers: dataTable,
        };
        onCreateByBulkClick(dataPost);
      } else {
        // Data from PC is invalid
        onCreateByBulkClick({
          showPreviewInValid: true,
          groupName: checkingForm?.data?.groupName,
          listUsers: dataTable,
          totalRecord: checkingForm?.data?.dataFromCSV?.totalRecord,
        });
      }
    } else {
      //Add new by individual
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
      setTabSelectedKey(TAB_KEY.INDIVIDUAL);
    }
  }

  function onCancel() {
    // setTabSelectedKey(TAB_KEY.INDIVIDUAL);
    onCloseModal();
  }

  async function onDownloadCSV() {
    dispatch(onSetShowLoading('loading'));
    get(API_PATH.COMMON_TEMPLATE)
      .then((res: any) => {
        dispatch(onSetShowLoading('idle'));
        if (res && res?.data) {
          downloadURI(res?.data?.url, dispatch);
        }
      })
      .catch((err: any) => {
        dispatch(onSetShowLoading('idle'));
        dispatch(
          onSetToastStatus({
            message: handleErrorFromResponse(err, TOAST_MESSAGE.COMPANY.USER.DOWNLOAD_CSV.FAIL),
            showToast: true,
            status: 'error',
          }),
        );
      });
  }

  function preOnClickSetting() {
    if (tabSelectedKey === TAB_KEY.INDIVIDUAL) {
      onClickSetting();
    } else {
      dispatch(onSetShowLoading('loading'));
      onDownloadCSV()
        .then(() => {
          dispatch(onSetShowLoading('idle'));
        })
        .catch((err: any) => {
          dispatch(onSetShowLoading('idle'));
          dispatch(
            onSetToastStatus({
              message: handleErrorFromResponse(err, TOAST_MESSAGE.COMPANY.USER.DOWNLOAD_CSV.FAIL),
              showToast: true,
              status: 'success',
            }),
          );
        });
    }
  }

  const getNodeSettingOrDownload = () => {
    return (
      <div className={'setting-content-wrapper'} onClick={preOnClickSetting}>
        <img
          className={`${tabSelectedKey !== TAB_KEY.INDIVIDUAL ? 'image-small' : ''}`}
          src={tabSelectedKey === TAB_KEY.INDIVIDUAL ? iconSetting : iconDownload}
          alt="icon"
        />
        <div className={'label'}>{tabSelectedKey === TAB_KEY.INDIVIDUAL ? '通知テンプレート' : 'CSVテンプレート'}</div>
      </div>
    );
  };

  function onSwitchTab(key: string) {
    setTabSelectedKey(key);
  }

  return (
    <div className={'company-user-create-root'}>
      <ModalCustom
        destroyOnClose={isSubmitted}
        classNameExtendElementRight={'setting-add-new-company-user'}
        extendElementRight={getNodeSettingOrDownload()}
        className={'modal-create-edit-company-user'}
        iconLeftPath={IconUserAddingPath}
        onCancel={onCancel}
        title={'ユーザー登録'}
        isShow={objCreateOrEdit.showModal && !objCreateOrEdit?.isEdit}
        okText={'登録'}
        cancelText={'キャンセル'}
        onSubmit={onSubmit}
        isDisable={!(checkingForm.isDirty && checkingForm.isValid)}
      >
        <Tabs onChange={onSwitchTab} items={tabItems} />
      </ModalCustom>
    </div>
  );
};
export default CreateCompanyUser;
