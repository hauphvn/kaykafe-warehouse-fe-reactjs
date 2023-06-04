import 'src/component/layout/UserManagement/TemplateNotification/TemplateNotification.scss';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { Input } from 'src/component/common';
import ModalCustom from 'src/component/common/Modal/ModalCustom/ModalCustom';
import {
  templateNotificationSchema,
  defaultValues,
} from 'src/component/layout/UserManagement/TemplateNotification/TemplateNotificationSchema';
import { IObjTemplateNotification } from 'src/component/layout/UserManagement/UserManagement';
import iconTemplate from 'src/assets/svg/icon-template.svg';
import TextEditor from 'src/component/common/TextEditor/TextEditor';
import { useEffect } from 'react';

type TemplateNotificationProps = {
  objCreateOrEdit: IObjTemplateNotification;
  onCloseModal: () => void;
  onCreateOrEditClick: (company: any) => void;
  isSubmitted?: boolean;
};
const TemplateNotification = (props: TemplateNotificationProps) => {
  const {
    objCreateOrEdit = { isEdit: false, showModal: false },
    onCloseModal = () => null,
    onCreateOrEditClick = () => null,
    isSubmitted = false,
  } = props;
  const {
    formState: { errors, isDirty, isValid },
    control,
    getValues,
    reset,
    // setValue,
    // watch,
  } = useForm({
    resolver: yupResolver(templateNotificationSchema()),
    mode: 'all',
    defaultValues: defaultValues,
  });
  useEffect(() => {
    if (isSubmitted) {
      reset(defaultValues);
    }
  }, [isSubmitted]);
  function onSubmit() {
    onCreateOrEditClick(getValues());
  }

  function onCancel() {
    onCloseModal();
  }

  return (
    <div className={'template-notification-root'}>
      <ModalCustom
        destroyOnClose={isSubmitted}
        className={'modal-template-notification-root'}
        iconLeftPath={iconTemplate}
        onCancel={onCancel}
        title={'通知テンプレート'}
        isShow={objCreateOrEdit.showModal}
        okText={`${objCreateOrEdit?.isEdit ? '保存' : '登録'}`}
        cancelText={'キャンセル'}
        onSubmit={onSubmit}
        isDisable={!(isDirty && isValid)}
      >
        <div className={'children-modal-template-notification-root'}>
          <div className={'children-modal-template-notification-detail'}>
            <div className="form">
              <Controller
                control={control}
                name="type"
                render={({ field: { onChange, onBlur } }) => (
                  <Input
                    required={true}
                    label={'通知種別'}
                    className="text-item"
                    textWarning={errors?.type?.message ? errors?.type?.message + '' : ''}
                    onChange={onChange}
                    onBlur={onBlur}
                    disable={true}
                    value={'アクティベーション'}
                  />
                )}
              />
              <Controller
                control={control}
                name="title"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    required={true}
                    label={'メールタイトル'}
                    className="text-item"
                    textWarning={errors?.title?.message ? errors?.title?.message + '' : ''}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    placeholder={'メールタイトルを入力して下さい'}
                  />
                )}
              />
              <Controller
                control={control}
                name="content"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextEditor
                    subLabel={'※先頭行には自動的に「グループ名」＋「ユーザー名」様が入ります。'}
                    onBlur={onBlur}
                    textWarning={errors?.content?.message ? errors?.content?.message + '' : ''}
                    value={value}
                    onChange={onChange}
                    required={true}
                    label={'メール本文'}
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

export default TemplateNotification;
