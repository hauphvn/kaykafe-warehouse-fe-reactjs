import { Pagination as PaginationBase } from 'antd';
import './Pagination.scss';

interface PaginationPropsT {
  pageSize: number;
  defaultCurrent?: number;
  total: number;
  onChange: (page: number) => void;
  current?: number;
}

export default function Pagination(props: PaginationPropsT) {
  const { pageSize = 0, defaultCurrent = 0, total = 0, onChange, current } = props;
  return (
    <PaginationBase
      onChange={onChange}
      pageSize={pageSize}
      defaultCurrent={defaultCurrent}
      total={total}
      className={'pagination-root'}
      current={current}
    />
  );
}
