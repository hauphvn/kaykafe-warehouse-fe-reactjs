import './TemplateNotificationDocument.scss';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { Input } from 'src/component/common';
import ModalCustom from 'src/component/common/Modal/ModalCustom/ModalCustom';
import iconTemplate from 'src/assets/svg/icon-template.svg';
import TextEditor from 'src/component/common/TextEditor/TextEditor';
import { useEffect } from 'react';
import { IObjTemplateNotificationDocument } from 'src/component/layout/Document/New/DocumentNew';
import { OPTIONS_DOCUMENT_TYPE } from 'src/app/constant';
import {
  templateNotificationDocumentSchema,
  defaultValues,
} from 'src/component/layout/Document/TemplateNotificationDocument/TemplateNotificationDocumentSchema';

export interface INotificationPopup {
  title: string;
  content: string;
  line?: string;
  sms: string;
}

type TemplateNotificationProps = {
  objCreateOrEdit: IObjTemplateNotificationDocument;
  onCloseModal: () => void;
  onCreateOrEditClick: (notification: INotificationPopup) => void;
  isSubmitted?: boolean;
};
const TemplateNotificationDocument = (props: TemplateNotificationProps) => {
  const {
    objCreateOrEdit = {
      isEdit: false,
      showModal: false,
      data: {
        typeDocument: '',
        title: '',
        content: '',
        sms: '',
        line: '',
      },
    },
    onCloseModal = () => null,
    onCreateOrEditClick = () => null,
    isSubmitted = false,
  } = props;
  const {
    formState: { errors, isDirty, isValid },
    control,
    getValues,
    reset,
  } = useForm({
    resolver: yupResolver(templateNotificationDocumentSchema()),
    mode: 'all',
    defaultValues: defaultValues,
  });
  useEffect(() => {
    const type = OPTIONS_DOCUMENT_TYPE.find((item: any) => item.value === objCreateOrEdit?.data?.typeDocument);
    reset({
      ...objCreateOrEdit.data,
      type: type?.text || '',
    });
  }, [objCreateOrEdit.showModal]);
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
    <div className={'template-document-notification-root'}>
      <ModalCustom
        destroyOnClose={isSubmitted}
        className={'modal-template-document-notification-root'}
        iconLeftPath={iconTemplate}
        onCancel={onCancel}
        title={'通知テンプレート'}
        isShow={objCreateOrEdit.showModal}
        okText={`${objCreateOrEdit?.isEdit ? '保存' : '登録'}`}
        cancelText={'キャンセル'}
        onSubmit={onSubmit}
        isDisable={!(isDirty && isValid)}
      >
        <div className={'children-modal-template-document-notification-root'}>
          <div className={'children-modal-template-document-notification-detail'}>
            <div className="form">
              <Controller
                control={control}
                name="type"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    required={true}
                    label={'通知種別'}
                    className="text-item"
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    disable={true}
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
              <div className={'options-others-wrapper'}>
                <Controller
                  control={control}
                  name="sms"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input className="text-item" onBlur={onBlur} value={value} onChange={onChange} label={'SMS'} />
                  )}
                />

                <Controller
                  control={control}
                  name="line"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input className="text-item" onBlur={onBlur} value={value} onChange={onChange} label={'LINE'} />
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </ModalCustom>
    </div>
  );
};

export default TemplateNotificationDocument;
