// const DocumentUser = lazy(() => import('src/component/layout/DocumentUser/DocumentUser'));
// const DesignChange = lazy(() => import('src/component/layout/DesignChange/DesignChange'));
// const Help = lazy(() => import('src/component/layout/Help/Help'));
// const TermsOfService = lazy(() => import('src/component/layout/TermsOfService/TermsOfService'));
// const PrivatePolicy = lazy(() => import('src/component/layout/PrivatePolicy/PrivatePolicy'));
// const Enviroment = lazy(() => import('src/component/layout/Enviroment/Enviroment'));
export interface routerListT {
  path: string;
  component: any;
  type?: string;
}

const routerCustomer: routerListT[] = [
  // {
  //   path: NAVIGATION_PATH.DOCUMENT_USER,
  //   component: <DocumentUser />,
  //   type: ROUTER_TYPE.PRIVATE,
  // },
];
export default routerCustomer;
