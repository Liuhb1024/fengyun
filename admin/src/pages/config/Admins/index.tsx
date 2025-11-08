import type { ProFormInstance } from '@ant-design/pro-components';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProForm,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Alert, App, Button, Input, Modal, Space, Tag, Tooltip, Typography } from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import type {
  AdminUser,
  AdminUserCreatePayload,
  AdminUserUpdatePayload,
  PageParams,
} from '@/services/yingge';
import { adminUserAPI } from '@/services/yingge';
import Uploader from '@/components/Uploader';

const roleOptions = [
  { label: '超级管理员', value: 'super_admin' },
  { label: '管理员', value: 'admin' },
];

const roleEnum = {
  super_admin: { text: '超级管理员', status: 'Processing' as const },
  admin: { text: '管理员', status: 'Default' as const },
};

const AdminAccountsPage: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const formRef = useRef<ProFormInstance | null>(null);
  const { initialState } = useModel('@@initialState');
  const canManage = initialState?.currentUser?.role === 'super_admin';
  const { message } = App.useApp();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUser | undefined>();
  const [keyword, setKeyword] = useState('');
  const [resetModal, setResetModal] = useState<{ visible: boolean; user?: AdminUser; password?: string }>({
    visible: false,
  });
  const [customPassword, setCustomPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleSubmit = async (values: AdminUserCreatePayload & AdminUserUpdatePayload) => {
    if (!canManage) return false;
    if (editing) {
      await adminUserAPI.update(editing.id, values as AdminUserUpdatePayload);
      message.success('更新成功');
    } else {
      await adminUserAPI.create(values);
      message.success('新增成功');
    }
    setOpen(false);
    setEditing(undefined);
    actionRef.current?.reload();
    return true;
  };

  const openModal = (record?: AdminUser) => {
    if (!canManage) return;
    setEditing(record);
    setOpen(true);
    setTimeout(() => {
      if (record) {
        formRef.current?.setFieldsValue({
          username: record.username,
          nickname: record.nickname,
          role: record.role,
          is_active: record.is_active,
          avatar: record.avatar,
        });
      } else {
        formRef.current?.setFieldsValue({
          username: undefined,
          nickname: undefined,
          role: 'admin',
          is_active: true,
          avatar: undefined,
          password: undefined,
        });
      }
    }, 0);
  };

  const openResetModal = (record: AdminUser) => {
    if (!canManage) return;
    setResetModal({ visible: true, user: record, password: undefined });
    setCustomPassword('');
  };

  const handleResetConfirm = async () => {
    if (!resetModal.user) return;
    setResetLoading(true);
    try {
      const resp = await adminUserAPI.resetPassword(
        resetModal.user.id,
        customPassword ? { new_password: customPassword } : undefined,
      );
      setResetModal((prev) => ({ ...prev, password: resp.password }));
      message.success('新密码已生成，请妥善保管');
    } finally {
      setResetLoading(false);
    }
  };

  const copyPassword = async () => {
    if (!resetModal.password) return;
    try {
      await navigator.clipboard.writeText(resetModal.password);
      message.success('密码已复制');
    } catch {
      message.warning('无法自动复制，请手动选中密码');
    }
  };

  const closeResetModal = () => {
    setResetModal({ visible: false });
    setCustomPassword('');
  };

  const usernameRules = useMemo(() => {
    const rules: any[] = [{ min: 2, max: 50, message: '长度 2-50 个字符' }];
    if (!editing) {
      rules.unshift({ required: true, message: '请输入用户名' });
    }
    return rules;
  }, [editing]);

  const columns: ProColumns<AdminUser>[] = useMemo(
    () => [
      { title: '用户名', dataIndex: 'username' },
      { title: '昵称', dataIndex: 'nickname' },
      {
        title: '角色',
        dataIndex: 'role',
        valueType: 'select',
        valueEnum: roleEnum,
        render: (_, record) => {
          const key = (record.role as keyof typeof roleEnum) || 'admin';
          return (
            <Tag color={key === 'super_admin' ? 'blue' : 'default'}>
              {roleEnum[key].text}
            </Tag>
          );
        },
      },
      {
        title: '状态',
        dataIndex: 'is_active',
        valueEnum: {
          true: { text: '启用', status: 'Success' },
          false: { text: '禁用', status: 'Default' },
        },
      },
      {
        title: '最后登录',
        dataIndex: 'last_login_at',
        valueType: 'dateTime',
        search: false,
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        valueType: 'dateTime',
        search: false,
      },
      {
        title: '操作',
        valueType: 'option',
        width: 200,
        render: (_, record) => [
          <Space key="actions" size="small">
            <a
              style={{
                color: canManage ? '#1677ff' : 'rgba(0,0,0,0.35)',
                cursor: canManage ? 'pointer' : 'not-allowed',
              }}
              onClick={() => openModal(record)}
            >
              编辑
            </a>
            <Tooltip title="重置后可查看新密码">
              <a
                style={{
                  color: canManage ? '#fa8c16' : 'rgba(0,0,0,0.35)',
                  cursor: canManage ? 'pointer' : 'not-allowed',
                }}
                onClick={() => openResetModal(record)}
              >
                重置/查看密码
              </a>
            </Tooltip>
          </Space>,
        ],
      },
    ],
    [canManage],
  );

  return (
    <PageContainer
      extra={
        <Tag color="blue">仅超级管理员可新增或编辑后台账号，普通管理员仅可查看。</Tag>
      }
    >
      <ProTable<AdminUser, PageParams>
        rowKey="id"
        actionRef={actionRef}
        search={false}
        columns={columns}
        request={(params) => adminUserAPI.list({ ...params, keyword })}
        toolBarRender={() => [
          <Input.Search
            key="search"
            placeholder="搜索用户名 / 昵称"
            allowClear
            onSearch={(val) => {
              setKeyword(val.trim());
              actionRef.current?.reload();
            }}
            onChange={(e) => {
              if (!e.target.value) {
                setKeyword('');
                actionRef.current?.reload();
              }
            }}
            style={{ width: 240 }}
          />,
          <Button key="create" type="primary" disabled={!canManage} onClick={() => openModal()}>
            新增管理员
          </Button>,
        ]}
      />

      <ModalForm<AdminUserCreatePayload & AdminUserUpdatePayload>
        formRef={formRef}
        title={editing ? '编辑管理员' : '新增管理员'}
        open={open}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            setOpen(false);
            setEditing(undefined);
          },
        }}
        onFinish={handleSubmit}
        layout="vertical"
      >
        <ProFormText
          name="username"
          label="用户名"
          disabled={!!editing}
          rules={usernameRules}
        />
        <ProFormText.Password
          name="password"
          label={editing ? '新密码' : '密码'}
          placeholder={editing ? '如需修改请填写新密码' : '请输入账户初始密码'}
          rules={
            editing
              ? [{ min: 6, max: 50, message: '长度 6-50 个字符' }]
              : [
                  { required: true, message: '请输入密码' },
                  { min: 6, max: 50, message: '长度 6-50 个字符' },
                ]
          }
        />
        <ProFormText
          name="nickname"
          label="昵称"
          rules={[{ max: 50, message: '昵称不能超过 50 个字符' }]}
        />
        <ProForm.Item
          name="avatar"
          label="头像"
          valuePropName="value"
          extra="支持 JPG/PNG，文件大小不超过 10MB"
        >
          <Uploader
            category="avatars"
            accept="image/*"
            hint="建议上传正方形头像"
            maxSizeMB={10}
          />
        </ProForm.Item>
        <ProFormSelect
          name="role"
          label="角色"
          options={roleOptions}
          rules={[{ required: true, message: '请选择角色' }]}
        />
        <ProFormSwitch name="is_active" label="是否启用" tooltip="关闭后该账号将无法登录后台" />
      </ModalForm>

      <Modal
        title={`重置密码 - ${resetModal.user?.username || ''}`}
        open={resetModal.visible}
        onCancel={closeResetModal}
        destroyOnClose
        maskClosable={false}
        confirmLoading={resetLoading}
        okText={resetModal.password ? '复制密码并关闭' : '确认重置'}
        onOk={
          resetModal.password
            ? async () => {
                await copyPassword();
                closeResetModal();
              }
            : handleResetConfirm
        }
      >
        {!resetModal.password ? (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Alert
              type="info"
              showIcon
              message="可自定义新密码，也可留空由系统生成随机密码。密码只会显示一次，请及时记录。"
            />
            <Input.Password
              value={customPassword}
              placeholder="可选：输入自定义新密码"
              onChange={(e) => setCustomPassword(e.target.value)}
            />
          </Space>
        ) : (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Alert
              type="success"
              showIcon
              message="新密码已生成"
              description="复制下方密码并告知对应管理员，关闭窗口后将无法再次查看。"
            />
            <Typography.Paragraph copyable style={{ fontSize: 18, textAlign: 'center' }}>
              {resetModal.password}
            </Typography.Paragraph>
          </Space>
        )}
      </Modal>
    </PageContainer>
  );
};

export default AdminAccountsPage;
