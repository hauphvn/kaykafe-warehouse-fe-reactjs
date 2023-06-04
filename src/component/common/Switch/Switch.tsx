import 'src/component/common/Switch/Switch.scss';
import { Switch as SwitchBase } from 'antd';

interface SwitchPropsT {
  title?: string;
  onChange?: (event: boolean) => void;
  defaultChecked?: boolean;
  label?: string;
  checked?: boolean;
}

function Switch(props: SwitchPropsT) {
  const { title = 'Switch', onChange = () => null, defaultChecked, label, checked = false } = props;
  return (
    <div className={'switch-root'}>
      <div className="label">{label}</div>
      <SwitchBase defaultChecked={defaultChecked} onChange={onChange} title={title} checked={checked} />
    </div>
  );
}

export default Switch;
