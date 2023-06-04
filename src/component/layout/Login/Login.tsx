import { Button, Input } from 'src/component/common';
import { Controller, useForm } from 'react-hook-form';
import { loginSchema } from './LoginSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import './Login.scss';
import { TokenService } from 'src/ultils/tokenService';
import { useNavigate } from 'react-router-dom';
import { API_PATH, NAVIGATION_PATH, ROLE_USER } from 'src/app/constant';
import { useAppDispatch } from 'src/app/hooks';
import { onSetAuthStatus, onSetShowLoading, onSetToastStatus } from 'src/redux/auth/authSlice';
import { decodeToken } from 'react-jwt';
import FormWrapper from 'src/component/layout/FormWrapper/FormWrapper';
import { post } from 'src/ultils/request';
import Logo from 'src/assets/svg/logo.svg';
import { TOAST_MESSAGE } from 'src/app/validation_msg';
import { handleErrorFromResponse } from 'src/ultils/common';

function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    formState: { errors, isValid, isDirty },
    control,
    getValues,
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'all',
    defaultValues: {
      email: '',
      password: '',
      companyId: '',
    },
  });

  const onLogin = () => {
    const { email, password, companyId } = getValues();
    const data = {
      email,
      password,
      company_id: companyId,
    };
    dispatch(onSetShowLoading('loading'));
    post(API_PATH.LOGIN, data)
      .then(res => {
        const response = res?.data;
        if (response) {
          const { access_token, refresh_token, is_frist, background_color, text_color } = response;
          if (is_frist) {
            window.location.replace(
              `${window.location.origin}${NAVIGATION_PATH.CHANGE_PASSWORD_FIRST}?token=${access_token}`,
            );
          } else {
            TokenService.setToken(access_token);
            TokenService.setRefreshToken(refresh_token);
            const infoColor = JSON.stringify({ background: background_color, textColor: text_color });
            TokenService.setInfoColor(infoColor);
            const myDecodedToken: any = decodeToken(access_token);
            TokenService.setRoleToken(myDecodedToken?.user_role?.toLowerCase());
            dispatch(onSetAuthStatus(true));
            if (myDecodedToken?.role === ROLE_USER.ADMIN) {
              navigate(NAVIGATION_PATH.CONTRACT_MANAGEMENT);
            } else if (myDecodedToken?.role === ROLE_USER.COMPANY) {
              navigate(NAVIGATION_PATH.COMPANY_NOTICE);
            } else {
              navigate(NAVIGATION_PATH.DOCUMENT_USER);
            }
          }
        } else {
          dispatch(
            onSetToastStatus({
              message: handleErrorFromResponse(null, TOAST_MESSAGE.LOGIN.FAIL),
              showToast: true,
              status: 'error',
            }),
          );
        }
      })
      .catch(err => {
        dispatch(
          onSetToastStatus({
            message: handleErrorFromResponse(err, TOAST_MESSAGE.LOGIN.FAIL),
            showToast: true,
            status: 'error',
          }),
        );
      })
      .finally(() => {
        dispatch(onSetShowLoading('idle'));
      });
  };

  const contentTitle = (
    <>
      <div>
        <img src={Logo} alt="logo" />
      </div>
      <div className="header-text">Web公開サービス</div>
    </>
  );

  return (
    <FormWrapper title={contentTitle} className="login-root">
      <>
        <Controller
          control={control}
          name="companyId"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              className="text-input"
              textWarning={errors?.companyId?.message ? errors?.companyId?.message + '' : ''}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              placeholder="契約企業IDを入力して下さい"
              label="契約企業ID"
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              className="text-input"
              textWarning={errors?.email?.message ? errors?.email?.message + '' : ''}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              required
              placeholder="メールアドレスを入力して下さい"
              label="メールアドレス"
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              className="text-item"
              textWarning={errors?.password?.message ? errors?.password?.message + '' : ''}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              placeholder="パスワードを入力して下さい"
              required
              isShowIconPassword={true}
              type={'password'}
              label="パスワード"
            />
          )}
        />

        <Button name="ログイン" isDisable={!(isValid && isDirty)} onClick={onLogin} />
        <div className="contact-info">*パスワードを忘れた場合は管理者にお問い合わせ下さい。</div>
      </>
      {/*<ModalWarning*/}
      {/*  className="modal-error-login modal-warning-root"*/}
      {/*  isModalVisible={isShowModalFail}*/}
      {/*  message="Login failed"*/}
      {/*  onOkClick={() => setIsShowModalFail(false)}*/}
      {/*/>*/}
    </FormWrapper>
  );
}

export default Login;
