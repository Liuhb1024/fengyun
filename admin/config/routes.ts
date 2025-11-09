/**
 * @name umi 路由配置
 * @doc https://umijs.org/docs/guides/routes
 */
const routes = [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login/index',
      },
    ],
  },
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    name: '仪表盘',
    icon: 'dashboard',
    path: '/dashboard',
    component: './dashboard/Overview/index',
  },
  {
    name: '内容管理',
    icon: 'appstore',
    path: '/content',
    routes: [
      {
        name: '轮播图',
        path: '/content/carousels',
        component: './content/Carousels/index',
      },
      {
        name: '图片库',
        path: '/content/images',
        component: './content/Images/index',
      },
      {
        name: '视频库',
        path: '/content/videos',
        component: './content/Videos/index',
      },
      {
        name: '音频库',
        path: '/content/audios',
        component: './content/Audios/index',
      },
      {
        name: '重要节点',
        path: '/content/milestones',
        component: './content/Milestones/index',
      },
      {
        name: '文章资讯',
        path: '/content/articles',
        component: './content/Articles/index',
      },
      {
        name: '成员故事',
        path: '/content/members',
        component: './content/Members/index',
      },
    ],
  },
  {
    name: '配置管理',
    icon: 'setting',
    path: '/config',
    routes: [
      {
        name: '导航配置',
        path: '/config/navigation',
        component: './config/Navigation/index',
      },
      {
        name: 'SEO 配置',
        path: '/config/seo',
        component: './config/SEO/index',
      },
      {
        name: '系统配置',
        path: '/config/system',
        component: './config/System/index',
      },
      {
        name: '管理员账号',
        path: '/config/admins',
        component: './config/Admins/index',
      },
    ],
  },
  {
    name: '统计分析',
    icon: 'lineChart',
    path: '/stats',
    routes: [
      {
        name: '运营概览',
        path: '/stats/overview',
        component: './dashboard/Overview/index',
      },
      {
        name: '操作日志',
        path: '/stats/logs',
        component: './stats/Logs/index',
      },
    ],
  },
  {
    path: '/account/change-password',
    component: './account/ChangePassword/index',
    name: '修改密码',
    hideInMenu: true,
  },
  {
    path: '/*',
    layout: false,
    component: './404',
  },
];

export default routes;
