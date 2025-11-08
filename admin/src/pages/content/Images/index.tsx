import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProForm,
  ProFormDatePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';
import type { ImageItem } from '@/services/yingge';
import { imageAPI } from '@/services/yingge';
import Uploader from '@/components/Uploader';

const categoryOptions = [
  { label: '演出现场', value: 'performance' },
  { label: '排练花絮', value: 'rehearsal' },
  { label: '人物特写', value: 'portrait' },
  { label: '其他', value: 'other' },
];

const categoryEnum = categoryOptions.reduce<Record<string, { text: string }>>((acc, cur) => {
  acc[cur.value] = { text: cur.label };
  return acc;
}, {});

const ImageLibrary: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ImageItem | undefined>();

  const submit = async (values: Partial<ImageItem>) => {
    const payload = {
      ...values,
      shot_date: values.shot_date || undefined,
    };
    if (editing) {
      await imageAPI.update(editing.id, payload);
    } else {
      await imageAPI.create(payload);
    }
    setOpen(false);
    setEditing(undefined);
    actionRef.current?.reload();
  };

  const columns: ProColumns<ImageItem>[] = [
    {
      title: '封面',
      dataIndex: 'thumbnail_url',
      valueType: 'image',
      search: false,
      width: 80,
    },
    { title: '标题', dataIndex: 'title_zh' },
    { title: '分类', dataIndex: 'category', valueType: 'select', valueEnum: categoryEnum },
    {
      title: '拍摄日期',
      dataIndex: 'shot_date',
      valueType: 'date',
    },
    {
      title: '首页展示',
      dataIndex: 'is_homepage',
      valueType: 'select',
      valueEnum: {
        true: { text: '是' },
        false: { text: '否' },
      },
    },
    {
      title: '浏览次数',
      dataIndex: 'view_count',
      search: false,
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
        <Popconfirm
          key='delete'
          title="确认删除该图片？"
          onConfirm={async () => {
            await imageAPI.remove(record.id);
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
      <ProTable<ImageItem>
        rowKey="id"
        actionRef={actionRef}
        search={false}
        columns={columns}
        request={(params) => imageAPI.list(params)}
        toolBarRender={() => [
          <Button
            type="primary"
            key="create"
            onClick={() => {
              setEditing(undefined);
              setOpen(true);
            }}
          >
            新增图片
          </Button>,
        ]}
      />

      <ModalForm<ImageItem>
        title={editing ? '编辑图片' : '新增图片'}
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
          label="原图"
          valuePropName="value"
          rules={[{ required: true, message: '请上传原图' }]}
          extra="建议大于 1920px，大小 ≤ 20MB"
        >
          <Uploader category="images" accept="image/*" maxSizeMB={20} hint="支持 jpg/png/webp" />
        </ProForm.Item>
        <ProForm.Item
          name="thumbnail_url"
          label="缩略图"
          valuePropName="value"
          extra="可选，大小 ≤ 5MB，如留空可在前端生成"
        >
          <Uploader category="images" accept="image/*" maxSizeMB={5} hint="建议 400×400px" />
        </ProForm.Item>
        <ProFormSelect name="category" label="分类" options={categoryOptions} allowClear />
        <ProFormDatePicker name="shot_date" label="拍摄日期" />
        <ProFormDigit name="view_count" label="浏览次数" min={0} />
        <ProFormSwitch name="is_homepage" label="首页展示" />
      </ModalForm>
    </PageContainer>
  );
};

export default ImageLibrary;
