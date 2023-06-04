import './ModalCustom.scss';
import { Button, Modal } from 'src/component/common/index';
import { ReactNode } from 'react';

export interface ModalCustomPropsT {
  onSubmit?: () => void;
  onCancel?: (e?: any) => void;
  iconLeftPath?: string;
  title: string;
  isShow: boolean;
  children: ReactNode;
  extendElementRight?: ReactNode;
  okText?: string;
  cancelText?: string;
  isDisable?: boolean;
  classNameExtendElementRight?: string;
  className?: string;
  destroyOnClose?: boolean;
}

const ModalCustom = (props: ModalCustomPropsT) => {
  const {
    children = null,
    extendElementRight = null,
    isShow = false,
    onCancel = () => null,
    onSubmit = () => null,
    iconLeftPath = null,
    title = '',
    okText = '',
    cancelText = '',
    isDisable = false,
    destroyOnClose = true,
    classNameExtendElementRight = '',
    className = '',
  } = props;
  return (
    <Modal
      destroyOnClose={destroyOnClose}
      onCancelClick={onCancel}
      isModalVisible={isShow}
      className={`modal-custom-root ${className}`}
      footer={null}
      closable={true}
    >
      <div className={'modal-custom-content'}>
        <div className="modal-custom-content-header">
          {iconLeftPath && (
            <div className="modal-custom-content-header-icon">
              <img src={iconLeftPath} alt="icon" />
            </div>
          )}
          {title && <div className="modal-custom-content-header-title">{title}</div>}
        </div>
        <div className={'modal-custom-content-children'}>{children}</div>
        <div className={'modal-custom-content-action-footer'}>
          {extendElementRight && <div className={classNameExtendElementRight}>{extendElementRight}</div>}
          <div className="modal-custom-content-action-footer-submit">
            {cancelText && <Button name={cancelText} onClick={onCancel} className="cancel-btn" />}
            {okText && <Button isDisable={isDisable} name={okText} onClick={onSubmit} className="ok-btn" />}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalCustom;
