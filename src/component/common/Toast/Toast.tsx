import './Toast.scss';
import { notification } from 'antd';
import { useEffect } from 'react';
import { TOAST_STATUS } from 'src/app/validation_msg';
import IconSuccess from 'src/assets/svg/icon-toast-success.svg';
import IconClose from 'src/assets/svg/icon-toast-close.svg';

interface SpinnerPropsT {
  className?: string;
  showToast: boolean;
  message: string;
  status?: string;
  description?: string;
  onClose?: () => void;
  duration?: number;
}

const Toast = (props: SpinnerPropsT) => {
  const {
    className = '',
    showToast = false,
    message = '',
    status = TOAST_STATUS.SUCCESS,
    description = '',
    duration = 2,
    onClose = () => null,
  } = props;
  useEffect(() => {
    if (showToast) {
      openCustomNotificationWithIcon(status, message, description);
    }
  }, [showToast]);
  const getNotificationStyle = (type: string) => {
    switch (type) {
      case TOAST_STATUS.SUCCESS: {
        return {
          boxShadow: '0px 2px 1px rgba(64, 72, 82, 0.05)',
          color: '#34A770',
          border: '0.5px solid #34A770',
          backgroundColor: '#FFFFFF',
          borderRadius: '0.8rem',
          width: 'fit-content',
          minHeight: '7.3rem',
        };
      }
      case TOAST_STATUS.ERROR: {
        return {
          boxShadow: '0px 2px 1px rgba(64, 72, 82, 0.05)',
          color: '#CC2B23',
          border: '0.5px solid #CC2B23',
          backgroundColor: '#FFFFFF',
          borderRadius: '0.8rem',
          width: 'fit-content',
          minHeight: '7.3rem',
        };
      }
    }
  };
  const onHandleClose = () => {
    onClose();
  };
  const openCustomNotificationWithIcon = (type: string, message: string, description: string) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore

    notification[type]({
      message: message,
      description: description,
      style: getNotificationStyle(type),
      duration: duration,
      onClose: onHandleClose,
      icon:
        type === TOAST_STATUS.SUCCESS ? (
          <img className="success-icon" src={IconSuccess} alt="icon success" />
        ) : (
          <img className="close-icon" src={IconClose} alt="icon close" />
        ),
      closeIcon: <></>,
    });
  };
  return <div className={`toast-root ${className}`}></div>;
};

export default Toast;
