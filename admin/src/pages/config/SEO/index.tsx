import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';
import type { SEOItem } from '@/services/yingge';
import { seoAPI } from '@/services/yingge';

const SEOPage: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<SEOItem | undefined>();

  const submit = async (values: Partial<SEOItem>) => {
    if (editing) {
      await seoAPI.update(editing.id, values);
    } else {
      await seoAPI.create(values);
    }
    setOpen(false);
    setEditing(undefined);
    actionRef.current?.reload();
  };

  const columns: ProColumns<SEOItem>[] = [
    { title: '页面标识', dataIndex: 'page_key' },
    { title: '标题', dataIndex: 'title_zh' },
    { title: '描述', dataIndex: 'description_zh', ellipsis: true },
    { title: '关键词', dataIndex: 'keywords_zh', ellipsis: true },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="edit"
          onClick={() => {
            setEditing(record);
            setOpen(true);
          }}
        >
          编辑
        </a>,
        <Popconfirm
          key="delete"
          title="确定删除该 SEO 配置？"
          onConfirm={async () => {
            await seoAPI.remove(record.id);
            actionRef.current?.reload();
          }}
        >
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<SEOItem>
        rowKey="id"
        actionRef={actionRef}
        search={false}
        request={async () => ({
          data: await seoAPI.list(),
          success: true,
        })}
        columns={columns}
        toolBarRender={() => [
          <Button
            type="primary"
            key="create"
            onClick={() => {
              setEditing(undefined);
              setOpen(true);
            }}
          >
            新增配置
          </Button>,
        ]}
      />

      <ModalForm<SEOItem>
        title={editing ? '编辑 SEO 配置' : '新增 SEO 配置'}
        open={open}
        initialValues={editing}
        onOpenChange={setOpen}
        onFinish={async (values) => {
          await submit(values);
          return true;
        }}
      >
        <ProFormText
          name="page_key"
          label="页面 Key"
          rules={[{ required: true }]}
          disabled={!!editing}
        />
        <ProFormText name="title_zh" label="标题" />
        <ProFormTextArea name="description_zh" label="描述" />
        <ProFormText name="keywords_zh" label="关键词" />
      </ModalForm>
    </PageContainer>
  );
};

export default SEOPage;

