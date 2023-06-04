import { Popover as PopoverComp } from 'antd';
import './Popover.scss';

const Popover = (props: {
  children: React.ReactElement;
  content: React.ReactElement;
  open: boolean;
  onOpenChange: (data: any) => void;
}) => {
  const { children, content, open, onOpenChange } = props;

  return (
    <PopoverComp placement="bottomRight" content={content} trigger="click" open={open} onOpenChange={onOpenChange}>
      {children}
    </PopoverComp>
  );
};

export default Popover;
