import { CloseOutlined, LinkOutlined, MoonOutlined, QuestionCircleOutlined, SunOutlined } from '@ant-design/icons';
import type { MenuDataItem, Settings as LayoutSettings } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import type { RequestConfig, RunTimeLayoutConfig } from '@umijs/max';
import { history, Link } from '@umijs/max';
import { Button, FloatButton } from 'antd';
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

const buildMenuTip = (portal: string, usage: string) => (
  <div style={{ maxWidth: 260 }}>
    <div>
      <strong>门户区块：</strong>
      {portal}
    </div>
    <div>
      <strong>使用说明：</strong>
      {usage}
    </div>
  </div>
);

const menuGuideItems = [
  {
    title: '仪表盘',
    portal: '门户首页 - 运营概览首屏',
    usage: '登录后第一时间查看关键指标、待办与预警。',
  },
  {
    title: '轮播图',
    portal: '门户首页顶部 Banner',
    usage: '维护主视觉素材与跳转链接，建议最多 5 条。',
  },
  {
    title: '图片库',
    portal: '门户多处图片模块',
    usage: '集中管理配图，供资讯、卡片等模块复用。',
  },
  {
    title: '视频/音频库',
    portal: '案例视频、播客组件',
    usage: '上传到 COS 或外链，注意封面/分类与大小限制。',
  },
  {
    title: '文章资讯',
    portal: '门户新闻动态列表与详情',
    usage: '创建/发布稿件，可设置推荐位与展示时间。',
  },
  {
    title: '成员故事',
    portal: '团队/合作伙伴展示区',
    usage: '完善头像、职务、简介，开启后即展示。',
  },
  {
    title: '重要节点',
    portal: '门户时间轴 / 历史节点',
    usage: '记录队伍里程碑，设置日期、地点与重点标记，用于前端日历展示。',
  },
  {
    title: '导航配置',
    portal: '门户头部与底部导航',
    usage: '自定义层级、排序及站内/外跳转，保存即生效。',
  },
  {
    title: 'SEO/系统配置',
    portal: 'SEO 元信息与页脚内容',
    usage: '维护 Title、Description、联系方式、统计脚本等。',
  },
  {
    title: '管理员账号',
    portal: '后台账号与权限',
    usage: '仅超级管理员可操作，支持新增、禁用与重置密码。',
  },
  {
    title: '运营概览/日志',
    portal: '数据看板与操作审计',
    usage: '关注内容表现趋势并追踪后台操作行为。',
  },
];

const ThemeToggleButton: React.FC<{
  settings?: Partial<LayoutSettings>;
  setInitialState: React.Dispatch<React.SetStateAction<any>>;
}> = ({ settings, setInitialState }) => {
  const isDark = settings?.navTheme === 'realDark';
  const toggleTheme = () => {
    setInitialState((prev: any) => ({
      ...prev,
      settings: {
        ...prev?.settings,
        navTheme: isDark ? 'light' : 'realDark',
        colorWeak: false,
      },
    }));
  };
  return (
    <FloatButton
      icon={isDark ? <SunOutlined style={{ fontSize: 16 }} /> : <MoonOutlined style={{ fontSize: 16 }} />}
      tooltip={isDark ? '切换到亮色模式' : '切换到暗夜模式'}
      style={{ right: 24, bottom: 200, width: 42, height: 42 }}
      shape="circle"
      type={isDark ? 'default' : 'primary'}
      onClick={toggleTheme}
    />
  );
};

const HelpGuideCard: React.FC = () => {
  const [collapsed, setCollapsed] = React.useState(true);

  if (collapsed) {
    return (
      <FloatButton
        icon={<QuestionCircleOutlined style={{ fontSize: 16 }} />}
        type="primary"
        shape="circle"
        style={{ right: 24, bottom: 120, width: 42, height: 42 }}
        onClick={() => setCollapsed(false)}
      />
    );
  }

  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'transparent',
          zIndex: 999,
        }}
        onClick={() => setCollapsed(true)}
      />
      <div
        style={{
          position: 'fixed',
          right: 24,
          bottom: 120,
          width: 340,
          maxHeight: '65vh',
          overflowY: 'auto',
          zIndex: 1000,
          background: '#fff',
          boxShadow: '0 12px 24px rgba(15,35,95,0.18)',
          borderRadius: 12,
          padding: 18,
          border: '1px solid rgba(0,0,0,0.05)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}
        >
          <div style={{ fontWeight: 600, fontSize: 16 }}>后台操作指南</div>
          <Button
            type="text"
            size="small"
            icon={<CloseOutlined />}
            onClick={() => setCollapsed(true)}
          />
        </div>
        {menuGuideItems.map((item) => (
          <div
            key={item.title}
            style={{
              marginBottom: 12,
              paddingBottom: 12,
              borderBottom: '1px solid rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ fontWeight: 500, marginBottom: 4 }}>{item.title}</div>
            <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.65)' }}>
              <strong>门户区块：</strong>
              {item.portal}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.65)' }}>
              <strong>使用说明：</strong>
              {item.usage}
            </div>
          </div>
        ))}
        <Button block type="primary" onClick={() => setCollapsed(true)}>
          收起面板
        </Button>
      </div>
    </>
  );
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
        // 绛夊緟鐢ㄦ埛淇℃伅鍔犺浇锛屾棤闇€寮哄埗璺宠浆
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
    menuDataRender: (menus) => (isBasicAdmin ? filterMenusForAdmin(menus) : menus ?? []),
    menu: {
      locale: false,
    },
    childrenRender: (children) => (
      <>
        {children}
        <ThemeToggleButton settings={initialState?.settings} setInitialState={setInitialState} />
        <HelpGuideCard />
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
