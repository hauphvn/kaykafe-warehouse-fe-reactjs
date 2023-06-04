import './CreateAndEditCompanyNotification.scss';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { DatePickers, Input, Table } from 'src/component/common';
import React, { useEffect, useState } from 'react';
import { ObjectCreateOrEdit } from 'src/component/layout/ContractManagement/Companies/AdminManageCompanies';
import ModalCustom from 'src/component/common/Modal/ModalCustom/ModalCustom';
import IconNotificationTitle from 'src/assets/svg/icon-noti-modal-title.svg';
import moment from 'moment';
import TextEditor from 'src/component/common/TextEditor/TextEditor';
import { TIMESTAMP_REQUIRE } from 'src/app/constant';
import {
  companyNotificationDetailSchema,
  defaultValues,
} from 'src/component/layout/NotificationManagement/CreateAndEditCompanyNotification/NotiDetailSchema';
import { getIdsSelectedByKeyFromTable } from 'src/ultils/common';

type DataTableGroup = {
  name: string;
  id: string;
};
type CreateAndEditCompanyNotificationProps = {
  objCreateOrEdit: ObjectCreateOrEdit;
  onCloseModal: () => void;
  onCreateOrEditClick: (company: any) => void;
  dataGroupIds: DataTableGroup[];
};
const CreateAndEditCompanyNotification = (props: CreateAndEditCompanyNotificationProps) => {
  const startDateDefault = moment(new Date()).toString();
  const endDateDefault = moment(new Date()).add(TIMESTAMP_REQUIRE.END_AFTER_START_DEFAULT, 'M').toString();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const {
    objCreateOrEdit = { isEdit: false, showModal: false },
    onCloseModal = () => null,
    onCreateOrEditClick = () => null,
    dataGroupIds = [],
  } = props;
  const {
    formState: { errors, isDirty, isValid },
    control,
    getValues,
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(companyNotificationDetailSchema()),
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
          groupIds: objCreateOrEdit.itemSelected?.groupIds,
        });
        const groupIdsCurrent: number[] = [];

        dataGroupIds.forEach((item: DataTableGroup, index: number) => {
          if (objCreateOrEdit.itemSelected?.groupIds.includes(item.id)) {
            groupIdsCurrent.push(index + 1);
          }
        });
        setSelectedRowKeys(groupIdsCurrent);
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
    setValue('groupIds', idsSelected, { shouldValidate: true, shouldDirty: true });
  }

  return (
    <div className={'company-create-edit-notification-root'}>
      <ModalCustom
        className={'modal-company-create-edit-notification'}
        classNameExtendElementRight="setting-template-create-edit-company"
        iconLeftPath={IconNotificationTitle}
        onCancel={onCancel}
        title={'お知らせ登録'}
        isShow={objCreateOrEdit.showModal}
        okText={`${objCreateOrEdit?.isEdit ? '保存' : '登録'}`}
        cancelText={'キャンセル'}
        onSubmit={onSubmit}
        isDisable={!(isDirty && isValid)}
      >
        <div className={'company-add-new-and-edit-notification-root '}>
          <div className={'company-notification-detail-module-root'}>
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
                        label={['公開日', '参照期限']}
                        onChange={onChange}
                      />
                    </div>
                  </div>
                )}
              />

              <Controller
                control={control}
                name="groupIds"
                render={() => (
                  <div className="control-checkbox-list">
                    <Table
                      data={dataGroupIds}
                      listKeyName={{
                        names: ['公開（グループ）'],
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

export default CreateAndEditCompanyNotification;
