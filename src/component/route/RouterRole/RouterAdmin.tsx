import { lazy } from 'react';
import { NAVIGATION_PATH, ROUTER_TYPE } from 'src/app/constant';
const ContractManagement = lazy(() => import('src/component/layout/ContractManagement/ContractManagement'));
const NoticeManagement = lazy(() => import('src/component/layout/NoticeManagement/NoticeManagement'));
const OperationManagement = lazy(() => import('src/component/layout/OperationManagement/OperationManagement'));
const OperationHistory = lazy(() => import('src/component/layout/OperationHistory/OperationHistory'));
const AdminManagement = lazy(() => import('src/component/layout/AdminManagement/AdminManagement'));

export interface routerListT {
  path: string;
  component: any;
  type?: string;
}

const routerAdmin: routerListT[] = [
  {
    path: NAVIGATION_PATH.CONTRACT_MANAGEMENT,
    component: <ContractManagement />,
    type: ROUTER_TYPE.PRIVATE,
  },
  {
    path: NAVIGATION_PATH.NOTICE_MANAGEMENT,
    component: <NoticeManagement />,
    type: ROUTER_TYPE.PRIVATE,
  },
  {
    path: NAVIGATION_PATH.OPERATION_MANAGEMENT,
    component: <OperationManagement />,
    type: ROUTER_TYPE.PRIVATE,
  },
  {
    path: NAVIGATION_PATH.ADMIN_MANAGEMENT,
    component: <AdminManagement />,
    type: ROUTER_TYPE.PRIVATE,
  },
  {
    path: NAVIGATION_PATH.OPERATION_HISTORY,
    component: <OperationHistory />,
    type: ROUTER_TYPE.PRIVATE,
  },
];

export default routerAdmin;
