import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';
import type { ArticleItem } from '@/services/yingge';
import { articleAPI } from '@/services/yingge';

const ArticlePage: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ArticleItem | undefined>();

  const submit = async (values: Partial<ArticleItem>) => {
    if (editing) {
      await articleAPI.update(editing.id, values);
    } else {
      await articleAPI.create(values);
    }
    setOpen(false);
    setEditing(undefined);
    actionRef.current?.reload();
  };

  const columns: ProColumns<ArticleItem>[] = [
    { title: '标题', dataIndex: 'title_zh' },
    { title: '分类', dataIndex: 'category' },
    { title: '发布时间', dataIndex: 'publish_at', valueType: 'dateTime' },
    { title: '浏览量', dataIndex: 'view_count', search: false },
    {
      title: '状态',
      dataIndex: 'is_published',
      valueType: 'select',
      valueEnum: {
        true: { text: '已发布' },
        false: { text: '草稿' },
      },
    },
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
        !record.is_published && (
          <a
            key="publish"
            onClick={async () => {
              await articleAPI.publish(record.id);
              actionRef.current?.reload();
            }}
          >
            发布
          </a>
        ),
        <Popconfirm
          key="delete"
          title="确认删除该文章？"
          onConfirm={async () => {
            await articleAPI.remove(record.id);
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
      <ProTable<ArticleItem>
        rowKey="id"
        actionRef={actionRef}
        columns={columns}
        request={(params) => articleAPI.list(params)}
        toolBarRender={() => [
          <Button
            type="primary"
            key="create"
            onClick={() => {
              setEditing(undefined);
              setOpen(true);
            }}
          >
            新建文章
          </Button>,
        ]}
      />

      <ModalForm<ArticleItem>
        title={editing ? '编辑文章' : '新建文章'}
        open={open}
        initialValues={editing}
        onOpenChange={setOpen}
        width={640}
        onFinish={async (values) => {
          await submit(values);
          return true;
        }}
      >
        <ProFormText name="title_zh" label="标题" rules={[{ required: true }]} />
        <ProFormSelect
          name="category"
          label="分类"
          valueEnum={{
            动态: '动态',
            媒体报道: '媒体报道',
            演出预告: '演出预告',
            文化: '文化',
          }}
        />
        <ProFormText name="cover_url" label="封面地址" />
        <ProFormTextArea name="summary_zh" label="摘要" />
        <ProFormTextArea name="content_zh" label="正文" rules={[{ required: true }]} />
        <ProFormSwitch name="is_published" label="立即发布" />
      </ModalForm>
    </PageContainer>
  );
};

export default ArticlePage;
