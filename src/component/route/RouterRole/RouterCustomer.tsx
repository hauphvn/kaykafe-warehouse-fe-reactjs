import { lazy } from 'react';
import { NAVIGATION_PATH, ROUTER_TYPE } from 'src/app/constant';
const DocumentUser = lazy(() => import('src/component/layout/DocumentUser/DocumentUser'));
const DesignChange = lazy(() => import('src/component/layout/DesignChange/DesignChange'));
const Help = lazy(() => import('src/component/layout/Help/Help'));
const TermsOfService = lazy(() => import('src/component/layout/TermsOfService/TermsOfService'));
const PrivatePolicy = lazy(() => import('src/component/layout/PrivatePolicy/PrivatePolicy'));
const Enviroment = lazy(() => import('src/component/layout/Enviroment/Enviroment'));
export interface routerListT {
  path: string;
  component: any;
  type?: string;
}

const routerCustomer: routerListT[] = [
  {
    path: NAVIGATION_PATH.DOCUMENT_USER,
    component: <DocumentUser />,
    type: ROUTER_TYPE.PRIVATE,
  },
  {
    path: NAVIGATION_PATH.DESIGN_CHANGE,
    component: <DesignChange />,
    type: ROUTER_TYPE.PRIVATE,
  },
  {
    path: NAVIGATION_PATH.HELP,
    component: <Help />,
    type: ROUTER_TYPE.PRIVATE,
  },
  {
    path: NAVIGATION_PATH.TERM_OF_SERVICE,
    component: <TermsOfService />,
    type: ROUTER_TYPE.PRIVATE,
  },
  {
    path: NAVIGATION_PATH.PRIVATE_POLICY,
    component: <PrivatePolicy />,
    type: ROUTER_TYPE.PRIVATE,
  },
  {
    path: NAVIGATION_PATH.ENVIROMENT,
    component: <Enviroment />,
    type: ROUTER_TYPE.PRIVATE,
  },
];
export default routerCustomer;
