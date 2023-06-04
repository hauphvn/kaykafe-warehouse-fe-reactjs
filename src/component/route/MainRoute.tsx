import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { LoginRoute } from 'src/component/route/LoginRoute';
import { PrivateRoute } from 'src/component/route/PrivateRoute';
import { ROUTER_TYPE } from 'src/app/constant';
import { LoadingPage } from 'src/component/common';
import { useHandleRoute } from 'src/component/route/RouterList';
import { routerListT } from 'src/component/route/RouterRole/RouterAdmin';

const MainRoute = () => {
  const RouterList = useHandleRoute();
  return (
    <Suspense fallback={<LoadingPage isShow={'loading'} />}>
      <Routes>
        {RouterList?.map((item: routerListT, index: number) => {
          if (item?.type === ROUTER_TYPE.PUBLIC) {
            return <Route key={index} path={item.path} element={<LoginRoute>{item.component}</LoginRoute>} />;
          } else if (item?.type === ROUTER_TYPE.PRIVATE) {
            return <Route key={index} path={item.path} element={<PrivateRoute>{item.component}</PrivateRoute>} />;
          } else {
            return <Route key={index} path={item.path} element={item.component} />;
          }
        })}
        <Route path="*" element={<PrivateRoute>Not found</PrivateRoute>} />
      </Routes>
    </Suspense>
  );
};

export default MainRoute;
