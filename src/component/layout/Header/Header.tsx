import './Header.scss';
import Logo from 'src/assets/svg/logo.svg';

// interface contentListI {
//   icon: React.ReactElement;
//   name: string;
//   link: string;
// }
//
// interface userInfoI {
//   username: string;
//   email: string;
//   company: string;
// }

function Header() {
  // const dispatch = useAppDispatch();
  // const navigate = useNavigate();
  // const [userInfo, setUserInfo] = useState<userInfoI>();
  // const [isShow, setIsShow] = useState(false);
  // const [open, setOpen] = useState(false);
  // const [isSubmit, setIsSubmit] = useState(false);
  // const [isDisable, setIsDisable] = useState(true);
  // useEffect(() => {
  //   const infoToken = TokenService.getToken();
  //   if (infoToken) {
  //     const myDecodedToken: any = decodeToken(infoToken);
  //     setUserInfo({
  //       username: myDecodedToken?.user_name,
  //       email: myDecodedToken?.email,
  //       company: myDecodedToken?.company_name,
  //     });
  //   }
  // }, [TokenService.getToken()]);
  //
  // const dropdownContentList = [
  //   { icon: <IconKey />, name: 'パスワード変更', link: NAVIGATION_PATH.CHANGE_PASSWORD },
  //   { icon: <IconLogout />, name: 'ログアウト', link: NAVIGATION_PATH.LOGIN },
  // ];
  //
  // const onNavigate = (link: string) => {
  //   if (link === NAVIGATION_PATH.LOGIN) {
  //     post(API_PATH.LOGOUT, {
  //       refresh_token: TokenService.getRefreshToken(),
  //     }).finally(async () => {
  //       dispatch(onSetAuthStatus(false));
  //       await TokenService.clearLocalStorage();
  //       navigate(link);
  //     });
  //   } else {
  //     setIsShow(true);
  //     setOpen(false);
  //   }
  // };

  // const onClickLogo = () => {
  //   const isAdmin = TokenService.getRoleToken() === ROLE_USER.ADMIN;
  //   const isCompany = TokenService.getRoleToken() === ROLE_USER.COMPANY;
  //   let href = '';
  //   if (isAdmin) {
  //     href = NAVIGATION_PATH.CONTRACT_MANAGEMENT;
  //   } else if (isCompany) {
  //     href = NAVIGATION_PATH.COMPANY_NOTICE;
  //   } else {
  //     href = NAVIGATION_PATH.DOCUMENT;
  //   }
  //   navigate(href);
  // };

  // const contentPopover = (
  //   <div className="header-content-popover">
  //     <div className="content-user">
  //       {/*<img src={User} alt="user" />*/}
  //       {/*<div>*/}
  //       {/*  <div className="text">{userInfo?.username}</div>*/}
  //       {/*  <div className="text fs-12">{userInfo?.email}</div>*/}
  //       {/*  <div className="text">{userInfo?.company}</div>*/}
  //       {/*</div>*/}
  //     </div>
  //     {/*{dropdownContentList?.map((item: contentListI, index: number) => {*/}
  //     {/*  return (*/}
  //     {/*    <div className="header-menu-item" key={index} onClick={() => onNavigate(item.link)}>*/}
  //     {/*      {item.icon}*/}
  //     {/*      <div>{item.name}</div>*/}
  //     {/*    </div>*/}
  //     {/*  );*/}
  //     {/*})}*/}
  //   </div>
  // );

  // const handleOpenChange = (newOpen: boolean) => {
  //   setOpen(newOpen);
  // };

  // const onSubmit = () => {
  //   setIsSubmit(true);
  // };

  return (
    <div className="header-root">
      <div className="logo">
        <img src={Logo} alt="logo" />
      </div>
      {/*<Popover content={contentPopover} open={open} onOpenChange={handleOpenChange}>*/}
      {/*  <div className="header-right">*/}
      {/*    <div>*/}
      {/*      <div className="text">{userInfo?.username}</div>*/}
      {/*      <div className="text text-primary">{userInfo?.company}</div>*/}
      {/*    </div>*/}
      {/*    <img src={User} alt="user" />*/}
      {/*  </div>*/}
      {/*</Popover>*/}
      {/* <Modal
        destroyOnClose={true}
        onCancelClick={() => setIsShow(false)}
        isModalVisible={isShow}
        className={`modal-custom-root`}
        footer={null}
        closable={true}
      > */}
      {/*<ModalCustom*/}
      {/*  className={'modal-change-password'}*/}
      {/*  iconLeftPath={IconUserAddingPath}*/}
      {/*  onCancel={() => setIsShow(false)}*/}
      {/*  title={'パスワード変更'}*/}
      {/*  isShow={isShow}*/}
      {/*  okText={'登録'}*/}
      {/*  cancelText={'キャンセル'}*/}
      {/*  onSubmit={onSubmit}*/}
      {/*  isDisable={isDisable}*/}
      {/*>*/}
      {/*  <ChangePassword isSubmit={isSubmit} setIsSubmit={setIsSubmit} setIsDisable={setIsDisable} />*/}
      {/*</ModalCustom>*/}
    </div>
  );
}

export default Header;
