import { IconSuccess } from 'src/assets/icons';
import Modal, { ModalPropsT } from 'src/component/common/Modal/Modal';
import './ModalSuccess.scss';

function ModalSuccess(props: ModalPropsT) {
  const {
    isModalVisible,
    onOkClick,
    title,
    children,
    okText,
    width,
    className = '',
    closable = false,
    maskClosable = false,
    message,
  } = props;
  return (
    <Modal
      okText={okText || '閉じる'}
      width={width || 550}
      title={title ? title : <IconSuccess />}
      isModalVisible={isModalVisible}
      message={message}
      className={`${className ? className : 'modal-success-root'}`}
      closable={closable}
      maskClosable={maskClosable}
      onOkClick={onOkClick}
    >
      {children}
    </Modal>
  );
}

export default ModalSuccess;
