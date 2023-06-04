import { Modal as ModalBase } from 'antd';
import './Modal.scss';
import { ReactNode } from 'react';

export interface ModalPropsT {
  isModalVisible: boolean;
  children?: any;
  title?: any;
  cancelText?: string;
  okText?: string;
  onOkClick?: (event?: any) => void;
  onCancelClick?: (event?: any) => void;
  width?: number;
  className?: string;
  isCustomContent?: boolean | undefined;
  icon?: any;
  titleContent?: string;
  content?: string[];
  closable?: boolean;
  maskClosable?: boolean;
  message?: string;
  okButtonProps?: any;
  zIndex?: number;
  destroyOnClose?: boolean;
  footer?: ReactNode;
  isDisable?: boolean;
}

export default function Modal(props: ModalPropsT) {
  const {
    isModalVisible,
    onOkClick,
    onCancelClick,
    title,
    children,
    cancelText,
    okText,
    width,
    className = '',
    closable = false,
    maskClosable = false,
    message,
    okButtonProps,
    zIndex = 1000,
    destroyOnClose = false,
    footer,
  } = props;

  return (
    <ModalBase
      destroyOnClose={destroyOnClose}
      cancelButtonProps={{ style: { display: cancelText ? 'inline-block' : 'none' } }}
      maskClosable={maskClosable}
      cancelText={cancelText}
      okText={okText}
      centered
      title={title}
      open={isModalVisible}
      onOk={onOkClick}
      onCancel={onCancelClick}
      width={width}
      className={`${className ? className : 'modal-root'}`}
      closable={closable}
      okButtonProps={okButtonProps}
      zIndex={zIndex}
      footer={footer}
      // closeIcon={closeIcon}
    >
      {message ? message : null}
      {children ? children : null}
    </ModalBase>
  );
}
