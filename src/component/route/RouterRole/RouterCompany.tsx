// const Notice = lazy(() => import('src/component/layout/Notice/Notice'));

export interface routerListT {
  path: string;
  component: any;
  type?: string;
}

const routerCompany: routerListT[] = [
  // {
  //   // path: NAVIGATION_PATH.COMPANY_NOTICE,
  //   // component: <Notice />,
  //   // type: ROUTER_TYPE.PRIVATE,
  // },
];

export default routerCompany;
