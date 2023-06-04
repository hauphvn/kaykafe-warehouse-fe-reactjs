import './PreviewCSVInValid.scss';
import { Table } from 'src/component/common';
import ModalCustom from 'src/component/common/Modal/ModalCustom/ModalCustom';
import IconUserAddingPath from 'src/assets/svg/icon-user-add-new-warning.svg';
import { CSV_CREATE_USER_TEMPLATE_ERROR, HEIGHT_TABLE } from 'src/app/constant';
import iconDownload from 'src/assets/svg/icon-download.svg';
import { useEffect, useState } from 'react';
import exportFromJSON from 'export-from-json';
import { handleAddStt, handleSort } from 'src/ultils/common';

type PreviewCSVIsValidPropsT = {
  notification?: any;
  className?: string;
  onClose: () => void;
  objDataPreview: any;
};
const PreviewCSVInValid = (props: PreviewCSVIsValidPropsT) => {
  const { onClose = () => null, objDataPreview = null } = props;
  const [sortState, setSortState] = useState({ ordering: '' });
  const [listDataOriginal, setListDataOriginal] = useState<any[]>([]);
  const [listDataView, setListDataView] = useState<any[]>([]);

  useEffect(() => {
    setListDataOriginal(objDataPreview?.data?.listUsers);
    setListDataView(objDataPreview?.data?.listUsers);
  }, [objDataPreview?.data?.listUsers]);
  const handleClickSorter = (data: any) => {
    setSortState(pre => {
      let orderKey = '';
      if (pre.ordering === '-' + data.key) {
        orderKey = '';
        const newData = handleAddStt({ page: 1 }, listDataOriginal);
        setListDataView(newData);
      } else if (data?.key !== pre.ordering) {
        orderKey = data.key;
        const newData = handleAddStt({ page: 1 }, handleSort(data, 'alphabetically', listDataView));
        setListDataView(newData);
      } else if (data?.key === pre.ordering) {
        orderKey = '-' + data.key;
        const newData = handleAddStt({ page: 1 }, handleSort(data, '', listDataView));
        setListDataView(newData);
      }
      return { ...sortState, ordering: orderKey };
    });
  };
  function onClickDownload() {
    const data: any[] = objDataPreview?.data?.listUsers?.map((item: any) => ({
      [CSV_CREATE_USER_TEMPLATE_ERROR.COL_NO]: item?.no || '',
      [CSV_CREATE_USER_TEMPLATE_ERROR.COL_ID]: item?.user_id || '',
      [CSV_CREATE_USER_TEMPLATE_ERROR.COL_USER_NAME]: item?.user_name || '',
      [CSV_CREATE_USER_TEMPLATE_ERROR.COL_EMAIL]: item?.email || '',
      [CSV_CREATE_USER_TEMPLATE_ERROR.COL_ERROR_MSG]: item?.error_message || '',
    }));
    const fileName = CSV_CREATE_USER_TEMPLATE_ERROR.FILE_NAME;
    const exportType = exportFromJSON.types.csv;
    exportFromJSON({ data, fileName, exportType, delimiter: ';', withBOM: true });
  }

  const getNodeSettingOrDownload = () => {
    return (
      <div className={'download-content-wrapper'} onClick={onClickDownload}>
        <img src={iconDownload} alt="icon" />
        <div className={'label'}>エラーファイル一覧</div>
      </div>
    );
  };
  return (
    <div className={'preview-csv-in-valid-root'}>
      <ModalCustom
        destroyOnClose={true}
        classNameExtendElementRight="download-preview-in-valid"
        extendElementRight={getNodeSettingOrDownload()}
        className={'modal-preview-csv-in-valid-root'}
        iconLeftPath={IconUserAddingPath}
        onCancel={onClose}
        title={'ユーザー登録（エラー一覧）'}
        isShow={objDataPreview?.showModal}
        okText={`クローズ`}
        // cancelText={'キャンセル'}
        onSubmit={onClose}
        isDisable={false}
      >
        <div className={'modal-preview-csv-in-valid-children'}>
          <div className={'modal-preview-csv-in-valid-detail'}>
            <div className="form">
              <div className="table-result-wrapper">
                <div className={'title-wrapper'}>
                  <div className="item">
                    <span className={'label'}>トータル件数：</span>
                    <span>{objDataPreview?.data?.totalRecord}</span>
                  </div>
                  <div className="item">
                    <span className={'label'}>エラー数：</span>
                    <span className={'high-line padding-left'}>{objDataPreview?.data?.listUsers?.length}</span>
                  </div>
                </div>
                <Table
                  isHiddenRowSelection={true}
                  data={listDataView}
                  listKeyName={{
                    names: ['No', 'ID', 'ユーザー名', 'メールアドレス', 'エラー内容'],
                    keys: [
                      { keyName: 'no', sorter: false },
                      { keyName: 'user_id', sorter: true },
                      { keyName: 'user_name', sorter: true },
                      { keyName: 'email', sorter: true },
                      { keyName: 'error_message', sorter: true },
                    ],
                  }}
                  handleClickSorter={handleClickSorter}
                  scroll={{ x: true, y: HEIGHT_TABLE }}
                />
              </div>
            </div>
          </div>
        </div>
      </ModalCustom>
    </div>
  );
};

export default PreviewCSVInValid;
