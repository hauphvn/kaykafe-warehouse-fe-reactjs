import { ROLE_USER } from 'src/app/constant';
import { TokenService } from 'src/ultils/tokenService';
import { routerAdmin, routerPublic, routerCustomer, routerCompany } from 'src/component/route/RouterRole';

export const useHandleRoute = () => {
  const isAdmin = TokenService.getRoleToken() === ROLE_USER.ADMIN;
  const isCustomer = TokenService.getRoleToken() === ROLE_USER.CUSTOMER;
  const isCompany = TokenService.getRoleToken() === ROLE_USER.COMPANY;

  let result: any = [];
  if (isAdmin) {
    result = [...routerPublic, ...routerAdmin];
  } else if (isCustomer) {
    result = [...routerPublic, ...routerCustomer];
  } else if (isCompany) {
    result = [...routerPublic, ...routerCompany];
  } else {
    result = [...routerPublic];
  }
  return result;
};
