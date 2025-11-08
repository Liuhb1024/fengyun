import { LinkOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import type { MenuDataItem, Settings as LayoutSettings } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import type { RequestConfig, RunTimeLayoutConfig } from '@umijs/max';
import { history, Link } from '@umijs/max';
import { Tooltip } from 'antd';
import React from 'react';
import {
  AvatarDropdown,
  AvatarName,
  Footer,
  Question,
  SelectLang,
} from '@/components';
import { authAPI } from '@/services/yingge';
import { clearToken, getToken } from '@/utils/token';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
import '@ant-design/v5-patch-for-react-19';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';
const adminMenuAllowRoots = ['/dashboard', '/content'];

const isPathAllowedForAdmin = (path: string) =>
  adminMenuAllowRoots.some((allow) => path === allow || path.startsWith(`${allow}/`));

const filterMenusForAdmin = (menus?: MenuDataItem[]): MenuDataItem[] => {
  const list = menus ?? [];
  return list
    .map((item) => {
      const filteredChildren = filterMenusForAdmin(item.children as MenuDataItem[] | undefined);
      const allowSelf = item.path ? isPathAllowedForAdmin(item.path) : filteredChildren.length > 0;
      if (!allowSelf && filteredChildren.length === 0) {
        return null;
      }
      return {
        ...item,
        children: filteredChildren.length > 0 ? filteredChildren : undefined,
      };
    })
    .filter(Boolean) as MenuDataItem[];
};

const attachMenuHelp = (menus?: MenuDataItem[]): MenuDataItem[] => {
  const list = menus ?? [];
  return list.map((item) => {
    const children = attachMenuHelp(item.children as MenuDataItem[] | undefined);
    const help = menuHelpMap[item.path || ''];
    return {
      ...item,
      extra: help ? (
        <Tooltip title={help} placement="right">
          <QuestionCircleOutlined
            style={{ fontSize: 14, color: 'rgba(0,0,0,0.35)' }}
            onClick={(event) => event.stopPropagation()}
          />
        </Tooltip>
      ) : item.extra,
      children: children.length > 0 ? children : undefined,
    };
  });
};

const menuHelpMap: Record<string, string> = {
  '/dashboard': '查看核心统计、热点内容与操作日志概览。',
  '/content/carousels': '维护首页轮播 Banner 图与跳转链接。',
  '/content/images': '管理图片素材库，可设置是否在首页展示。',
  '/content/videos': '上传或维护视频素材信息。',
  '/content/audios': '管理音频素材，填写播放链接等信息。',
  '/content/articles': '发布或维护图文资讯内容。',
  '/content/members': '维护成员介绍及排序，用于前台展示。',
  '/config/navigation': '配置前台导航菜单的层级、显示状态与链接。',
  '/config/seo': '为各页面设置 SEO 相关信息（标题、描述等）。',
  '/config/system': '维护站点基本信息、首页文案及统计数据。',
  '/config/admins': '新增/编辑后台管理员账号，重置或查看密码。',
  '/stats/overview': '查看运营相关统计数据与趋势。',
  '/stats/logs': '审阅后台操作日志，跟踪重要行为。',
};

export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    if (!getToken()) {
      return undefined;
    }
    try {
      const user = await authAPI.me();
      return user as API.CurrentUser;
    } catch (error) {
      clearToken();
      history.push(loginPath);
    }
    return undefined;
  };

  const { location } = history;
  if (location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  const role = initialState?.currentUser?.role;
  const isSuperAdmin = role === 'super_admin';
  const isBasicAdmin = role === 'admin';
  const adminWhitelist = ['/account/change-password'];
  return {
    actionsRender: () => [
      <Question key="doc" />,
      <SelectLang key="SelectLang" />,
    ],
    avatarProps: {
      src: initialState?.currentUser?.avatar,
      title: <AvatarName />,
      render: (_, avatarChildren) => <AvatarDropdown>{avatarChildren}</AvatarDropdown>,
    },
    waterMarkProps: {
      content: initialState?.currentUser?.name || initialState?.currentUser?.username,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      const hasToken = !!getToken();
      if (!hasToken && location.pathname !== loginPath) {
        history.push(loginPath);
        return;
      }
      if (!initialState?.currentUser && location.pathname !== loginPath && hasToken) {
        // 等待用户信息加载，无需强制跳转
        return;
      }
      if (
        isBasicAdmin &&
        location.pathname !== loginPath &&
        !adminWhitelist.includes(location.pathname) &&
        !isPathAllowedForAdmin(location.pathname)
      ) {
        if (location.pathname !== '/dashboard') {
          history.push('/dashboard');
        }
      }
    },
    bgLayoutImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
    ],
    links: isDev
      ? [
          <Link key="api-doc" to="/docs" target="_blank">
            <LinkOutlined />
            <span>接口文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    menuDataRender: (menus) => {
      const filtered = isBasicAdmin ? filterMenusForAdmin(menus) : menus ?? [];
      return attachMenuHelp(filtered);
    },
      menu: {
        locale: false,
      },
    childrenRender: (children) => (
      <>
        {children}
        <SettingDrawer
          disableUrlParams
          enableDarkTheme
          settings={initialState?.settings}
          onSettingChange={(settings) => {
            setInitialState((preInitialState) => ({
              ...preInitialState,
              settings,
            }));
          }}
        />
      </>
    ),
    ...initialState?.settings,
  };
};

export const request: RequestConfig = {
  ...errorConfig,
};
