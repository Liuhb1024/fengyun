import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProFormDigit,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';
import type { VideoItem } from '@/services/yingge';
import { videoAPI } from '@/services/yingge';

const VideoLibrary: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<VideoItem | undefined>();

  const submit = async (values: Partial<VideoItem>) => {
    if (editing) {
      await videoAPI.update(editing.id, values);
    } else {
      await videoAPI.create(values);
    }
    setOpen(false);
    setEditing(undefined);
    actionRef.current?.reload();
  };

  const columns: ProColumns<VideoItem>[] = [
    { title: '标题', dataIndex: 'title_zh' },
    { title: '分类', dataIndex: 'category' },
    { title: '时长(秒)', dataIndex: 'duration', search: false },
    { title: '播放次数', dataIndex: 'play_count', search: false },
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
          title="确认删除该视频？"
          onConfirm={async () => {
            await videoAPI.remove(record.id);
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
      <ProTable<VideoItem>
        rowKey="id"
        actionRef={actionRef}
        search={false}
        columns={columns}
        request={(params) => videoAPI.list(params)}
        toolBarRender={() => [
          <Button
            type="primary"
            key="create"
            onClick={() => {
              setEditing(undefined);
              setOpen(true);
            }}
          >
            新增视频
          </Button>,
        ]}
      />

      <ModalForm<VideoItem>
        title={editing ? '编辑视频' : '新增视频'}
        open={open}
        initialValues={editing}
        onOpenChange={setOpen}
        onFinish={async (values) => {
          await submit(values);
          return true;
        }}
      >
        <ProFormText name="title_zh" label="标题" rules={[{ required: true }]} />
        <ProFormText name="url" label="播放地址" rules={[{ required: true }]} />
        <ProFormText name="cover_url" label="封面地址" />
        <ProFormText name="category" label="分类" />
        <ProFormDigit name="duration" label="时长(秒)" min={0} />
      </ModalForm>
    </PageContainer>
  );
};

export default VideoLibrary;
