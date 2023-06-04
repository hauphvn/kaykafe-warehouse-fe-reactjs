import { useEffect, useRef, useState } from 'react';
import { CSVLink } from 'react-csv';
import './DownloadCsv.scss';
import { Toast } from 'src/component/common';
import { TOAST_STATUS } from 'src/app/validation_msg';

interface DownloadCsvT {
  data: Array<string>[];
  fileName?: string;
  onClickCsv?: any;
  resetDataCsv?: any;
}

const DownloadCsv = (props: DownloadCsvT) => {
  const csvRef: any = useRef(null);
  const { data = [], fileName = 'table', onClickCsv, resetDataCsv } = props;
  const [showWarningToast, setShowWarningToast] = useState(false);

  useEffect(() => {
    if (data?.length > 0 && onClickCsv) {
      csvRef.current.link.click();
      resetDataCsv();
    }
  }, [data]);

  return (
    <>
      {data?.length > 0 ? (
        <CSVLink className="btn-csv-root" data={data} filename={fileName + '.csv'} target="_self" ref={csvRef}>
          CSV出力
        </CSVLink>
      ) : (
        <a
          className="btn-csv-root"
          onClick={() => {
            if (onClickCsv) {
              onClickCsv();
            } else {
              if (data?.length > 0) {
                return true;
              } else {
                setShowWarningToast(true);
                return false;
              }
            }
          }}
        >
          CSV出力
        </a>
      )}
      {showWarningToast && (
        <Toast
          onClose={() => setShowWarningToast(false)}
          message={'データ無し'}
          showToast={showWarningToast}
          status={TOAST_STATUS.ERROR}
        />
      )}
    </>
  );
};

export default DownloadCsv;
