import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProFormDigit,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';
import type { MemberItem } from '@/services/yingge';
import { memberAPI } from '@/services/yingge';

const MemberPage: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<MemberItem | undefined>();

  const submit = async (values: Partial<MemberItem>) => {
    if (editing) {
      await memberAPI.update(editing.id, values);
    } else {
      await memberAPI.create(values);
    }
    setOpen(false);
    setEditing(undefined);
    actionRef.current?.reload();
  };

  const columns: ProColumns<MemberItem>[] = [
    { title: '姓名', dataIndex: 'name_zh' },
    { title: '职位', dataIndex: 'position_zh' },
    { title: '排序', dataIndex: 'sort_order', search: false },
    {
      title: '首页展示',
      dataIndex: 'is_homepage',
      valueType: 'select',
      valueEnum: { true: { text: '是' }, false: { text: '否' } },
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
          key="delete"
          title="确认删除该成员？"
          onConfirm={async () => {
            await memberAPI.remove(record.id);
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
      <ProTable<MemberItem>
        rowKey="id"
        actionRef={actionRef}
        columns={columns}
        request={(params) => memberAPI.list(params)}
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            onClick={() => {
              setEditing(undefined);
              setOpen(true);
            }}
          >
            新增成员
          </Button>,
        ]}
      />

      <ModalForm<MemberItem>
        title={editing ? '编辑成员' : '新增成员'}
        open={open}
        initialValues={editing}
        onOpenChange={setOpen}
        onFinish={async (values) => {
          await submit(values);
          return true;
        }}
      >
        <ProFormText name="name_zh" label="姓名" rules={[{ required: true }]} />
        <ProFormText name="position_zh" label="职位" />
        <ProFormTextArea name="bio_zh" label="简介" />
        <ProFormDigit name="sort_order" label="排序" min={0} />
        <ProFormSwitch name="is_homepage" label="首页展示" />
      </ModalForm>
    </PageContainer>
  );
};

export default MemberPage;
