import { Empty } from 'antd';
import './MultiSelectTag.scss';
function MultiSelectTag(props: MultiSelectTagT) {
  const { required, label, data, search, handleSelected } = props;

  const dataRender = search === '' ? data : data?.filter(item => item?.name?.includes(search || ''));

  function onSelect(itemSelected: itemT) {
    const newSelectedList = data?.map((item: itemT) => {
      if (item?.id === itemSelected?.id) {
        item.selected = !item?.selected;
      }
      return item;
    });
    handleSelected && handleSelected(newSelectedList);
  }
  return (
    <div className="multi-select-tag-root">
      {label && dataRender.length > 0 && <div className={`label ${required ? 'required' : ''}`}>{label}</div>}
      {data && (
        <div className="selection-place">
          {dataRender.length > 0 ? (
            dataRender?.map((item: itemT) => (
              <div
                key={item.id}
                className={`item  ${item.selected ? 'selected' : ''}`}
                title={item.name}
                onClick={() => onSelect(item)}
              >
                {item.name}
              </div>
            ))
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className="empty" />
          )}
        </div>
      )}
    </div>
  );
}

export default MultiSelectTag;

export interface MultiSelectTagT {
  data: itemT[];
  label?: string;
  search?: string;
  handleSelected?: (data: itemT[]) => void;
  required?: boolean;
}
export interface itemT {
  id: string;
  name: string;
  selected: boolean;
}
