import { Navigate } from 'react-router-dom';
import { NAVIGATION_PATH } from 'src/app/constant';
import { TokenService } from 'src/ultils/tokenService';

export function LandingRoute({ children }: any) {
  const isLoggin = TokenService.getToken();
  if (!isLoggin) {
    return <Navigate to={NAVIGATION_PATH.LOGIN} replace={true} />;
  }
  return <>{children}</>;
}
