import { Divider } from 'antd';
import './FormWrapper.scss';

interface FormWrapperT {
  title: string | any;
  children: any;
  className?: string;
  dividerColor?: string;
}

function FormWrapper(props: FormWrapperT) {
  const { title, children, className, dividerColor = '#5C5C5B' } = props;
  return (
    <div className={`form-wrapper-root ${className ? className : ''}`}>
      <h2 className="text-title">{title}</h2>
      <Divider style={{ border: `1px solid ${dividerColor}`, opacity: 0.36, margin: '3.85rem 0 0 0' }} />
      <div className="input-form">{children}</div>
    </div>
  );
}

export default FormWrapper;
