import './ErrorNotification.scss';
import { Table } from 'src/component/common';
import { useEffect, useState } from 'react';
import IconUploadWarning from 'src/assets/svg/icon-upload-file-invalid.svg';
import ModalCustom from 'src/component/common/Modal/ModalCustom/ModalCustom';
import iconDownload from 'src/assets/svg/icon-download.svg';
import { handleAddStt, handleSort, onGetMethodNotification } from 'src/ultils/common';
import { CSV_CREATE_NOTIFICATION_TEMPLATE_ERROR, CSV_CREATE_USER_TEMPLATE_ERROR } from 'src/app/constant';
import exportFromJSON from 'export-from-json';

export interface IListDataErrorNotification {
  no?: string;
  name: string;
  method: string | number;
  address: string;
}
export interface IErrorNotification {
  data: IListDataErrorNotification[];
  showModal: boolean;
}

export interface EditCommonDocumentPropsT {
  onCloseModal: () => void;
  dataItem: IErrorNotification;
}

const EditCommonDocument = (props: EditCommonDocumentPropsT) => {
  const {
    onCloseModal = () => null,
    dataItem = {
      showModal: false,
      data: [],
    },
  } = props;
  const [sortState, setSortState] = useState({ ordering: '' });
  const [listDataOriginal, setListDataOriginal] = useState<IListDataErrorNotification[]>([]);
  const [listDataView, setListDataView] = useState<IListDataErrorNotification[]>([]);

  useEffect(() => {
    setListDataOriginal(dataItem?.data);
    setListDataView(dataItem?.data);
  }, [dataItem?.data]);
  function onCancel() {
    onCloseModal();
  }

  function onClickDownload() {
    const data: any[] = dataItem?.data?.map((item: any) => ({
      [CSV_CREATE_NOTIFICATION_TEMPLATE_ERROR.COL_NO]: item?.no || '',
      [CSV_CREATE_NOTIFICATION_TEMPLATE_ERROR.COL_NAME]: item?.name || '',
      [CSV_CREATE_NOTIFICATION_TEMPLATE_ERROR.COL_METHOD]: onGetMethodNotification(+item?.method) || '',
      [CSV_CREATE_NOTIFICATION_TEMPLATE_ERROR.COL_ADDRESS]: item?.address || '',
    }));
    const fileName = CSV_CREATE_USER_TEMPLATE_ERROR.FILE_NAME;
    const exportType = exportFromJSON.types.csv;
    exportFromJSON({ data, fileName, exportType, delimiter: ';', withBOM: true });
  }

  const getNodeSettingOrDownload = () => {
    return (
      <div className={'setting-content-wrapper'} onClick={onClickDownload}>
        <img src={iconDownload} alt="icon" />
        <div className={'label'}>ダウンロード</div>
      </div>
    );
  };

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

  return (
    <ModalCustom
      className={'modal-error-notification-document'}
      classNameExtendElementRight="setting-download-file-common-editing"
      iconLeftPath={IconUploadWarning}
      extendElementRight={getNodeSettingOrDownload()}
      onCancel={onCancel}
      title={'通知エラー一覧'}
      isShow={dataItem?.showModal}
      okText={`クローズ`}
      // cancelText={'キャンセル'}
      onSubmit={onCancel}
    >
      <div className={`error-notification-document-root`}>
        <Table
          isHiddenRowSelection={true}
          data={listDataView}
          listKeyName={{
            names: ['No', 'ユーザー名', '通知', '通知先アドレス'],
            keys: [
              { keyName: 'no', sorter: false },
              { keyName: 'name', sorter: true },
              { keyName: 'method', sorter: true },
              { keyName: 'address', sorter: true },
            ],
          }}
          scroll={{ x: 'fit-content', y: 474 }}
          handleClickSorter={handleClickSorter}
        />
      </div>
    </ModalCustom>
  );
};

export default EditCommonDocument;
