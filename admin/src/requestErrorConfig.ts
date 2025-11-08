import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import { history } from '@umijs/max';
import { message, notification } from 'antd';
import { clearToken, getApiBaseUrl, getToken } from '@/utils/token';

const LOGIN_PATH = '/user/login';

interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export const errorConfig: RequestConfig = {
  baseURL: getApiBaseUrl(),
  errorConfig: {
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      if (error?.response) {
        const { data, status } = error.response as { data?: ApiResponse; status: number };
        const msg = data?.message || `请求失败，状态码：${status}`;

        if (status === 401) {
          clearToken();
          if (history.location.pathname !== LOGIN_PATH) {
            history.push(LOGIN_PATH);
          }
        }
        notification.error({ message: '请求错误', description: msg });
      } else {
        notification.error({ message: '网络异常', description: '无法连接服务器，请稍后再试。' });
      }
    },
  },
  requestInterceptors: [
    [
      (config: RequestOptions) => {
        const token = getToken();
        if (!token) {
          return config;
        }
        return {
          ...config,
          headers: {
            ...(config.headers || {}),
            Authorization: `Bearer ${token}`,
          },
        };
      },
    ],
  ],
  responseInterceptors: [
    (response) => {
      const { data } = response as { data: ApiResponse };
      if (data?.code && data.code !== 200) {
        message.error(data.message || '请求失败');
        throw new Error(data.message || 'Request Error');
      }
      return response;
    },
  ],
};
