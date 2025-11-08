import type { ProFormInstance } from '@ant-design/pro-components';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProFormDigit,
  ProFormSwitch,
  ProFormText,
  ProTable,
  ProForm,
} from '@ant-design/pro-components';
import { Button, Image, Popconfirm } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import type { CarouselItem } from '@/services/yingge';
import { carouselAPI } from '@/services/yingge';
import Uploader from '@/components/Uploader';

const CarouselPage: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CarouselItem | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<ProFormInstance<CarouselItem>>(null);

  useEffect(() => {
    if (modalOpen) {
      if (editing) {
        formRef.current?.setFieldsValue(editing);
      } else {
        formRef.current?.resetFields();
      }
    }
  }, [modalOpen, editing]);

  const handleSubmit = async (values: Partial<CarouselItem>) => {
    setSubmitting(true);
    try {
      if (editing) {
        await carouselAPI.update(editing.id, values);
      } else {
        await carouselAPI.create(values);
      }
      setModalOpen(false);
      setEditing(undefined);
      actionRef.current?.reload();
    } finally {
      setSubmitting(false);
    }
  };

  const columns: ProColumns<CarouselItem>[] = [
    {
      title: '预览',
      dataIndex: 'image_url',
      render: (_: any, record: CarouselItem) => <Image src={record.image_url} width={80} />,
      search: false,
    },
    { title: '标题', dataIndex: 'title_zh' },
    { title: '排序', dataIndex: 'sort_order', width: 80 },
    {
      title: '状态',
      dataIndex: 'is_active',
      valueType: 'select',
      valueEnum: {
        true: { text: '启用' },
        false: { text: '禁用' },
      },
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record: CarouselItem) => [
        <a
          key="edit"
          onClick={() => {
            setEditing(record);
            setModalOpen(true);
          }}
        >
          编辑
        </a>,
        <Popconfirm
          key="delete"
          title="确定删除该轮播图吗？"
          onConfirm={async () => {
            await carouselAPI.remove(record.id);
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
      <ProTable<CarouselItem>
        rowKey="id"
        columns={columns}
        actionRef={actionRef}
        search={false}
        toolBarRender={() => [
          <Button
            type="primary"
            key="create"
            onClick={() => {
              setEditing(undefined);
              setModalOpen(true);
            }}
          >
            新建轮播图
          </Button>,
        ]}
        request={(params) => carouselAPI.list(params)}
      />

      <ModalForm<CarouselItem>
        title={editing ? '编辑轮播图' : '新增轮播图'}
        formRef={formRef}
        open={modalOpen}
        onOpenChange={(visible) => {
          setModalOpen(visible);
          if (!visible) {
            setEditing(undefined);
          }
        }}
        submitter={{
          submitButtonProps: { loading: submitting },
        }}
        onFinish={async (values) => {
          await handleSubmit(values);
          return true;
        }}
      >
        <ProForm.Item
          name="image_url"
          label="轮播图片"
          rules={[{ required: true, message: '请上传轮播图片' }]}
          valuePropName="value"
          extra="建议 1920×600px 以上，大小不超过 15MB"
        >
          <Uploader
            category="carousels"
            accept="image/*"
            maxSizeMB={15}
            hint="支持 jpg/png/webp"
          />
        </ProForm.Item>
        <ProFormText name="title_zh" label="中文标题" />
        <ProFormText name="link_url" label="跳转链接" />
        <ProFormDigit name="sort_order" label="排序" min={0} />
        <ProFormSwitch label="是否启用" name="is_active" />
      </ModalForm>
    </PageContainer>
  );
};

export default CarouselPage;
