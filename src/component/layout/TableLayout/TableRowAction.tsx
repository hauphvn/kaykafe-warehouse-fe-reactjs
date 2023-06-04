import './TableRowAction.scss';
import { Button } from 'src/component/common';
import iconArrow from 'src/assets/svg/icon-arrow-down.svg';
import iconReplaceMe from 'src/assets/svg/icon-replace-me.svg';

export enum BUTTON_TYPE {
  NORMAL,
  DROPDOWN,
}

export enum ACTION_TYPE {
  DELETE,
  SEND,
  DOWNLOAD,
}

export interface TypeActionTableRowShowT {
  type?: BUTTON_TYPE;
  actionType?: ACTION_TYPE;
  key: string;
  label?: string;
  isDisable?: boolean;
  onClick: (e?: any) => void;
  icon?: string;
}

export interface TableRowActionPropsT {
  // onNewRegistration?: (e: any) => void;
  className?: string;
  title?: string;
  typeActionShow: TypeActionTableRowShowT[];
}

function TableRowAction(props: TableRowActionPropsT) {
  const { title, typeActionShow = [] } = props;
  const renderButton = (action: any) => {
    switch (action?.type) {
      case BUTTON_TYPE.DROPDOWN:
        return (
          <div className="dropdown">
            <img src={iconReplaceMe} alt="icon" />
            <span>アクション</span>
            <img src={iconArrow} alt="icon" />
          </div>
        );
      default:
        return (
          <Button
            className={`${
              action?.actionType === ACTION_TYPE.DELETE
                ? 'btn-delete-action-table'
                : action?.actionType === ACTION_TYPE.SEND
                ? 'btn-send-action-table'
                : ''
            }`}
            isDisable={action?.isDisable}
            iconSide={'left'}
            icon={<img src={action?.icon || ''} alt="icon" />}
            name={action?.label || 'Button Label'}
            onClick={action?.onClick}
          />
        );
    }
  };
  return (
    <div className={'table_action-root'}>
      <div className="title">{title}</div>
      <div className="btn-list">
        {typeActionShow && typeActionShow?.map((action: any) => <div key={action.key}>{renderButton(action)}</div>)}
      </div>
    </div>
  );
}

export default TableRowAction;
