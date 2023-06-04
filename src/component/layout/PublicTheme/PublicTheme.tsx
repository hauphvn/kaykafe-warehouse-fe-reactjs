import './PublicTheme.scss';

interface PublicThemeT {
  children: any;
}
function PublicTheme(props: PublicThemeT) {
  const { children } = props;

  return (
    <div className="public-theme-root">
      <div className={`public-theme-container`}>{children}</div>
    </div>
  );
}

export default PublicTheme;
