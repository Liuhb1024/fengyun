import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { history, useModel } from '@umijs/max';
import { App, Typography } from 'antd';
import React from 'react';
import { Footer } from '@/components';
import { authAPI } from '@/services/yingge';
import { setToken } from '@/utils/token';
import styles from './index.less';

const Login: React.FC = () => {
  const { setInitialState } = useModel('@@initialState');
  const { message } = App.useApp();

  const handleSubmit = async (values: { username: string; password: string }) => {
    try {
      const result = await authAPI.login(values);
      setToken(result.access_token);
      const user = await authAPI.me();
      setInitialState((s) => ({
        ...s,
        currentUser: user,
      }));
      message.success('登录成功');
      const { search, pathname } = history.location;
      const urlParams = new URL(window.location.href).searchParams;
      const redirect = urlParams.get('redirect');
      const target = redirect || (pathname === '/user/login' ? '/' : `${pathname}${search}`);
      history.push(target);
    } catch (error) {
      message.error('登录失败，请检查账号密码');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src="/logo.svg" />}
          title="英歌舞管理后台"
          subTitle="Chaoshan Yingge Admin"
          onFinish={handleSubmit}
        >
          <ProFormText
            name="username"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined />,
            }}
            placeholder="用户名：admin"
            rules={[{ required: true, message: '请输入用户名' }]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined />,
            }}
            placeholder="密码：admin123456"
            rules={[{ required: true, message: '请输入密码' }]}
          />
          <Typography.Paragraph type="secondary" className={styles.tip}>
            使用默认管理员账号登录后即可修改密码。
          </Typography.Paragraph>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;

