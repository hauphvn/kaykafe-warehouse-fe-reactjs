import 'src/component/layout/UserManagement/CreateAndEditCompanyUser/PreviewValidationCSV/Valid/PreviewCSVIsValid.scss';
import { Checkbox, Input, Table } from 'src/component/common';
import ModalCustom from 'src/component/common/Modal/ModalCustom/ModalCustom';
import IconUserAddingPath from 'src/assets/svg/icon-user-add-new.svg';
import { HEIGHT_TABLE } from 'src/app/constant';
import iconSetting from 'src/assets/svg/icon-setting.svg';
import { useEffect, useState } from 'react';
import { handleAddStt, handleSort } from 'src/ultils/common';

type PreviewCSVIsValidPropsT = {
  notification?: any;
  className?: string;
  onSubmit: (optionsChange: any) => void;
  onClose: () => void;
  objDataPreview: any;
  onClickSetting?: () => void;
  isSubmitted?: boolean;
};
const PreviewCSVIsValid = (props: PreviewCSVIsValidPropsT) => {
  const {
    onClose = () => null,
    onSubmit = () => null,
    onClickSetting = () => null,
    objDataPreview = null,
    isSubmitted = false,
  } = props;
  const [checkedNotification, setCheckedNotification] = useState([]);
  const [sortState, setSortState] = useState({ ordering: '' });
  const [listDataOriginal, setListDataOriginal] = useState<any[]>([]);
  const [listDataView, setListDataView] = useState<any[]>([]);
  useEffect(() => {
    if (isSubmitted) {
      setCheckedNotification([]);
    }
  }, [isSubmitted]);
  useEffect(() => {
    setListDataOriginal(objDataPreview?.data?.listUsers);
    setListDataView(objDataPreview?.data?.listUsers);
  }, [objDataPreview?.data?.listUsers]);
  const handleClickSorter = (data: any) => {
    setSortState(pre => {
      let orderKey = '';
      if (pre.ordering === '-' + data.key) {
        orderKey = '';
        const newData = handleAddStt({ page: 1 }, listDataOriginal);
        setListDataView(newData);
      } else if (data?.key !== pre.ordering) {
        orderKey = data.key;
        const newData = handleAddStt({ page: 1 }, handleSort(data, 'alphabetically', listDataView));
        setListDataView(newData);
      } else if (data?.key === pre.ordering) {
        orderKey = '-' + data.key;
        const newData = handleAddStt({ page: 1 }, handleSort(data, '', listDataView));
        setListDataView(newData);
      }
      return { ...sortState, ordering: orderKey };
    });
  };

  function onCheckedNotification(data: any) {
    setCheckedNotification(data);
  }

  const getNodeSettingOrDownload = () => {
    return (
      <div
        className={`setting-content-wrapper ${checkedNotification?.length > 0 ? 'active' : ''}`}
        onClick={() => {
          return checkedNotification?.length > 0 ? onClickSetting() : null;
        }}
      >
        <img
          className={`${checkedNotification?.length > 0 && !objDataPreview?.notification ? 'fadeIn zoom-out' : ''}`}
          src={iconSetting}
          alt="icon"
        />
        <div className={'label'}>通知テンプレート</div>
      </div>
    );
  };

  function preOnSubmit() {
    onSubmit({
      notification: checkedNotification?.length > 0,
    });
  }

  return (
    <div className={'preview-csv-valid-root'}>
      <ModalCustom
        destroyOnClose={true}
        classNameExtendElementRight="setting-preview-is-valid"
        extendElementRight={getNodeSettingOrDownload()}
        className={'modal-preview-csv-valid-root'}
        iconLeftPath={IconUserAddingPath}
        onCancel={onClose}
        title={'ユーザー登録（一括登録確認）'}
        isShow={objDataPreview?.showModal}
        okText={`登録`}
        cancelText={'キャンセル'}
        onSubmit={preOnSubmit}
        isDisable={checkedNotification?.length > 0 && !objDataPreview?.notification}
      >
        <div className={'modal-preview-csv-valid-children'}>
          <div className={'modal-preview-csv-valid-detail'}>
            <div className="form">
              <Input
                disable={true}
                required={true}
                label={'グループ '}
                className="text-item"
                value={objDataPreview?.data?.groupName}
              />
              <div className="table-result-wrapper">
                <div className="title">登録ユーザー一覧</div>
                <Table
                  isHiddenRowSelection={true}
                  data={listDataView}
                  listKeyName={{
                    names: ['No', 'ID', 'ユーザー名', 'メールアドレス'],
                    keys: [
                      { keyName: 'no', sorter: false },
                      { keyName: 'user_id', sorter: true },
                      { keyName: 'user_name', sorter: true },
                      { keyName: 'email', sorter: true },
                    ],
                  }}
                  handleClickSorter={handleClickSorter}
                  scroll={{ x: 'fit-content', y: HEIGHT_TABLE }}
                />
              </div>
              <Checkbox
                onChange={onCheckedNotification}
                items={[{ value: 'checked', label: '登録後、ユーザーに通知を行う' }]}
                value={checkedNotification}
              />
            </div>
          </div>
        </div>
      </ModalCustom>
    </div>
  );
};

export default PreviewCSVIsValid;
