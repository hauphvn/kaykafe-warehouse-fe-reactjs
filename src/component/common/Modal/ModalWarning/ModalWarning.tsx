import { ModalPropsT } from 'src/component/common/Modal/Modal';
import './ModalWarning.scss';
import ModalCustom from 'src/component/common/Modal/ModalCustom/ModalCustom';
import iconWarning from 'src/assets/svg/icon-success.svg';

function ModalWarning(props: ModalPropsT) {
  const { isModalVisible, onOkClick, onCancelClick, title, children, className } = props;
  return (
    <ModalCustom
      okText={'確認'}
      cancelText={'キャンセル'}
      onCancel={onCancelClick}
      className={`modal-warning-root ${className}`}
      onSubmit={onOkClick}
      iconLeftPath={iconWarning}
      title={title}
      isShow={isModalVisible}
    >
      <div className={'model-warning-content'}>{children}</div>
    </ModalCustom>
  );
}

export default ModalWarning;
