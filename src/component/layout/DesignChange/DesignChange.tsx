import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Input, Button, Checkbox, ModalDelete } from 'src/component/common';
import MainWrapper from 'src/component/layout/MainWrapper/MainWrapper';
import { defaultValues, designChangeSchema } from './DesignChangeSchema';
import './DesignChange.scss';
import { useEffect, useState } from 'react';
import { get, put } from 'src/ultils/request';
import { API_PATH } from 'src/app/constant';
import { onSetShowLoading, onSetToastStatus } from 'src/redux/auth/authSlice';
import { useAppDispatch } from 'src/app/hooks';
import { buildParams, handleErrorFromResponse } from 'src/ultils/common';
import { TOAST_MESSAGE } from 'src/app/validation_msg';
import liff from '@line/liff';
import CONFIG from 'src/config/enviroment';
import iconQrCode from 'src/assets/imgs/qr_code.png';

enum STATUS_NOTIFICATION {
  NOT_YET,
  VERIFYING,
  OK,
  NG,
}

const CONTACT_METHOD_TYPE = {
  EMAIL: 1,
  SMS: 2,
  LINE: 3,
};

function DesignChange() {
  const {
    formState: { errors, isDirty, isValid },
    control,
    reset,
    getValues,
    setValue,
    trigger,
  } = useForm({
    resolver: yupResolver(designChangeSchema()),
    mode: 'all',
    defaultValues: defaultValues,
  });
  const dispatch = useAppDispatch();
  const [emailStatus, setEmailStatus] = useState(3);
  const [smsStatus, setSmsStatus] = useState(3);
  const [lineStatus, setLineStatus] = useState(3);
  const [isLineLogin, setIsLineLogin] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    getUserInfo();
    async function loadLine() {
      await loadLiff();
    }
    loadLine();
  }, []);

  const loadLiff = async () => {
    liff.init(
      { liffId: CONFIG.VITE_LINE_ID },
      () => {
        if (liff.isLoggedIn()) {
          setIsLineLogin(true);
          liff
            .getProfile()
            .then((profile: any) => {
              setUserId(profile?.userId);
              setValue('line', profile?.displayName || '');
              trigger('line');
            })
            .catch(err =>
              dispatch(
                onSetToastStatus({
                  message: handleErrorFromResponse(err, TOAST_MESSAGE.USER.SETTING.LINE.GET_PROFILE_FAIL),
                  showToast: true,
                  status: 'error',
                }),
              ),
            );
        } else {
          setIsLineLogin(false);
        }
      },
      err =>
        dispatch(
          onSetToastStatus({
            message: handleErrorFromResponse(err, TOAST_MESSAGE.USER.SETTING.LINE.INIT_FAIL),
            showToast: true,
            status: 'error',
          }),
        ),
    );
  };

  const getUserInfo = () => {
    dispatch(onSetShowLoading('loading'));
    get(API_PATH.USER_SETTING)
      .then((res: any) => {
        if (res?.data) {
          const data = res?.data;
          let dataReset: any = {
            username: data?.name,
            email: data?.email,
            email1: data?.contact_method?.email?.address,
            sms: data?.contact_method?.sms?.address,
            notiEmail: data?.contact_method?.email?.is_notification,
            notiSms: data?.contact_method?.sms?.is_notification,
            notiNg: data?.contact_method?.line?.is_notification,
          };

          if (data?.contact_method?.line?.address) {
            dataReset = { ...dataReset, line: data?.contact_method?.line?.address };
          }
          setEmailStatus(data?.contact_method?.email?.status || 3);
          setSmsStatus(data?.contact_method?.sms?.status || 3);
          setLineStatus(data?.contact_method?.line?.status || 3);
          reset(dataReset);
        }
      })
      .catch(err => {
        dispatch(
          onSetToastStatus({
            message: handleErrorFromResponse(err, TOAST_MESSAGE.USER.SETTING.GET_INFO.FAIL),
            showToast: true,
            status: 'error',
          }),
        );
      })
      .finally(() => {
        dispatch(onSetShowLoading('idle'));
      });
  };

  const loginLiff = async () => {
    liff.init(
      { liffId: CONFIG.VITE_LINE_ID },
      () => {
        if (!liff.isLoggedIn()) {
          liff.login();
        }
      },
      err => console.error(err) /*eslint no-console: 0*/,
    );
  };

  const onClickBtnSetting = async (type: number, value: string | null) => {
    if (!isLineLogin && type === CONTACT_METHOD_TYPE.LINE) {
      await loginLiff();
    } else {
      const newQueryParam = '?' + buildParams({ type, address: value });
      dispatch(onSetShowLoading('loading'));
      get(API_PATH.USER_CHECK_CONTACT + newQueryParam)
        .then(res => {
          if (res?.data) {
            if (res?.data?.status) {
              const status = res?.data?.status;
              if (type === CONTACT_METHOD_TYPE.EMAIL) {
                setEmailStatus(status);
              } else if (type === CONTACT_METHOD_TYPE.SMS) {
                setSmsStatus(status);
              } else if (type === CONTACT_METHOD_TYPE.LINE) {
                setLineStatus(status);
              }
            }
          }
        })
        .catch(err => {
          dispatch(
            onSetToastStatus({
              message: handleErrorFromResponse(err, TOAST_MESSAGE.USER.SETTING.CHECK_CONTACT.FAIL),
              showToast: true,
              status: 'error',
            }),
          );
        })
        .finally(() => {
          dispatch(onSetShowLoading('idle'));
        });
    }
  };

  const onOk = () => {
    dispatch(onSetShowLoading('loading'));
    const value = getValues();
    const data = {
      name: value?.username,
      email: value?.email,
      contact_method: {
        email: {
          address: value?.email1,
          status: emailStatus,
          is_notification: value?.notiEmail ? true : false,
        },
        sms: {
          address: value?.sms,
          status: smsStatus,
          is_notification: value?.notiSms ? true : false,
        },
        line: {
          address: value?.line,
          status: lineStatus,
          is_notification: value?.notiNg ? true : false,
        },
      },
      user_id: userId,
    };
    put(API_PATH.USER_SETTING, data)
      .then(() => {
        dispatch(
          onSetToastStatus({
            message: TOAST_MESSAGE.USER.SETTING.PUT.SUCCESS,
            showToast: true,
            status: 'success',
          }),
        );
        getUserInfo();
      })
      .catch(err => {
        dispatch(
          onSetToastStatus({
            message: handleErrorFromResponse(err, TOAST_MESSAGE.USER.SETTING.PUT.FAIL),
            showToast: true,
            status: 'error',
          }),
        );
      })
      .finally(() => {
        dispatch(onSetShowLoading('idle'));
      });
  };
  const onReset = () => {
    getUserInfo();
  };

  const handleGetStatus = (status: number) => {
    if (status === STATUS_NOTIFICATION.OK) {
      return 'OK';
    } else if (status === STATUS_NOTIFICATION.NOT_YET) {
      return '未';
    } else if (status === STATUS_NOTIFICATION.VERIFYING) {
      return '...'; // TODO watiting design
    } else if (status === STATUS_NOTIFICATION.NG) {
      return 'NG';
    }
  };

  const handleGetClassStatus = (status: number) => {
    if (status === STATUS_NOTIFICATION.OK) {
      return 'success';
    } else if (status === STATUS_NOTIFICATION.NOT_YET) {
      return 'warning';
    } else if (status === STATUS_NOTIFICATION.VERIFYING) {
      return 'warning'; // TODO waiting design
    } else if (status === STATUS_NOTIFICATION.NG) {
      return 'ng';
    }
  };

  const lifflLogout = async () => {
    await liff.logout();
    setUserId('');
    setValue('line', '');
    loginLiff();
  };

  return (
    <MainWrapper title="設定変更">
      <div className="setting-root">
        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              required={true}
              placeholder={'ユーザー名を入力して下さい'}
              label={'ユーザー名'}
              className="text-item"
              textWarning={errors?.username?.message ? errors?.username?.message + '' : ''}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              required={true}
              placeholder={'メールアドレスを入力して下さい'}
              label={'メールアドレス'}
              className="text-item"
              textWarning={errors?.email?.message ? errors?.email?.message + '' : ''}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              disable={true}
            />
          )}
        />
        <div className="notification-setting">
          <div className="notification-text col1">通知設定</div>
          <div className="notification-text col2">通知確認</div>
          <div className="notification-text ">通知ON/OFF</div>
        </div>
        <div className="notification-list">
          <div className="notification-row">
            <div className="col1 notification-item">
              <Controller
                control={control}
                name="email1"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    required={true}
                    placeholder={'メールアドレスを入力して下さい'}
                    label={'メールアドレス'}
                    className="text-item"
                    textWarning={errors?.email1?.message ? errors?.email1?.message + '' : ''}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                  />
                )}
              />
              <Button
                onClick={() => onClickBtnSetting(CONTACT_METHOD_TYPE.EMAIL, getValues('email1'))}
                className={'btn-setting'}
                name={'通知確認'}
              />
            </div>
            <div className="col2">
              <div className={`notification-status ${handleGetClassStatus(emailStatus)}`}>
                {handleGetStatus(emailStatus)}
              </div>
            </div>
            <Controller
              control={control}
              name="notiEmail"
              render={({ field: { onChange, value } }) => (
                <Checkbox
                  onChange={(e: any) => onChange(e[0])}
                  items={[{ value: true, label: '' }]}
                  value={[value]}
                  disabled={+emailStatus === STATUS_NOTIFICATION.OK ? false : true}
                />
              )}
            />
          </div>
          <div className="notification-row">
            <div className="col1 notification-item">
              <Controller
                control={control}
                name="sms"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    required={true}
                    placeholder={'SMSを入力して下さい'}
                    label={'SMS'}
                    className="text-item"
                    textWarning={errors?.sms?.message ? errors?.sms?.message + '' : ''}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                  />
                )}
              />
              <Button
                onClick={() => onClickBtnSetting(CONTACT_METHOD_TYPE.SMS, getValues('sms'))}
                className={'btn-setting'}
                name={'通知確認'}
              />
            </div>
            <div className="col2">
              <div className={`notification-status ${handleGetClassStatus(smsStatus)}`}>
                {handleGetStatus(smsStatus)}
              </div>
            </div>
            <Controller
              control={control}
              name="notiSms"
              render={({ field: { onChange, value } }) => (
                <Checkbox
                  onChange={(e: any) => onChange(e[0])}
                  items={[{ value: true, label: '' }]}
                  value={[value]}
                  disabled={+smsStatus === STATUS_NOTIFICATION.OK ? false : true}
                />
              )}
            />
          </div>
          <div className="notification-row">
            <div className="col1 notification-item">
              <Controller
                control={control}
                name="line"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    required={true}
                    placeholder={'LINEにログインしてLINEIDを取得してください'}
                    label={'LINE ID'}
                    className="text-item"
                    textWarning={errors?.line?.message ? errors?.line?.message + '' : ''}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    disable={true}
                  />
                )}
              />
              <Button
                onClick={() => onClickBtnSetting(CONTACT_METHOD_TYPE.LINE, getValues('line'))}
                className={'btn-setting'}
                name={!isLineLogin ? 'LINE・ログイン' : '通知確認'}
              />
            </div>
            <div className="col2">
              <div className={`notification-status ${handleGetClassStatus(lineStatus)}`}>
                {handleGetStatus(lineStatus)}
              </div>
            </div>
            <Controller
              control={control}
              name="notiNg"
              render={({ field: { onChange, value } }) => (
                <Checkbox
                  onChange={(e: any) => onChange(e[0])}
                  items={[{ value: true, label: '' }]}
                  value={[value]}
                  disabled={+lineStatus === STATUS_NOTIFICATION.OK ? false : true}
                />
              )}
            />
          </div>
        </div>

        <div className={`line-info ${isLineLogin ? '' : 'line-hide'}`}>
          ※LINE通知確認をする前に<span onClick={() => setIsShowModal(true)}>LINEチャネルに参加して下さい。</span>
          また、LINEアカウントを変更する場合は
          <span onClick={lifflLogout}>ここ</span>をクリックして下さい。
        </div>

        <div className="footer">
          <Button onClick={onReset} className={'btn-reset'} name={'キャンセル'} />
          <Button onClick={onOk} className={'btn-ok'} name={'登録'} isDisable={!(isDirty && isValid)} />
        </div>
      </div>
      <ModalDelete
        className={'modal-line-info'}
        title={'LINEチャネル参加'}
        okText="はい"
        onCancelClick={() => setIsShowModal(false)}
        onOkClick={() => setIsShowModal(false)}
        isModalVisible={isShowModal}
      >
        <div>LINE通知確認をする前にLINEチャネルに参加して下さい。?</div>
        <img src={iconQrCode} alt="icon" />
      </ModalDelete>
    </MainWrapper>
  );
}

export default DesignChange;
