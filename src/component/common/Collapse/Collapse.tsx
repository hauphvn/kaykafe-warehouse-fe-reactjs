import { Collapse } from 'antd';
import './Collapse.scss';

const { Panel } = Collapse;

interface CollapsePropsT {
  content: string;
  header: string;
  defaultActive?: number;
  showArrow?: boolean;
  collapsible?: 'header' | 'disabled' | undefined;
}

export default function CollapseCommon(props: CollapsePropsT) {
  const { content, header, defaultActive, showArrow = true, collapsible = undefined } = props;

  return (
    <Collapse className={'collapse-root'} defaultActiveKey={defaultActive}>
      <Panel collapsible={collapsible} showArrow={showArrow} header={header} key={1}>
        <div className={'collapse-root__content'}>{content}</div>
      </Panel>
    </Collapse>
  );
}
