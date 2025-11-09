import type { ProColumns, ProFormInstance } from '@ant-design/pro-components';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProForm,
  ProFormDatePicker,
  ProFormDigit,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Image, Popconfirm, Tag } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import type { MilestoneItem } from '@/services/yingge';
import { milestoneAPI } from '@/services/yingge';
import Uploader from '@/components/Uploader';

const MilestonePage: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const formRef = useRef<ProFormInstance<any>>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState<MilestoneItem | undefined>();

  useEffect(() => {
    if (modalOpen) {
      if (editing) {
        formRef.current?.setFieldsValue({
          ...editing,
          event_date: dayjs(editing.event_date),
        });
      } else {
        formRef.current?.resetFields();
      }
    }
  }, [modalOpen, editing]);

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        event_date: dayjs(values.event_date).format('YYYY-MM-DD'),
      };
      if (editing) {
        await milestoneAPI.update(editing.id, payload);
      } else {
        await milestoneAPI.create(payload);
      }
      setModalOpen(false);
      setEditing(undefined);
      actionRef.current?.reload();
    } finally {
      setSubmitting(false);
    }
  };

  const columns: ProColumns<MilestoneItem>[] = [
    { title: '事件标题', dataIndex: 'title', ellipsis: true },
    {
      title: '日期',
      dataIndex: 'event_date',
      valueType: 'date',
    },
    { title: '地点', dataIndex: 'location' },
    {
      title: '重点',
      dataIndex: 'highlight',
      valueType: 'select',
      valueEnum: {
        true: { text: '重点' },
        false: { text: '普通' },
      },
      render: (_, record) => (record.highlight ? <Tag color="gold">重点</Tag> : <Tag>普通</Tag>),
    },
    { title: '排序', dataIndex: 'sort_order', width: 80, search: false },
    {
      title: '配图',
      dataIndex: 'cover_url',
      search: false,
      render: (_, record) =>
        record.cover_url ? <Image src={record.cover_url} width={72} preview={false} /> : '—',
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => [
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
          title="确定删除该里程碑吗？"
          onConfirm={async () => {
            await milestoneAPI.remove(record.id);
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
      <ProTable<MilestoneItem>
        rowKey="id"
        columns={columns}
        search={false}
        actionRef={actionRef}
        toolBarRender={() => [
          <Button
            type="primary"
            key="new"
            onClick={() => {
              setEditing(undefined);
              setModalOpen(true);
            }}
          >
            新建事件
          </Button>,
        ]}
        request={(params) => milestoneAPI.list(params)}
      />

      <ModalForm<any>
        title={editing ? '编辑里程碑' : '新增里程碑'}
        open={modalOpen}
        formRef={formRef}
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
        <ProFormText name="title" label="事件标题" rules={[{ required: true, message: '请输入标题' }]} />
        <ProFormDatePicker
          name="event_date"
          label="发生日期"
          fieldProps={{ style: { width: '100%' } }}
          rules={[{ required: true, message: '请选择日期' }]}
        />
        <ProFormTextArea name="description" label="事件描述" fieldProps={{ autoSize: { minRows: 3 } }} />
        <ProFormText name="location" label="地点" />
        <ProFormText name="category" label="分类" />
        <ProFormDigit name="sort_order" label="排序" min={0} />
        <ProFormSwitch name="highlight" label="是否重点展示" />
        <ProForm.Item label="配图" name="cover_url" valuePropName="value">
          <Uploader category="milestones" accept="image/*" maxSizeMB={10} hint="建议 4:3 比例，大小不超过 10MB" />
        </ProForm.Item>
      </ModalForm>
    </PageContainer>
  );
};

export default MilestonePage;
