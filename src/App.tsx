import './App.scss';
import MainRoute from 'src/component/route/MainRoute';
import { TokenService } from 'src/ultils/tokenService';
import PrivateTheme from 'src/component/layout/PrivateTheme/PrivateTheme';
import PublicTheme from 'src/component/layout/PublicTheme/PublicTheme';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { authSelector } from 'src/redux/auth/authSelector';
import { LoadingPage, Toast } from 'src/component/common';
import { onResetToast } from 'src/redux/auth/authSlice';
import { ROLE_USER } from 'src/app/constant';
import { useEffect, useState } from 'react';

function App() {
  const dispatch = useAppDispatch();
  const isCustomer = TokenService.getRoleToken() === ROLE_USER.CUSTOMER;
  const isCompany = TokenService.getRoleToken() === ROLE_USER.COMPANY;
  const colorFromStorage = TokenService.getInfoColor() || '';
  const colorInfo: any = colorFromStorage ? JSON.parse(colorFromStorage) : null;
  const background = colorInfo?.background;
  const textColor = colorInfo?.textColor;
  const auth = useAppSelector(authSelector);
  const { authStatus, toastOptions, isLoading } = auth;
  const [isLogin, setIslogin] = useState(TokenService.getToken());

  useEffect(() => {
    if (isCustomer || isCompany) {
      if (background) {
        document.documentElement.style.setProperty('--dynamic-color-primary', background);
      } else {
        document.documentElement.style.setProperty('--dynamic-color-primary', '#7F56D9');
      }
      if (textColor) {
        document.documentElement.style.setProperty('--dynamic-color-text', textColor);
      } else {
        document.documentElement.style.setProperty('--dynamic-color-text', '#ffffff');
      }
    } else {
      document.documentElement.style.setProperty('--dynamic-color-primary', '#1d3494');
      document.documentElement.style.setProperty('--dynamic-color-text', '#ffffff');
    }
  }, [background, textColor, isCustomer, isCompany]);
  useEffect(() => {
    if (isLogin !== TokenService.getToken()) {
      setIslogin(TokenService.getToken());
    }
  }, [TokenService.getToken()]);

  const Theme = isLogin || authStatus ? PrivateTheme : PublicTheme;
  return (
    <div className="App">
      <Theme>
        <MainRoute />
      </Theme>
      <Toast
        onClose={() => dispatch(onResetToast())}
        message={toastOptions.message}
        showToast={toastOptions.showToast}
        status={toastOptions.status}
      />
      <LoadingPage isShow={isLoading} />
    </div>
  );
}

export default App;
