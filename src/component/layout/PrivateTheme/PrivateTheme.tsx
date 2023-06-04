import './PrivateTheme.scss';
import LeftNav from 'src/component/layout/LeftNav/LeftNav';
import Header from 'src/component/layout/Header/Header';

interface PrivateThemeT {
  children: any;
}
function PrivateTheme(props: PrivateThemeT) {
  const { children } = props;
  return (
    <div className="private-theme-root">
      <Header />
      <div className="theme-content">
        <LeftNav />

        <div className="private-content">{children}</div>
      </div>
    </div>
  );
}

export default PrivateTheme;
