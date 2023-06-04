import { lazy } from 'react';
import { LandingRoute } from 'src/component/route/LandingRoute';
import { NAVIGATION_PATH, ROUTER_TYPE } from 'src/app/constant';
import { routerListT } from './RouterAdmin';

const Login = lazy(() => import('src/component/layout/Login/Login'));
const ChangePasswordFirst = lazy(() => import('src/component/layout/ChangePasswordFirst/ChangePasswordFirst'));

const routerPublic: routerListT[] = [
  {
    path: '',
    component: <LandingRoute />,
    type: ROUTER_TYPE.PUBLIC,
  },
  {
    path: NAVIGATION_PATH.LOGIN,
    component: <Login />,
    type: ROUTER_TYPE.PUBLIC,
  },
  {
    path: NAVIGATION_PATH.CHANGE_PASSWORD_FIRST,
    component: <ChangePasswordFirst />,
    type: ROUTER_TYPE.PUBLIC,
  },
];

export default routerPublic;
