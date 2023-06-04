import { Button, Input } from 'src/component/common';
import { Controller, useForm } from 'react-hook-form';
import { loginSchema } from './LoginSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import './Login.scss';
import { TokenService } from 'src/ultils/tokenService';
import { useNavigate } from 'react-router-dom';
import { API_PATH, NAVIGATION_PATH } from 'src/app/constant';
import { useAppDispatch } from 'src/app/hooks';
import { onSetAuthStatus, onSetShowLoading, onSetToastStatus } from 'src/redux/auth/authSlice';
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
    },
  });

  const onLogin = () => {
    const { email, password } = getValues();
    const data = {
      email,
      password,
    };
    dispatch(onSetShowLoading('loading'));
    post(API_PATH.LOGIN, data)
      .then(res => {
        const response = res?.data;
        if (response) {
          const { accessToken, refreshToken, email } = response;
          TokenService.setToken(accessToken);
          TokenService.setRefreshToken(refreshToken);
          // const myDecodedToken: any = decodeToken(access_token);
          // TokenService.setRoleToken(myDecodedToken?.user_role?.toLowerCase());
          dispatch(onSetAuthStatus(true));
          if (email === 'kaykafe.com@gmail.com') {
            navigate(NAVIGATION_PATH.CONTRACT_MANAGEMENT);
          } else {
            navigate(NAVIGATION_PATH.DOCUMENT_USER);
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
