import { lazy } from 'react';
import { NAVIGATION_PATH, ROUTER_TYPE } from 'src/app/constant';
const Notice = lazy(() => import('src/component/layout/Notice/Notice'));
const Document = lazy(() => import('src/component/layout/Document/Document'));
const DocumentNew = lazy(() => import('src/component/layout/Document/New/DocumentNew'));
const UserManagement = lazy(() => import('src/component/layout/UserManagement/UserManagement'));
const GroupManagement = lazy(() => import('src/component/layout/GroupManagement/GroupManagement'));
const CompanyAdminManagement = lazy(() => import('src/component/layout/CompanyAdminManagement/CompanyAdminManagement'));
const NotificationManagement = lazy(() => import('src/component/layout/NotificationManagement/NotificationManagement'));
const Help = lazy(() => import('src/component/layout/Help/Help'));

export interface routerListT {
  path: string;
  component: any;
  type?: string;
}

const routerCompany: routerListT[] = [
  {
    path: NAVIGATION_PATH.COMPANY_NOTICE,
    component: <Notice />,
    type: ROUTER_TYPE.PRIVATE,
  },
  {
    path: NAVIGATION_PATH.DOCUMENT,
    component: <Document />,
    type: ROUTER_TYPE.PRIVATE,
  },
  {
    path: NAVIGATION_PATH.NEW_DOCUMENT,
    component: <DocumentNew />,
    type: ROUTER_TYPE.PRIVATE,
  },
  {
    path: NAVIGATION_PATH.USER_MANAGEMENT,
    component: <UserManagement />,
    type: ROUTER_TYPE.PRIVATE,
  },
  {
    path: NAVIGATION_PATH.GROUP_MANAGEMENT,
    component: <GroupManagement />,
    type: ROUTER_TYPE.PRIVATE,
  },
  {
    path: NAVIGATION_PATH.ADMIN_MANAGEMENT,
    component: <CompanyAdminManagement />,
    type: ROUTER_TYPE.PRIVATE,
  },
  {
    path: NAVIGATION_PATH.NOTIFICATION_MANAGEMENT,
    component: <NotificationManagement />,
    type: ROUTER_TYPE.PRIVATE,
  },
  {
    path: NAVIGATION_PATH.HELP,
    component: <Help />,
    type: ROUTER_TYPE.PRIVATE,
  },
];

export default routerCompany;
