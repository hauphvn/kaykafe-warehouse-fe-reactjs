import './MainWrapper.scss';

interface MainWrapperT {
  children: any;
  title: string;
  className?: string;
}

function MainWrapper(props: MainWrapperT) {
  const { children, title, className } = props;
  return (
    <div className={`main-wrapper-root ${className ? className : ''}`}>
      <div className="main-wrapper-title">{title}</div>
      <div className={`main-contaiter`}>{children}</div>
    </div>
  );
}

export default MainWrapper;
