import { Button, Input } from 'src/component/common';
import { useForm, Controller } from 'react-hook-form';
import { resolver, defaultValues } from './ChangePasswordSchema';
import './ChangePasswordFirst.scss';
import { API_PATH, NAVIGATION_PATH } from 'src/app/constant';
import { putChangePasswordFirst } from 'src/ultils/request';
import { TOAST_MESSAGE, TOAST_STATUS } from 'src/app/validation_msg';
import { useAppDispatch } from 'src/app/hooks';
import { onSetAuthStatus, onSetShowLoading, onSetToastStatus } from 'src/redux/auth/authSlice';
import { TokenService } from 'src/ultils/tokenService';
import { useNavigate, useLocation } from 'react-router-dom';

function ChangePasswordFirst() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = new URLSearchParams(useLocation().search).get('token') || '';
  if (!token) {
    navigate(NAVIGATION_PATH.LOGIN);
  }
  const {
    formState: { errors, isValid, isDirty },
    control,
    getValues,
  } = useForm({
    resolver,
    mode: 'all',
    defaultValues,
  });

  function handleChangePassword() {
    dispatch(onSetShowLoading('loading'));
    const data = getValues();
    const formValues = {
      old_password: data.oldPassword,
      new_password: data.password,
      confirm_password: data.confirmPassword,
    };
    putChangePasswordFirst(API_PATH.CHANGE_PASSWORD_FIRST, formValues, token)
      .then(response => {
        if (response?.status === 200) {
          dispatch(
            onSetToastStatus({
              message: TOAST_MESSAGE.UPDATE_SUCCESS,
              showToast: true,
              status: TOAST_STATUS.SUCCESS,
            }),
          );
          TokenService.clearLocalStorage();
          dispatch(onSetAuthStatus(false));
          navigate(NAVIGATION_PATH.LOGIN);
          window.location.reload();
        } else {
          dispatch(
            onSetToastStatus({
              message: TOAST_MESSAGE.UPDATE_FAIL,
              showToast: true,
              status: TOAST_STATUS.ERROR,
            }),
          );
        }
      })
      .finally(() => {
        dispatch(onSetShowLoading('idle'));
        dispatch(
          onSetToastStatus({
            message: TOAST_MESSAGE.UPDATE_FAIL,
            showToast: true,
            status: TOAST_STATUS.ERROR,
          }),
        );
      });
  }

  return (
    <div title="パスワード変更" className="change-password-root">
      <>
        <Controller
          control={control}
          name="oldPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              className="text-input"
              textWarning={errors?.oldPassword?.message ? errors?.oldPassword?.message + '' : ''}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              isShowIconPassword={true}
              placeholder="現在のパスワード"
              type={'password'}
              autoCompleteText="new-password"
              label="現在のパスワード"
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              className="text-input"
              textWarning={errors?.password?.message ? errors?.password?.message + '' : ''}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              isShowIconPassword={true}
              placeholder="新しいパスワード"
              type={'password'}
              autoCompleteText="new-password"
              label="新しいパスワード"
            />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              className="text-item"
              textWarning={errors?.confirmPassword?.message ? errors?.confirmPassword?.message + '' : ''}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              placeholder="新しいパスワード（確認）"
              isShowIconPassword={true}
              type={'password'}
              autoCompleteText="new-password"
              label="新しいパスワード（確認）"
            />
          )}
        />
        <Button name="パスワード更新を確定する" isDisable={!(isValid && isDirty)} onClick={handleChangePassword} />
      </>
    </div>
  );
}

export default ChangePasswordFirst;
