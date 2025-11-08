import {
  ActionType,
  ModalForm,
  PageContainer,
  ProFormDigit,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { Button, Popconfirm, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import React, { useRef, useState } from 'react';
import type { NavigationItem, NavigationTree } from '@/services/yingge';
import { navigationAPI } from '@/services/yingge';

const NavigationPage: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<NavigationItem | undefined>();
  const { data: treeData, refresh } = useRequest<NavigationTree[]>(() => navigationAPI.tree());
  const treeNodes: NavigationTree[] = Array.isArray(treeData) ? treeData : [];

  const submit = async (values: Partial<NavigationItem>) => {
    if (editing) {
      await navigationAPI.update(editing.id, values);
    } else {
      await navigationAPI.create(values);
    }
    setOpen(false);
    setEditing(undefined);
    actionRef.current?.reload();
    refresh();
  };

  const buildOptions = (nodes: NavigationTree[] = []): { label: string; value: number }[] =>
    nodes.reduce<{ label: string; value: number }[]>((acc, node) => {
      const current = { label: node.name_zh, value: node.id };
      const children = buildOptions(node.children);
      return acc.concat(current, children);
    }, []);

  const parentOptions = buildOptions(treeNodes);

  const convertTree = (nodes: NavigationTree[] = []): DataNode[] =>
    nodes.map((node) => ({
      key: node.id,
      title: node.name_zh,
      children: convertTree(node.children || []),
    }));

  return (
    <PageContainer
      extra={
        <Button
          type="primary"
          onClick={() => {
            setEditing(undefined);
            setOpen(true);
          }}
        >
          新增导航
        </Button>
      }
    >
      <ProTable<NavigationItem>
        rowKey="id"
        actionRef={actionRef}
        request={async () => ({
          data: await navigationAPI.list(),
          success: true,
        })}
        columns={[
          { title: '名称', dataIndex: 'name_zh' },
          { title: '英文', dataIndex: 'name_en' },
          { title: '链接', dataIndex: 'link_url' },
          { title: '排序', dataIndex: 'sort_order', search: false },
          {
            title: '显示',
            dataIndex: 'is_visible',
            valueType: 'select',
            valueEnum: { true: { text: '显示' }, false: { text: '隐藏' } },
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
                title="确认删除该导航？"
                onConfirm={async () => {
                  await navigationAPI.remove(record.id);
                  actionRef.current?.reload();
                  refresh();
                }}
              >
                <a>删除</a>
              </Popconfirm>,
            ],
          },
        ]}
        search={false}
      />

      <Tree style={{ marginTop: 24 }} treeData={convertTree(treeNodes)} />

      <ModalForm<NavigationItem>
        title={editing ? '编辑导航' : '新增导航'}
        open={open}
        initialValues={editing}
        onOpenChange={setOpen}
        onFinish={async (values) => {
          await submit(values);
          return true;
        }}
      >
        <ProFormText name="name_zh" label="中文名称" rules={[{ required: true }]} />
        <ProFormText name="name_en" label="英文名称" />
        <ProFormText name="link_url" label="链接" rules={[{ required: true }]} />
        <ProFormSelect
          name="parent_id"
          label="父级"
          allowClear
          options={parentOptions}
        />
        <ProFormDigit name="sort_order" label="排序" min={0} />
        <ProFormSwitch name="is_visible" label="显示" />
        <ProFormSwitch name="is_external" label="外部链接" />
      </ModalForm>
    </PageContainer>
  );
};

export default NavigationPage;
