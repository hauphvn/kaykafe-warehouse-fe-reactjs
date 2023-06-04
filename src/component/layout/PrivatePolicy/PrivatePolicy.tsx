import { useEffect, useState } from 'react';
import { API_PATH } from 'src/app/constant';
import { get } from 'src/ultils/request';
import './PrivatePolicy.scss';
function PrivatePolicy() {
  const [url, setUrl] = useState('');
  useEffect(() => {
    get(API_PATH.USER_POLICY).then(res => {
      if (res?.data?.url) {
        setUrl(res?.data?.url);
      }
    });
  }, []);
  return <iframe className="private-policy-root" src={url} />;
}

export default PrivatePolicy;
