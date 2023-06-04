import request, { headerOptions, post } from 'src/ultils/request';
import { API_PATH } from 'src/app/constant';
import { refreshTokenExpried } from 'src/ultils/common';
import { TokenService } from 'src/ultils/tokenService';

export const checkRefreshToken = async (data: any) => {
  let response: any = undefined;
  const refresh = TokenService.getRefreshToken();
  const tokenExpried: boolean = TokenService.getTokenExpried();
  if (!!refresh && !tokenExpried) {
    await post(API_PATH.REFRESH_TOKEN, { refresh_token: refresh })
      .then(async res => {
        if (res && res?.data?.access_token) {
          TokenService.setTokenExpried('true');
          TokenService.setToken(res.data.access_token);
          await request(data.url, { ...data.options, headers: headerOptions() }).then((resq: any) => {
            response = resq;
          });
        } else {
          refreshTokenExpried();
        }
      })
      .catch(() => {
        refreshTokenExpried();
      });
  } else {
    refreshTokenExpried();
  }
  return response;
};
