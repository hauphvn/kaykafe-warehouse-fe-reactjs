// import { Link } from 'react-router-dom';
import { dataBtnT, listKeyT } from 'src/models';
import {
  ACTION_ITEM_TABLE,
  CONTACT_TYPE,
  FORMAT_DATE_TIME,
  TYPES_NOTIFICATION,
  TYPES_NOTIFICATION_STRING,
} from 'src/app/constant';
import IconDelete from 'src/assets/svg/icon-recycle-circle-fill.svg';
import IconNotApprove from 'src/assets/svg/icon-not-opprove.svg';
import IconApprove from 'src/assets/svg/icon-opprove.svg';
import IconDeleteCircleRed from 'src/assets/svg/icon-delete-circle-red.svg';
import IconRecycleBinRed from 'src/assets/svg/icon-recycle-bin-red.svg';
import IconCheckedValidGreen from 'src/assets/svg/icon-checked-valid-green.svg';
import IconNoticeTopPage from 'src/assets/svg/icon_edit_notice_top_page.svg';
import { IconEditPen, IconReset } from 'src/assets/icons';
import { Switch } from 'src/component/common';
import {
  getDocumentStatusStringByStatusNumber,
  getDocumentTypeByTypeNumber,
  getIconExtendFile,
} from 'src/ultils/common';
import moment from 'moment';
import { Tooltip } from 'antd';

const customColumn = (listKey: listKeyT[], dataApi: any) => {
  return dataApi?.map((item: any, index: number) => {
    return {
      key: index + 1,
      id: item.id || item._id, // check later
      detail: 'Detail',
      ...handleItemCl(item, listKey),
    };
  });
};

const handleItemCl = (item: any, listKey: listKeyT[]) => {
  let obj = {};
  for (let i = 0; i < listKey?.length; i++) {
    const newItem: any = item[listKey[i]?.keyName];
    if (listKey[i]?.child?.length > 0) {
      if (newItem?.length > 0) {
        let newObj: any;
        listKey[i]?.child?.map((item: string | number) => {
          if (typeof item === 'number') {
            newObj = newItem?.[item];
          } else {
            newObj = newObj?.[item];
          }
        });
        obj = { ...obj, [listKey[i]?.keyName]: newObj };
      }
    } else {
      obj = { ...obj, [listKey[i]?.keyName]: item[listKey[i]?.keyName] };
    }
  }
  return obj;
};

const customHeaderTb = (listName: string[], listKey: listKeyT[], handleClickSorter: any, onActionItemById?: any) => {
  function onEditItem(id: string, actionType: number, options?: any) {
    onActionItemById(id, actionType, options);
  }

  const data = listName.map((item: string, index: number) => {
    let customItem = {
      title: item,
      key: listKey[index]?.keyName,
      dataIndex: listKey[index]?.keyName,
      sorter: listKey[index]?.sorter,
      onHeaderCell: (column: any): any => ({
        onClick: () => (listKey[index]?.sorter ? handleClickSorter(column) : {}),
      }),
    };
    if (listKey[index]?.keyName === 'button') {
      const btnItem = {
        render: (_: any, record: any) => {
          const dataBtn: dataBtnT = record[listKey[index]?.keyName];
          return (
            <div className="btn-list">
              <span key={index} className={`btn-span ${dataBtn?.type === 'tag' ? 'tag' : 'highlight'}`}>
                {dataBtn?.name}
              </span>
            </div>
          );
        },
      };
      customItem = { ...customItem, ...btnItem };
    } else if (listKey[index]?.keyName === 'edit_act') {
      const btnItem = {
        render: (_: any, record: any) => {
          const id = record?.id;
          return (
            <div className="btn-list">
              <span className={'icons-wrapper'} key={index}>
                <span className={'item-icon'} onClick={() => onEditItem(id, ACTION_ITEM_TABLE.EDIT)}>
                  <IconEditPen />
                </span>
                <span className={'item-icon'} onClick={() => onEditItem(id, ACTION_ITEM_TABLE.RESET)}>
                  <IconReset />
                </span>{' '}
                <span onClick={() => onEditItem(id, ACTION_ITEM_TABLE.DELETE)}>
                  <img src={IconDelete} alt="icon" />
                </span>
              </span>
            </div>
          );
        },
      };
      customItem = { ...customItem, ...btnItem };
    } else if (listKey[index]?.keyName === 'error_message') {
      const btnItem = {
        render: (_: any, record: any) => {
          const msg = record?.error_message;
          return (
            <div className={'error-message'}>
              <span className={'td-span'}>
                <Tooltip title={msg}>
                  <span className={'error-message'}>{msg}</span>
                </Tooltip>
              </span>
            </div>
          );
        },
      };
      customItem = { ...customItem, ...btnItem };
    } else if (listKey[index]?.keyName === 'is_active_user_company') {
      const btnItem = {
        render: (_: any, record: any) => {
          const { is_active, id } = record;
          return (
            <div className="btn-list">
              <Switch
                onChange={() =>
                  onActionItemById(id, ACTION_ITEM_TABLE.CHANGE_ACTIVE_USER_COMPANY, { oldStatus: is_active })
                }
                checked={is_active}
              />
            </div>
          );
        },
      };
      customItem = { ...customItem, ...btnItem };
    } else if (listKey[index]?.keyName === 'contact_method') {
      const btnItem = {
        render: (_: any, record: any) => {
          const contactMethods = record?.contact_method;
          return (
            <div className="tags-contact">
              {contactMethods?.email ? <div className={'tag tag-m'}>M</div> : <div className={'tag'}></div>}
              {contactMethods?.sms ? <div className={'tag tag-s'}>S</div> : <div className={'tag'}></div>}
              {contactMethods?.line ? <div className={'tag tag-l'}>L</div> : <div className={'tag'}></div>}
            </div>
          );
        },
      };
      customItem = { ...customItem, ...btnItem };
    } else if (listKey[index]?.keyName === 'method') {
      const btnItem = {
        render: (_: any, record: any) => {
          const contactMethod = +record?.method;
          return (
            <div className="tags-contact">
              {contactMethod === CONTACT_TYPE.EMAIL ? <div className={'tag tag-m'}>M</div> : null}
              {contactMethod === CONTACT_TYPE.SMS ? <div className={'tag tag-s'}>S</div> : null}
              {contactMethod === CONTACT_TYPE.LINE ? <div className={'tag tag-l'}>L</div> : null}
            </div>
          );
        },
      };
      customItem = { ...customItem, ...btnItem };
    } else if (listKey[index]?.keyName === 'edit_act_admin_admin_management') {
      const btnItem = {
        render: (_: any, record: any) => {
          const { id, is_edit } = record;
          return (
            <div className="btn-list">
              <span className={'icons-wrapper'} key={index}>
                <span
                  className={`item-icon ${!is_edit ? 'no-hover disabled-hover' : ''}`}
                  onClick={() => (is_edit ? onEditItem(id, ACTION_ITEM_TABLE.EDIT) : null)}
                >
                  <IconEditPen />
                </span>
                <span
                  className={`item-icon ${!is_edit ? 'no-hover disabled-hover' : ''}`}
                  onClick={() => (is_edit ? onEditItem(id, ACTION_ITEM_TABLE.RESET) : null)}
                >
                  <IconReset />
                </span>{' '}
              </span>
            </div>
          );
        },
      };
      customItem = { ...customItem, ...btnItem };
    } else if (listKey[index]?.keyName === 'edit_btn_company_user') {
      const btnItem = {
        render: (_: any, record: any) => {
          const id = record?.id;
          const statusString = record?.status;
          return (
            <div className="btn-list">
              <span className={'icons-wrapper gap-small'} key={index}>
                <span className={'item-icon'} onClick={() => onEditItem(id, ACTION_ITEM_TABLE.EDIT)}>
                  <IconEditPen />
                </span>
                <span className={'item-icon'} onClick={() => onEditItem(id, ACTION_ITEM_TABLE.RESET)}>
                  <IconReset />
                </span>{' '}
                <span className={'text-small td-span'}>{statusString}</span>{' '}
              </span>
            </div>
          );
        },
      };
      customItem = { ...customItem, ...btnItem };
    } else if (listKey[index]?.keyName === 'action_file_upload_document') {
      const btnItem = {
        render: (_: any, record: any) => {
          const { is_error, id } = record;
          return (
            <div className="btn-list">
              <span className={'icons-wrapper gap-11'} key={index}>
                <span>
                  <img className={'no-hover'} src={is_error ? IconDeleteCircleRed : IconCheckedValidGreen} alt="icon" />
                </span>
                <span onClick={() => onEditItem(id, ACTION_ITEM_TABLE.DELETE)}>
                  <img src={IconRecycleBinRed} alt="con" />
                </span>
              </span>
            </div>
          );
        },
      };
      customItem = { ...customItem, ...btnItem };
    } else if (listKey[index]?.keyName === 'file_name_preview_document') {
      const btnItem = {
        render: (_: any, record: any) => {
          const { icon_file_upload_document, file_name } = record;
          return (
            <div className="icon-file-type-upload">
              <img src={icon_file_upload_document} alt="type-file" />
              <span className={'td-span'}>
                <Tooltip title={file_name}> {file_name}</Tooltip>
              </span>
            </div>
          );
        },
      };
      customItem = { ...customItem, ...btnItem };
    } else if (listKey[index]?.keyName === 'icon_file_upload_document') {
      const btnItem = {
        render: (_: any, record: any) => {
          const { icon_file_upload_document } = record;
          return (
            <div className="icon-file-type-upload">
              <img src={icon_file_upload_document} alt="type-file" />
            </div>
          );
        },
      };
      customItem = { ...customItem, ...btnItem };
    } else if (listKey[index]?.keyName === 'document_name') {
      const btnItem = {
        render: (_: any, record: any) => {
          const { document_name, id } = record;
          const iconByExtendFile = getIconExtendFile(document_name);
          return (
            <div className="icon-file-type-list-all">
              <img src={iconByExtendFile} alt="type-file" />
              <span onClick={() => onEditItem(id, ACTION_ITEM_TABLE.EDIT)} className={'td-span allow-hover'}>
                {document_name}
              </span>
            </div>
          );
        },
      };
      customItem = { ...customItem, ...btnItem };
    } else if (listKey[index]?.keyName === 'user_document_name_custom') {
      const btnItem = {
        render: (_: any, record: any) => {
          const { document_name } = record;
          const iconByExtendFile = getIconExtendFile(document_name);
          return (
            <div className="icon-file-type-list-all">
              <img src={iconByExtendFile} alt="type-file" />
              <span>{document_name}</span>
            </div>
          );
        },
      };
      customItem = { ...customItem, ...btnItem };
    } else if (listKey[index]?.keyName === 'document_type') {
      const btnItem = {
        render: (_: any, record: any) => {
          const { document_type } = record;
          const typeFileString = getDocumentTypeByTypeNumber(document_type);
          return (
            <div className="text">
              <span className={'td-span'}>{typeFileString}</span>
            </div>
          );
        },
      };
      customItem = { ...customItem, ...btnItem };
    } else if (listKey[index]?.keyName === 'edit_act_iis_company') {
      const btnItem = {
        render: (_: any, record: any) => {
          const id = record?.id;
          return (
            <div className="btn-list">
              <span className={'icons-wrapper'} key={index}>
                <span className={'item-icon'} onClick={() => onEditItem(id, ACTION_ITEM_TABLE.EDIT)}>
                  <IconEditPen />
                </span>
                <span className={'item-icon'} onClick={() => onEditItem(id, ACTION_ITEM_TABLE.RESET)}>
                  <IconReset />
                </span>{' '}
              </span>
            </div>
          );
        },
      };
      customItem = { ...customItem, ...btnItem };
    } else if (listKey[index]?.keyName === 'approval_status') {
      const btnItem = {
        render: (_: any, record: any) => {
          const { approval_status } = record;
          const statusString = getDocumentStatusStringByStatusNumber(approval_status);
          return (
            <div className="text">
              <span className={'td-span'}>{statusString}</span>
            </div>
          );
        },
      };
      customItem = { ...customItem, ...btnItem };
    } else if (listKey[index]?.keyName === 'notification') {
      const btnItem = {
        render: (_: any, record: any) => {
          const { notification, id } = record;
          const notificationString = TYPES_NOTIFICATION_STRING.find(item => +item.type === +notification)?.text || '';
          return (
            <div className="text">
              <span
                onClick={() =>
                  +notification === +TYPES_NOTIFICATION.FAILED
                    ? onEditItem(id, ACTION_ITEM_TABLE.SHOW_ERROR_NOTIFICATION)
                    : null
                }
                className={`td-span ${
                  +notification === +TYPES_NOTIFICATION.FAILED ? 'error-message under-line bold-16' : ''
                }`}
              >
                {notificationString}
              </span>
            </div>
          );
        },
      };
      customItem = { ...customItem, ...btnItem };
    } else if (listKey[index]?.keyName === 'edit_act_company_manage') {
      const btnItem = {
        render: (_: any, record: any) => {
          const { id, is_edit } = record;
          return (
            <div className="btn-list">
              <span className={'icons-wrapper'} key={index}>
                <span
                  className={`item-icon ${!is_edit ? 'no-hover disabled-hover' : ''}`}
                  onClick={() => (is_edit ? onEditItem(id, ACTION_ITEM_TABLE.EDIT) : null)}
                >
                  <IconEditPen />
                  {/*<img className={`${!is_edit ? 'no-hover disabled-hover' : ''}`} src={IconPenEdit} alt="" />*/}
                </span>
                <span
                  className={`item-icon ${!is_edit ? 'no-hover disabled-hover' : ''}`}
                  onClick={() => (is_edit ? onEditItem(id, ACTION_ITEM_TABLE.RESET) : null)}
                >
                  <IconReset />
                  {/*<img className={`${!is_edit ? 'no-hover disabled-hover' : ''}`} src={IconReStore} alt="" />*/}
                </span>{' '}
              </span>
            </div>
          );
        },
      };
      customItem = { ...customItem, ...btnItem };
    } else if (listKey[index]?.keyName === 'is_approved') {
      const btnItem = {
        render: (_: any, record: any) => {
          const icon = record?.is_approved ? IconApprove : IconNotApprove;
          return (
            <div className="btn-list">
              <span className={'icons-wrapper'} key={index}>
                <img src={icon} alt="icon" />
              </span>
            </div>
          );
        },
      };
      customItem = { ...customItem, ...btnItem };
    } else if (listKey[index]?.keyName === 'edit_act_noti') {
      const btnItem = {
        render: (_: any, record: any) => {
          const id = record?.id;
          return (
            <div className="btn-list">
              <span className={'icons-wrapper'} key={index}>
                <span className={'item-icon'} onClick={() => onEditItem(id, ACTION_ITEM_TABLE.EDIT)}>
                  <IconEditPen />
                </span>
              </span>
            </div>
          );
        },
      };
      customItem = { ...customItem, ...btnItem };
    } else if (listKey[index]?.keyName === 'edit_act_company_group') {
      const btnItem = {
        render: (_: any, record: any) => {
          const id = record?.id;
          return (
            <div className="btn-list">
              <span className={'icons-wrapper'} key={index}>
                <span className={'item-icon'} onClick={() => onEditItem(id, ACTION_ITEM_TABLE.EDIT)}>
                  <IconEditPen />
                </span>
              </span>
            </div>
          );
        },
      };
      customItem = { ...customItem, ...btnItem };
    } else if (listKey[index]?.keyName === 'edit_notcie_top_page') {
      const btnItem = {
        render: (_: any, record: any) => {
          const { id, type } = record;
          return (
            <div className="btn-list">
              <span className={'icons-wrapper'} key={index}>
                <span onClick={() => onEditItem(id, ACTION_ITEM_TABLE.EDIT, type)}>
                  <img src={IconNoticeTopPage} alt="" />
                </span>
              </span>
            </div>
          );
        },
      };
      customItem = { ...customItem, ...btnItem };
    } else if (listKey[index]?.keyName === 'public_date') {
      const btnItem = {
        render: (_: any, record: any) => {
          const contentString = moment(record[listKey[index]?.keyName]).format(
            FORMAT_DATE_TIME.DATE_TIME_TEXT_H_MINUTE,
          );
          return (
            <span className="td-span" title={contentString}>
              {contentString}
            </span>
          );
        },
      };
      customItem = { ...customItem, ...btnItem };
    } else if (listKey[index]?.keyName === 'expired_date') {
      const btnItem = {
        render: (_: any, record: any) => {
          const contentString = moment(record[listKey[index]?.keyName]).format(FORMAT_DATE_TIME.DATE_FULL_SLASH);
          return (
            <span className="td-span" title={contentString}>
              {contentString}
            </span>
          );
        },
      };
      customItem = { ...customItem, ...btnItem };
    } else if (listKey[index]?.keyName === 'notice_name_custom') {
      const btnItem = {
        render: (_: any, record: any) => {
          const { name } = record;
          const iconByExtendFile = getIconExtendFile(name);
          return (
            <div className="icon-file-type-list-all">
              <img src={iconByExtendFile} alt="type-file" />
              <span>{name}</span>
            </div>
          );
        },
      };
      customItem = { ...customItem, ...btnItem };
    } else if (listKey[index]?.keyName === 'notice_type_custom') {
      const btnItem = {
        render: (_: any, record: any) => {
          const { type } = record;
          const typeFileString = getDocumentTypeByTypeNumber(type);
          return (
            <div className="text">
              <span>{typeFileString}</span>
            </div>
          );
        },
      };
      customItem = { ...customItem, ...btnItem };
    } else {
      const btnItem = {
        render: (_: any, record: any) => {
          return (
            <span className="td-span" title={record[listKey[index]?.keyName]}>
              {record[listKey[index]?.keyName]}
            </span>
          );
        },
      };
      customItem = { ...customItem, ...btnItem };
    }
    return customItem;
  });
  const newData = [
    // {
    //   title: ' ',
    //   key: 'detail',
    //   render: (_: any, record: any) => {
    //     return <Link to={record.id || record._id}>{record.detail}</Link>; // check later
    //   },
    // },
    ...data,
  ];

  return newData;
};

export const handleDataTable = {
  customColumn,
  customHeaderTb,
};
