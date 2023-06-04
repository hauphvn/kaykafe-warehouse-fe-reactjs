import { useEffect, useState } from 'react';
import { API_PATH } from 'src/app/constant';
import { get } from 'src/ultils/request';
import './TermsOfService.scss';
function TermsOfService() {
  const [url, setUrl] = useState('');
  useEffect(() => {
    get(API_PATH.USER_TERM).then(res => {
      if (res?.data?.url) {
        setUrl(res?.data?.url);
      }
    });
  }, []);
  return <iframe className="term-root" src={url} />;
}

export default TermsOfService;
