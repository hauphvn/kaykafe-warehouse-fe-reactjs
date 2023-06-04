import { useEffect, useState } from 'react';
import { API_PATH } from 'src/app/constant';
import { get } from 'src/ultils/request';
import './Enviroment.scss';
function Enviroment() {
  const [url, setUrl] = useState('');
  useEffect(() => {
    get(API_PATH.USER_RECOMMEND).then(res => {
      if (res?.data?.url) {
        setUrl(res?.data?.url);
      }
    });
  }, []);
  return <iframe className="env-root" src={url} />;
}

export default Enviroment;
