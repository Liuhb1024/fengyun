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
import React, { useRef, useState } from 'react';
import type { AudioItem } from '@/services/yingge';
import { audioAPI } from '@/services/yingge';
import Uploader from '@/components/Uploader';

const AudioLibrary: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AudioItem | undefined>();

  const submit = async (values: Partial<AudioItem>) => {
    if (editing) {
      await audioAPI.update(editing.id, values);
    } else {
      await audioAPI.create(values);
    }
    setOpen(false);
    setEditing(undefined);
    actionRef.current?.reload();
  };

  const columns: ProColumns<AudioItem>[] = [
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
          title="确认删除该音频？"
          onConfirm={async () => {
            await audioAPI.remove(record.id);
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
      <ProTable<AudioItem>
        rowKey="id"
        actionRef={actionRef}
        search={false}
        columns={columns}
        request={(params) => audioAPI.list(params)}
        toolBarRender={() => [
          <Button
            type="primary"
            key="create"
            onClick={() => {
              setEditing(undefined);
              setOpen(true);
            }}
          >
            新增音频
          </Button>,
        ]}
      />

      <ModalForm<AudioItem>
        title={editing ? '编辑音频' : '新增音频'}
        open={open}
        initialValues={editing}
        onOpenChange={setOpen}
        onFinish={async (values) => {
          await submit(values);
          return true;
        }}
      >
        <ProFormText name="title_zh" label="标题" rules={[{ required: true }]} />
        <ProForm.Item
          name="url"
          label="音频文件"
          valuePropName="value"
          rules={[{ required: true, message: '请上传音频文件' }]}
          extra="支持 MP3/M4A/WAV，≤ 100MB"
        >
          <Uploader category="audios" accept="audio/*" maxSizeMB={100} />
        </ProForm.Item>
        <ProForm.Item
          name="cover_url"
          label="封面图"
          valuePropName="value"
          extra="可选，建议 600×600px"
        >
          <Uploader category="audios" accept="image/*" maxSizeMB={10} />
        </ProForm.Item>
        <ProFormText name="category" label="分类" />
        <ProFormDigit name="duration" label="时长(秒)" min={0} />
      </ModalForm>
    </PageContainer>
  );
};

export default AudioLibrary;
