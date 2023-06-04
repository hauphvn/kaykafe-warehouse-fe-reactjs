import 'src/component/layout/Document/New/InValid/DocumentInValid.scss';
import { Table } from 'src/component/common';
import ModalCustom from 'src/component/common/Modal/ModalCustom/ModalCustom';
import { CSV_CREATE_DOCUMENT_TEMPLATE_ERROR, HEIGHT_TABLE } from 'src/app/constant';
import iconDownload from 'src/assets/svg/icon-download.svg';
import iconUploadFileInvalid from 'src/assets/svg/icon-upload-file-invalid.svg';
import { useEffect, useState } from 'react';
import exportFromJSON from 'export-from-json';
import { handleAddStt, handleSort } from 'src/ultils/common';

export interface IObjDataPreview {
  data: {
    icon_file_upload_document: string;
    file_name: string;
    error_message: string;
    is_error: boolean;
    id: string;
    no?: number;
  }[];
  showModal: boolean;
  fromLocal?: boolean;
  total: number;
}

type PreviewDocumentIsValidPropsT = {
  className?: string;
  onClose: () => void;
  objDataPreview: IObjDataPreview;
  onForceSubmit?: () => void;
};
const DocumentInValid = (props: PreviewDocumentIsValidPropsT) => {
  const {
    onClose = () => null,
    objDataPreview = {
      showModal: false,
      data: [],
      fromLocal: true,
      total: 0,
    },
  } = props;
  const [sortState, setSortState] = useState({ ordering: '' });
  const [listDataOriginal, setListDataOriginal] = useState<any[]>([]);
  const [listDataView, setListDataView] = useState<any[]>([]);
  useEffect(() => {
    setListDataOriginal(objDataPreview?.data);
    setListDataView(objDataPreview?.data);
  }, [objDataPreview?.data]);
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
    const data: any[] = objDataPreview?.data?.map((item: any) => ({
      [CSV_CREATE_DOCUMENT_TEMPLATE_ERROR.COL_NO]: item?.no || '',
      [CSV_CREATE_DOCUMENT_TEMPLATE_ERROR.COL_FILE_NAME]: item?.file_name || '',
      [CSV_CREATE_DOCUMENT_TEMPLATE_ERROR.COL_MESSAGE]: item?.error_message || '',
    }));
    const fileName = CSV_CREATE_DOCUMENT_TEMPLATE_ERROR.FILE_NAME;
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
        className={'modal-preview-document-in-valid-root'}
        iconLeftPath={iconUploadFileInvalid}
        onCancel={onClose}
        title={'アップロードファイル不正'}
        isShow={objDataPreview?.showModal}
        okText={`クローズ`}
        // cancelText={'キャンセル'}
        onSubmit={onClose}
        isDisable={false}
      >
        <div className={'modal-preview-document-in-valid-children'}>
          <div className={'modal-preview-document-in-valid-detail'}>
            <div className="form">
              <div className="table-result-wrapper">
                <div className={'title-wrapper'}>
                  <div className="item">
                    <span className={'label'}>ファイル数：</span>
                    <span>{objDataPreview?.total}</span>
                  </div>
                  <div className="item">
                    <span className={'label'}>有効ファイル数: </span>
                    <span>{objDataPreview?.total - objDataPreview?.data.length}</span>
                  </div>
                  <div className="item">
                    <span className={'label'}>不正なファイル：</span>
                    <span className={'high-line padding-left'}>{objDataPreview?.data?.length}</span>
                  </div>
                </div>
                <Table
                  isHiddenRowSelection={true}
                  data={listDataView}
                  listKeyName={{
                    names: ['No', 'ファイル名', 'エラー内容'],
                    keys: [
                      { keyName: 'no', sorter: false },
                      { keyName: 'file_name_preview_document', sorter: true },
                      { keyName: 'error_message', sorter: true },
                      { keyName: 'id', sorter: true },
                      { keyName: 'file_name', sorter: true },
                      { keyName: 'icon_file_upload_document', sorter: true },
                    ],
                  }}
                  handleClickSorter={handleClickSorter}
                  scroll={{ x: 'max-content', y: HEIGHT_TABLE }}
                />
              </div>
            </div>
            {objDataPreview?.fromLocal && (
              <div className={'warning-text-submit'}>
                ファイルアップをアップする前にエラー・ファイルを削除して下さい。
              </div>
            )}
          </div>
        </div>
      </ModalCustom>
    </div>
  );
};

export default DocumentInValid;
