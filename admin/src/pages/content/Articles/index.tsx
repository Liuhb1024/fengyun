import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProFormDateTimePicker,
  ProFormDependency,
  ProFormInstance,
  ProForm,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Input, Popconfirm, Radio, Space, Tag, message } from 'antd';
import DOMPurify from 'dompurify';
import React, { useEffect, useRef, useState } from 'react';
import type { ArticleItem } from '@/services/yingge';
import { articleAPI } from '@/services/yingge';
import Uploader from '@/components/Uploader';

type ArticleFormValues = Partial<ArticleItem> & {
  cover_mode?: 'upload' | 'link';
  wechat_url?: string;
};

const sanitizeHtml = (raw: string) =>
  DOMPurify.sanitize(raw, {
    USE_PROFILES: { html: true },
  });

const ArticlePage: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const formRef = useRef<ProFormInstance<ArticleFormValues>>(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ArticleItem | undefined>();
  const [tags, setTags] = useState<string[]>([]);
  const [coverMode, setCoverMode] = useState<'upload' | 'link'>('upload');
  const [importLoading, setImportLoading] = useState(false);
  const [importLog, setImportLog] = useState<string[]>([]);

  useEffect(() => {
    articleAPI.tags().then((res) => setTags(res.items || [])).catch(() => {});
  }, []);

  const submit = async (values: ArticleFormValues) => {
    // 清理表单内的临时字段
    const { cover_mode, wechat_url, ...payload } = values as any;
    const mergedTags: string[] = Array.isArray(payload.tags) ? payload.tags.filter(Boolean) : [];
    if (!payload.content_format) {
      payload.content_format = 'html';
    }
    payload.tags = mergedTags;
    if (!payload.category && mergedTags.length > 0) {
      payload.category = mergedTags[0];
    }
    if (!payload.content_zh) {
      message.warning('正文不能为空');
      return;
    }
    if (editing) {
      await articleAPI.update(editing.id, payload);
    } else {
      await articleAPI.create(payload);
    }
    setOpen(false);
    setEditing(undefined);
    actionRef.current?.reload();
  };

  const columns: ProColumns<ArticleItem>[] = [
    { title: '标题', dataIndex: 'title_zh' },
    {
      title: '分类/标签',
      dataIndex: 'tags',
      render: (_, record) =>
        Array.isArray(record.tags) ? (
          <Space wrap>
            {record.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </Space>
        ) : (
          '-'
        ),
      search: false,
    },
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
            setCoverMode(record.cover_url ? 'link' : 'upload');
            setOpen(true);
            // 加载详情填充正文
            articleAPI.detail(record.id).then((data) => {
              formRef.current?.setFieldsValue({
                ...data,
                tags: data.tags || [],
                cover_mode: data.cover_url ? 'link' : 'upload',
              });
            });
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

  const handleImportWechat = async (url?: string) => {
    if (!url) {
      message.warning('请输入公众号文章链接');
      return;
    }
    const log: string[] = [];
    const appendLog = (line: string) => {
      log.push(line);
      setImportLog([...log]);
    };

    setImportLoading(true);
    try {
      appendLog('开始请求公众号文章...');
      const data = await articleAPI.importWechat(url);
      appendLog('获取成功，正在填充表单...');
      formRef.current?.setFieldsValue({
        ...data,
        tags: data.tags || [],
        content_format: 'html',
      });
      if (data.cover_url) {
        setCoverMode('link');
      }
      appendLog('封面与正文已填充，请检查后保存。');
      message.success('导入成功，请确认内容后保存');
    } catch (error: any) {
      appendLog(error?.message || '导入失败');
      message.error(error?.message || '导入失败');
    } finally {
      setImportLoading(false);
      setTimeout(() => setImportLog([]), 4000);
    }
  };

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
              setCoverMode('upload');
              setOpen(true);
              formRef.current?.resetFields();
              formRef.current?.setFieldsValue({
                title_zh: undefined,
                tags: [],
                cover_url: undefined,
                summary_zh: undefined,
                content_zh: undefined,
                publish_at: undefined,
                is_published: false,
                content_format: 'html',
                cover_mode: 'upload',
              });
            }}
          >
            新建文章
          </Button>,
        ]}
      />

      <ModalForm<ArticleItem>
        title={editing ? '编辑文章' : '新建文章'}
        open={open}
        initialValues={{
          ...(editing || {}),
          content_format: editing?.content_format || 'html',
          tags: editing?.tags || [],
          cover_mode: coverMode,
        }}
        onOpenChange={setOpen}
        width={640}
        formRef={formRef}
        onFinish={async (values) => {
          await submit(values as ArticleFormValues);
          return true;
        }}
      >
        <ProForm.Item label="公众号文章链接" name="wechat_url">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Input.Search
              placeholder="粘贴微信文章链接，点击导入"
              enterButton="导入"
              loading={importLoading}
              onSearch={handleImportWechat}
              allowClear
            />
            {importLoading || importLog.length > 0 ? (
              <div
                style={{
                  border: '1px solid var(--ant-color-border)',
                  borderRadius: 8,
                  padding: 10,
                  background: '#0b0b15',
                  color: '#d9d9d9',
                  fontSize: 12,
                  lineHeight: 1.6,
                }}
              >
                <div style={{ marginBottom: 6, color: '#f7c85a' }}>导入进度</div>
                {importLog.map((line, idx) => (
                  <div key={idx}>{line}</div>
                ))}
                {importLoading && <div style={{ color: '#888' }}>下载图片中，稍候...</div>}
              </div>
            ) : null}
          </Space>
        </ProForm.Item>
        <ProFormText name="title_zh" label="标题" rules={[{ required: true }]} />
        <ProFormSelect
          name="tags"
          label="分类/标签（可多选）"
          mode="tags"
          options={[
            { label: '动态', value: '动态' },
            { label: '媒体报道', value: '媒体报道' },
            { label: '演出预告', value: '演出预告' },
            { label: '文化', value: '文化' },
            ...((tags || []).map((tag) => ({ label: tag, value: tag })) || []),
          ]}
          placeholder="输入或选择分类/标签，可多选。默认取第一个作为分类。"
        />
        <ProForm.Item label="封面">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Radio.Group
              value={coverMode}
              onChange={(e) => {
                const mode = e.target.value as 'upload' | 'link';
                setCoverMode(mode);
              }}
            >
              <Radio.Button value="upload">上传图片</Radio.Button>
              <Radio.Button value="link">输入图片 URL</Radio.Button>
            </Radio.Group>
            {coverMode === 'upload' ? (
              <ProForm.Item name="cover_url" noStyle>
                <Uploader category="articles" accept="image/*" maxSizeMB={10} />
              </ProForm.Item>
            ) : (
              <ProFormText
                name="cover_url"
                label="封面地址"
                placeholder="https://example.com/cover.jpg"
                fieldProps={{ allowClear: true }}
              />
            )}
          </Space>
        </ProForm.Item>
        <ProFormTextArea name="summary_zh" label="摘要" />
        <ProFormTextArea
          name="content_zh"
          label="正文"
          rules={[{ required: true, message: '请输入正文' }]}
          fieldProps={{ rows: 12, placeholder: '支持粘贴富文本/HTML，或自行输入并排版' }}
        />
        <ProForm.Item label="正文预览">
          <ProFormDependency name={['content_zh']}>
            {({ content_zh }) => {
              const raw = content_zh || '<p>暂无内容</p>';
              const safeHtml = sanitizeHtml(raw);
              return (
                <div
                  style={{
                    border: '1px solid var(--ant-color-border-secondary, #f0f0f0)',
                    borderRadius: 8,
                    padding: 12,
                    maxHeight: 260,
                    overflow: 'auto',
                    background: '#fafafa',
                  }}
                  dangerouslySetInnerHTML={{ __html: safeHtml }}
                />
              );
            }}
          </ProFormDependency>
        </ProForm.Item>
        <ProFormDateTimePicker name="publish_at" label="发布时间" />
        <ProFormSwitch name="is_published" label="立即发布" />
      </ModalForm>
    </PageContainer>
  );
};

export default ArticlePage;
