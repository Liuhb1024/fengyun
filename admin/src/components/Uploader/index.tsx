import { CloudUploadOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { App, Button, Progress, Space, Upload } from 'antd';
import type { UploadProps } from 'antd';
import React, { useState } from 'react';
import { getApiBaseUrl, getToken } from '@/utils/token';

type Props = {
  value?: string;
  onChange?: (value?: string) => void;
  hint?: string;
  category?: string;
  accept?: string;
  disabled?: boolean;
  maxSizeMB?: number;
  tips?: string;
};

type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
};

type UploadResult = {
  url: string;
  thumbnail_url?: string;
  file_size?: number;
};

const uploadWithProgress = (
  file: File,
  category: string,
  onProgress: (percent: number) => void,
) =>
  new Promise<UploadResult>((resolve, reject) => {
    const baseUrl = getApiBaseUrl().replace(/\/$/, '');
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${baseUrl}/admin/upload`, true);
    const token = getToken();
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }
    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      const percent = Math.round((event.loaded / event.total) * 100);
      onProgress(percent);
    };
    xhr.onload = () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(new Error(`上传失败，状态码：${xhr.status}`));
        return;
      }
      try {
        const payload = JSON.parse(xhr.responseText) as ApiResponse<UploadResult>;
        if (payload?.code && payload.code !== 200) {
          reject(new Error(payload.message || '上传失败'));
          return;
        }
        resolve(payload.data);
      } catch (error) {
        reject(new Error('解析上传响应失败'));
      }
    };
    xhr.onerror = () => reject(new Error('网络异常，上传失败'));
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    xhr.send(formData);
  });

const Uploader: React.FC<Props> = ({
  value,
  onChange,
  hint,
  category = 'general',
  accept,
  disabled,
  maxSizeMB = 20,
  tips,
}) => {
  const { message } = App.useApp();
  const [uploading, setUploading] = useState(false);
  const [percent, setPercent] = useState<number | null>(null);

  const customRequest: UploadProps['customRequest'] = async ({ file, onSuccess, onError }) => {
    try {
      const uploadFile = file as File;
      if (maxSizeMB && uploadFile.size > maxSizeMB * 1024 * 1024) {
        message.error(`文件需小于 ${maxSizeMB}MB`);
        onError?.(new Error('File too large'));
        return;
      }
      setUploading(true);
      setPercent(0);
      const result = await uploadWithProgress(uploadFile, category, (next) => {
        setPercent(next);
      });
      onChange?.(result.url);
      onSuccess?.(result);
      setPercent(100);
      message.success('上传成功');
    } catch (error) {
      message.error('上传失败，请重试');
      onError?.(error as Error);
    } finally {
      setUploading(false);
      setTimeout(() => setPercent(null), 800);
    }
  };

  const renderPreview = () => {
    if (!value) return null;
    const lower = value.toLowerCase();
    const isImage = lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png') || lower.endsWith('.gif') || (accept?.includes('image') ?? false);
    const isVideo = lower.endsWith('.mp4') || lower.endsWith('.mov') || (accept?.includes('video') ?? false);
    const isAudio = lower.endsWith('.mp3') || lower.endsWith('.m4a') || lower.endsWith('.wav') || (accept?.includes('audio') ?? false);

    let preview = null;
    if (isImage) {
      preview = <img src={value} alt="preview" style={{ width: '100%', borderRadius: 8 }} />;
    } else if (isVideo) {
      preview = (
        <video src={value} controls style={{ width: '100%', borderRadius: 8 }}>
          您的浏览器不支持视频预览
        </video>
      );
    } else if (isAudio) {
      preview = (
        <audio src={value} controls style={{ width: '100%' }}>
          您的浏览器不支持音频预览
        </audio>
      );
    } else {
      preview = (
        <a href={value} target="_blank" rel="noreferrer">
          已上传文件
        </a>
      );
    }

    return (
      <div
        style={{
          border: '1px solid var(--ant-color-border)',
          borderRadius: 8,
          padding: 12,
          marginTop: 8,
          background: 'var(--ant-color-bg-container, #fff)',
        }}
      >
        {preview}
        <Space style={{ marginTop: 12 }}>
          <Button
            icon={<ReloadOutlined />}
            size="small"
            onClick={() => {
              onChange?.(undefined);
            }}
          >
            重新选择
          </Button>
          <Button
            icon={<DeleteOutlined />}
            size="small"
            danger
            onClick={() => {
              onChange?.(undefined);
            }}
          >
            移除
          </Button>
        </Space>
      </div>
    );
  };

  return (
    <div>
      {!value && (
        <Upload
          customRequest={customRequest}
          maxCount={1}
          showUploadList={false}
          accept={accept || 'image/*,video/*,audio/*'}
          disabled={disabled}
        >
          <div
            style={{
              border: '1px dashed var(--ant-color-border)',
              padding: 20,
              borderRadius: 8,
              textAlign: 'center',
              cursor: disabled ? 'not-allowed' : 'pointer',
              color: disabled ? 'var(--ant-color-text-tertiary)' : undefined,
              background: 'var(--ant-color-bg-container, #fff)',
            }}
          >
            <CloudUploadOutlined style={{ fontSize: 24, marginBottom: 8 }} />
            <div style={{ fontWeight: 500 }}>{disabled ? '上传已禁用' : '点击或拖拽文件到此上传'}</div>
            {hint && <div style={{ color: '#888', fontSize: 12, marginTop: 4 }}>{hint}</div>}
            {tips && <div style={{ color: '#999', fontSize: 12 }}>{tips}</div>}
            <div style={{ color: '#bbb', fontSize: 12 }}>支持文件类型：{accept || '图片 / 视频 / 音频'}</div>
            <div style={{ color: '#bbb', fontSize: 12 }}>大小不超过 {maxSizeMB}MB</div>
          </div>
        </Upload>
      )}
      {percent !== null && (
        <div style={{ marginTop: 12 }}>
          <Progress percent={percent} size="small" status={uploading ? 'active' : 'success'} />
        </div>
      )}
      {value && renderPreview()}
    </div>
  );
};

export default Uploader;
