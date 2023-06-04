import 'src/component/layout/NoticeManagement/CreateAndEditNoti/AdminCreateAndEditNoti.scss';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { DatePickers, Input, Table } from 'src/component/common';
import React, { useEffect, useState } from 'react';
import { ObjectCreateOrEdit } from 'src/component/layout/ContractManagement/Companies/AdminManageCompanies';
import ModalCustom from 'src/component/common/Modal/ModalCustom/ModalCustom';
import IconNotificationTitle from 'src/assets/svg/icon-noti-modal-title.svg';
import {
  defaultValues,
  notificationDetailSchema,
} from 'src/component/layout/NoticeManagement/CreateAndEditNoti/NotiDetailSchema';
import moment from 'moment';
import TextEditor from 'src/component/common/TextEditor/TextEditor';
import { TIMESTAMP_REQUIRE } from 'src/app/constant';
import { getIdsSelectedByKeyFromTable } from 'src/ultils/common';

type IISCreateAndEditCompanyProps = {
  objCreateOrEdit: ObjectCreateOrEdit;
  onCloseModal: () => void;
  onCreateOrEditClick: (company: any) => void;
  dataCompanyIds: any[];
};
type DataTableCompany = {
  name: string;
  id: string;
};
const AdminCreateAndEditNoti = (props: IISCreateAndEditCompanyProps) => {
  const startDateDefault = moment(new Date()).toString();
  const endDateDefault = moment(new Date()).add(TIMESTAMP_REQUIRE.END_AFTER_START_DEFAULT, 'M').toString();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const {
    objCreateOrEdit = { isEdit: false, showModal: false },
    onCloseModal = () => null,
    onCreateOrEditClick = () => null,
    dataCompanyIds = [],
  } = props;
  const {
    formState: { errors, isDirty, isValid },
    control,
    getValues,
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(notificationDetailSchema()),
    mode: 'all',
    defaultValues: defaultValues,
  });
  useEffect(() => {
    if (!objCreateOrEdit.isEdit) {
      setSelectedRowKeys([]);
      reset(defaultValues);
    } else {
      if (objCreateOrEdit?.itemSelected) {
        reset({
          title: objCreateOrEdit.itemSelected?.title,
          content: objCreateOrEdit.itemSelected?.content,
          periodDate: objCreateOrEdit.itemSelected?.periodDate,
          companyIds: objCreateOrEdit.itemSelected?.companyIds,
        });
        const companyIdsCurrent: number[] = [];
        dataCompanyIds.forEach((item: DataTableCompany, index: number) => {
          if (objCreateOrEdit.itemSelected?.companyIds.includes(item.id)) {
            companyIdsCurrent.push(index + 1);
          }
        });
        setSelectedRowKeys(companyIdsCurrent);
      }
    }
  }, [objCreateOrEdit.showModal]);

  function onSubmit() {
    onCreateOrEditClick(getValues());
  }

  function onCancel() {
    onCloseModal();
  }

  function handleSelectRowKeys(key: React.Key[], listData?: any[]) {
    setSelectedRowKeys(key);
    const idsSelected: string[] = getIdsSelectedByKeyFromTable(key, listData);
    setValue('companyIds', idsSelected, { shouldValidate: true, shouldDirty: true });
  }

  return (
    <div className={'admin-create-edit-notification-root'}>
      <ModalCustom
        className={'modal-admin-create-edit-notification'}
        classNameExtendElementRight="setting-template-create-edit-company"
        iconLeftPath={IconNotificationTitle}
        onCancel={onCancel}
        title={`${objCreateOrEdit?.isEdit ? 'お知らせ（企業宛て）編集' : 'お知らせ（企業宛て）登録'}`}
        isShow={objCreateOrEdit.showModal}
        okText={`${objCreateOrEdit?.isEdit ? '編集' : '登録'}`}
        cancelText={'キャンセル'}
        onSubmit={onSubmit}
        isDisable={!(isDirty && isValid)}
      >
        <div className={'iis-add-new-and-edit-notification-root'}>
          <div className={'iis-notification-detail-module-root'}>
            <div className="form">
              <Controller
                control={control}
                name="title"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    required={true}
                    placeholder={'管理者グループ'}
                    label={'件名'}
                    className="text-item"
                    textWarning={errors?.title?.message ? errors?.title?.message + '' : ''}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                  />
                )}
              />

              <Controller
                control={control}
                name="content"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextEditor
                    onBlur={onBlur}
                    textWarning={errors?.content?.message ? errors?.content?.message + '' : ''}
                    value={value}
                    onChange={onChange}
                    required={true}
                    label={'本文'}
                  />
                )}
              />
              <Controller
                control={control}
                name="periodDate"
                render={({ field: { onChange, value } }) => (
                  <div className="control-range-date">
                    {/*<div className="label">参照期間</div>*/}
                    <div className="range-date-wrapper">
                      <DatePickers
                        value={value}
                        defaultValue={{
                          startDate: startDateDefault,
                          endDate: endDateDefault,
                        }}
                        label={['開始日', '終了日']}
                        onChange={onChange}
                      />
                    </div>
                  </div>
                )}
              />

              <Controller
                control={control}
                name="companyIds"
                render={() => (
                  <div className="control-checkbox-list">
                    <Table
                      data={dataCompanyIds}
                      listKeyName={{
                        names: ['公開（契約企業）'],
                        keys: [
                          { keyName: 'name', sorter: false },
                          { keyName: 'id', sorter: false },
                        ],
                      }}
                      scroll={{ x: 'fit-content', y: 158 }}
                      onSelectChange={handleSelectRowKeys}
                      selectedRowKeys={selectedRowKeys}
                    />
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      </ModalCustom>
    </div>
  );
};

export default AdminCreateAndEditNoti;
