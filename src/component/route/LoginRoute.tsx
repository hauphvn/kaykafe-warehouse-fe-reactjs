import { Navigate } from 'react-router-dom';
import { NAVIGATION_PATH, ROLE_USER } from 'src/app/constant';
import { TokenService } from 'src/ultils/tokenService';

export function LoginRoute({ children }: any) {
  let href = NAVIGATION_PATH.DOCUMENT;
  const isLoggin = TokenService.getToken();
  const isAdmin = TokenService.getRoleToken() === ROLE_USER.ADMIN;
  const isCompany = TokenService.getRoleToken() === ROLE_USER.COMPANY;
  const isUser = TokenService.getRoleToken() === ROLE_USER.CUSTOMER;
  if (isAdmin) {
    href = NAVIGATION_PATH.CONTRACT_MANAGEMENT;
  } else if (isCompany) {
    href = NAVIGATION_PATH.COMPANY_NOTICE;
  } else if (isUser) {
    href = NAVIGATION_PATH.DOCUMENT_USER;
  } else {
    href = NAVIGATION_PATH.DOCUMENT;
  }
  if (isLoggin) {
    return <Navigate to={href} replace={true} />;
  } else {
    <Navigate to={NAVIGATION_PATH.LOGIN} />;
  }

  return <>{children}</>;
}
