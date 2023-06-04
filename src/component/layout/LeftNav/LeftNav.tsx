import './LeftNav.scss';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import React, { memo, useEffect, useState } from 'react';
import { NAVIGATION_PATH, ROLE_USER } from 'src/app/constant';
import { useLocation, useNavigate } from 'react-router-dom';
import { TokenService } from 'src/ultils/tokenService';
// import { onSetAuthStatus } from 'src/redux/auth/authSlice';
// import { useAppDispatch } from 'src/app/hooks';
import {
  IconDocument,
  IconSetting,
  IconUser,
  IconUserGroup,
  IconAdmin,
  IconNotice,
  IconStar,
  // IconKey,
  // IconLogout,
  IconHelp,
  IconContract,
  IconClock,
  IconTerms,
  IconPrivatePolicy,
  IconEnv,
} from 'src/assets/icons';
// import { post } from 'src/ultils/request';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const AdminMenuItems: MenuItem[] = [
  getItem('メンテナンス', 'sub1', <IconSetting />, [
    getItem('契約企業', NAVIGATION_PATH.CONTRACT_MANAGEMENT, <IconContract />),
    getItem('お知らせ（企業宛て）', NAVIGATION_PATH.NOTICE_MANAGEMENT, <IconNotice />),
    getItem('運用者', NAVIGATION_PATH.ADMIN_MANAGEMENT, <IconAdmin />),
  ]),
  getItem('その他', 'sub2', <IconStar />, [
    getItem('操作履歴', NAVIGATION_PATH.OPERATION_HISTORY, <IconClock />),
    // getItem('パスワード変更', NAVIGATION_PATH.CHANGE_PASSWORD, <IconKey />),
    // getItem('ログアウト', NAVIGATION_PATH.LOGIN, <IconLogout />),
  ]),
];

const CustomerMenuItems: MenuItem[] = [
  getItem('書類', NAVIGATION_PATH.DOCUMENT, <IconDocument />),
  getItem('設計変更', NAVIGATION_PATH.DESIGN_CHANGE, <IconSetting />),
  // getItem('パスワード変更', NAVIGATION_PATH.CHANGE_PASSWORD, <IconKey />),
  // getItem('ログアウト', NAVIGATION_PATH.LOGIN, <IconLogout />),
  getItem('ヘルプ', NAVIGATION_PATH.HELP, <IconHelp />),
  getItem('利用規約', NAVIGATION_PATH.TERM_OF_SERVICE, <IconTerms />),
  getItem('プライバシー・ポリシー', NAVIGATION_PATH.PRIVATE_POLICY, <IconPrivatePolicy />),
  getItem('ヘルプ', NAVIGATION_PATH.ENVIROMENT, <IconEnv />),
];
const CompanyMenuItems: MenuItem[] = [
  getItem('書類', NAVIGATION_PATH.DOCUMENT, <IconDocument />),
  getItem('メンテナンス', 'sub1', <IconSetting />, [
    getItem('ユーザー', NAVIGATION_PATH.USER_MANAGEMENT, <IconUser />),
    getItem('グループ', NAVIGATION_PATH.GROUP_MANAGEMENT, <IconUserGroup />),
    getItem('管理者', NAVIGATION_PATH.ADMIN_MANAGEMENT, <IconAdmin />),
    getItem('推奨環境', NAVIGATION_PATH.NOTIFICATION_MANAGEMENT, <IconNotice />),
  ]),
  // getItem('その他', 'sub2', <IconStar />, [
  //   getItem('パスワード変更', NAVIGATION_PATH.CHANGE_PASSWORD, <IconKey />),
  //   getItem('ログアウト', NAVIGATION_PATH.LOGIN, <IconLogout />),
  // ]),
  getItem('ヘルプ', NAVIGATION_PATH.HELP, <IconHelp />),
];

function LeftNav() {
  const navigate = useNavigate();
  const location = useLocation();
  // const dispatch = useAppDispatch();
  const [activeMenu, setActiveMenu] = useState(NAVIGATION_PATH.DOCUMENT);
  useEffect(() => {
    if (location?.pathname) {
      const locationSplit = location?.pathname.split('/');
      if (locationSplit?.length === 2) {
        const newLocation = locationSplit.join('/');
        setActiveMenu(newLocation);
      } else if (locationSplit?.length > 2) {
        const newLocation = '/' + locationSplit[1];
        setActiveMenu(newLocation);
      } else {
        setActiveMenu(NAVIGATION_PATH.DOCUMENT);
      }
    }
  }, [location]);

  const onClickMenu: MenuProps['onClick'] = e => {
    navigate(e?.key);
  };

  const isAdmin = TokenService.getRoleToken() === ROLE_USER.ADMIN;
  const isCustomer = TokenService.getRoleToken() === ROLE_USER.CUSTOMER;
  const isCompany = TokenService.getRoleToken() === ROLE_USER.COMPANY;
  let items: any;
  if (isAdmin) {
    items = AdminMenuItems;
  } else if (isCustomer) {
    items = CustomerMenuItems;
  } else if (isCompany) {
    items = CompanyMenuItems;
  } else {
    items = [];
  }

  return (
    <div className="left-nav-root">
      <Menu
        selectedKeys={[activeMenu]}
        defaultOpenKeys={['sub1', 'sub2']}
        mode="inline"
        items={items}
        onClick={onClickMenu}
      />
    </div>
  );
}

export default memo(LeftNav);
