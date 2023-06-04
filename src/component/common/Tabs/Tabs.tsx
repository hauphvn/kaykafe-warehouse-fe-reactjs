import 'src/component/common/Tabs/Tabs.scss';
import { Tabs as TabsCommon } from 'antd';
import { ReactNode } from 'react';

export type TabsItem = {
  key: string;
  label: string;
  children: ReactNode;
};
interface TabsPropsT {
  className?: string;
  items: TabsItem[] | undefined;
  onChange?: (key: string) => void;
}

export default function Tabs(props: TabsPropsT) {
  const { className = '', items, onChange = () => null } = props;
  return (
    <TabsCommon className={`tabs-common-root ${className}`} defaultActiveKey="1" items={items} onChange={onChange} />
  );
}
