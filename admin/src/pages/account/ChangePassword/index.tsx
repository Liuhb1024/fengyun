import { PageContainer, ProCard, ProForm, ProFormText } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { App } from 'antd';
import React from 'react';
import { authAPI } from '@/services/yingge';
import { clearToken } from '@/utils/token';

const ChangePasswordPage: React.FC = () => {
  const { message } = App.useApp();

  return (
    <PageContainer>
      <ProCard title="修改密码">
        <ProForm
          layout="vertical"
          onFinish={async (values) => {
            if (values.new_password !== values.confirm_password) {
              message.error('两次输入的新密码不一致');
              return false;
            }
            await authAPI.changePassword({
              old_password: values.old_password,
              new_password: values.new_password,
            });
            message.success('密码修改成功，请重新登录');
            clearToken();
            history.push('/user/login');
            return true;
          }}
        >
          <ProFormText.Password
            name="old_password"
            label="当前密码"
            rules={[{ required: true, message: '请输入当前密码' }]}
          />
          <ProFormText.Password
            name="new_password"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, max: 50, message: '长度 6-50 个字符' },
            ]}
          />
          <ProFormText.Password
            name="confirm_password"
            label="确认新密码"
            rules={[{ required: true, message: '请再次输入新密码' }]}
          />
        </ProForm>
      </ProCard>
    </PageContainer>
  );
};

export default ChangePasswordPage;
