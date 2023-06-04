import { ModalPropsT } from 'src/component/common/Modal/Modal';
import './ModalDelete.scss';
import ModalCustom from 'src/component/common/Modal/ModalCustom/ModalCustom';
import iconWarning from 'src/assets/svg/icon-warning.svg';

function ModalDelete(props: ModalPropsT) {
  const { title = '', isModalVisible, onOkClick, onCancelClick, children, className, isDisable, okText } = props;
  return (
    <ModalCustom
      okText={okText ? okText : '確認'}
      cancelText={'キャンセル'}
      onCancel={onCancelClick}
      className={`modal-delete-root ${className}`}
      onSubmit={onOkClick}
      iconLeftPath={iconWarning}
      title={title ? title : '削除'}
      isShow={isModalVisible}
      isDisable={isDisable}
    >
      <div className={'model-delete-content'}>{children}</div>
    </ModalCustom>
  );
}

export default ModalDelete;
