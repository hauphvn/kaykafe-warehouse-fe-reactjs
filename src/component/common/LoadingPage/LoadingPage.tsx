import './LoadingPage.scss';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

export interface LoadingPagePropsT {
  isShow: 'idle' | 'loading' | 'failed' | string;
}
export default function LoadingPage(props: LoadingPagePropsT) {
  const { isShow = 'idle' } = props;
  const antIcon = <LoadingOutlined style={{ fontSize: 100 }} spin />;
  return (
    <>
      {isShow === 'loading' && (
        <div className={'loading-page-root'}>
          <Spin className={'spin'} indicator={antIcon} />
        </div>
      )}
    </>
  );
}
