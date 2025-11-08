import { join } from 'node:path';
import { defineConfig } from '@umijs/max';
import defaultSettings from './defaultSettings';
import routes from './routes';

const PUBLIC_PATH = '/';

const config: Parameters<typeof defineConfig>[0] = {
  hash: true,
  publicPath: PUBLIC_PATH,
  routes,
  ignoreMomentLocale: true,
  fastRefresh: true,
  model: {},
  initialState: {},
  title: '英歌舞管理后台',
  layout: {
    locale: true,
    ...defaultSettings,
  },
  moment2dayjs: {
    preset: 'antd',
    plugins: ['duration'],
  },
  locale: {
    default: 'zh-CN',
    antd: true,
    baseNavigator: true,
  },
  antd: {
    appConfig: {},
    configProvider: {
      theme: {
        cssVar: true,
      },
    },
  },
  request: {},
  access: {},
  headScripts: [{ src: join(PUBLIC_PATH, 'scripts/loading.js'), async: true }],
  presets: ['umi-presets-pro'],
  openAPI: [],
  mock: false,
  mako: {},
  esbuildMinifyIIFE: true,
  requestRecord: {},
  exportStatic: {},
  define: {
    'process.env.CI': process.env.CI,
  },
};

const umiConfig = defineConfig(config);

export default umiConfig as Record<string, unknown>;
