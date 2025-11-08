import type { ProFormInstance } from '@ant-design/pro-components';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProForm,
  ProFormDigit,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Popconfirm } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import type { VideoItem } from '@/services/yingge';
import { videoAPI } from '@/services/yingge';
import Uploader from '@/components/Uploader';

const VideoLibrary: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<VideoItem | undefined>();
  const formRef = useRef<ProFormInstance<VideoItem>>(null);

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

  useEffect(() => {
    if (open) {
      if (editing) {
        formRef.current?.setFieldsValue(editing);
      } else {
        formRef.current?.resetFields();
      }
    }
  }, [open, editing]);

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
        formRef={formRef}
        open={open}
        onOpenChange={(visible) => {
          setOpen(visible);
          if (!visible) {
            setEditing(undefined);
          }
        }}
        onFinish={async (values) => {
          await submit(values);
          return true;
        }}
      >
        <ProFormText name="title_zh" label="标题" rules={[{ required: true }]} />
        <ProForm.Item
          name="url"
          label="视频文件"
          valuePropName="value"
          rules={[{ required: true, message: '请上传视频文件' }]}
          extra="支持 MP4/MOV，≤ 500MB"
        >
          <Uploader category="videos" accept="video/*" maxSizeMB={500} hint="上传后可直接播放" />
        </ProForm.Item>
        <ProForm.Item
          name="cover_url"
          label="封面图"
          valuePropName="value"
          extra="可选，建议 1280×720px"
        >
          <Uploader category="videos" accept="image/*" maxSizeMB={10} />
        </ProForm.Item>
        <ProFormText name="category" label="分类" />
        <ProFormDigit name="duration" label="时长(秒)" min={0} />
      </ModalForm>
    </PageContainer>
  );
};

export default VideoLibrary;
