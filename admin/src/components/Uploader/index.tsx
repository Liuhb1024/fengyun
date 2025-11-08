import { CloudUploadOutlined } from '@ant-design/icons';
import { App, Upload } from 'antd';
import type { UploadProps } from 'antd';
import React from 'react';
import { uploadAPI } from '@/services/yingge';

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

  const customRequest: UploadProps['customRequest'] = async ({ file, onSuccess, onError }) => {
    try {
      const uploadFile = file as File;
      if (maxSizeMB && uploadFile.size > maxSizeMB * 1024 * 1024) {
        message.error(`文件需小于 ${maxSizeMB}MB`);
        onError?.(new Error('File too large'));
        return;
      }
      const result = await uploadAPI.upload(uploadFile, category);
      onChange?.(result.url);
      onSuccess?.(result);
      message.success('上传成功');
    } catch (error) {
      message.error('上传失败，请重试');
      onError?.(error as Error);
    }
  };

  const renderPreview = () => {
    if (!value) return null;
    const lower = value.toLowerCase();
    const isImage = lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png') || lower.endsWith('.gif') || (accept?.includes('image') ?? false);
    const isVideo = lower.endsWith('.mp4') || lower.endsWith('.mov') || (accept?.includes('video') ?? false);
    const isAudio = lower.endsWith('.mp3') || lower.endsWith('.m4a') || lower.endsWith('.wav') || (accept?.includes('audio') ?? false);

    if (isImage) {
      return <img src={value} alt="preview" style={{ width: '100%', marginTop: 8, borderRadius: 4 }} />;
    }
    if (isVideo) {
      return (
        <video src={value} controls style={{ width: '100%', marginTop: 8, borderRadius: 4 }}>
          您的浏览器不支持视频预览
        </video>
      );
    }
    if (isAudio) {
      return (
        <audio src={value} controls style={{ width: '100%', marginTop: 8 }}>
          您的浏览器不支持音频预览
        </audio>
      );
    }
    return (
      <a href={value} target="_blank" rel="noreferrer" style={{ display: 'block', marginTop: 8 }}>
        已上传文件
      </a>
    );
  };

  return (
    <div>
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
            padding: 12,
            borderRadius: 8,
            textAlign: 'center',
            cursor: disabled ? 'not-allowed' : 'pointer',
            color: disabled ? 'var(--ant-color-text-tertiary)' : undefined,
          }}
        >
          <CloudUploadOutlined />
          <div>{value ? '已上传，点击重新上传' : '点击上传'}</div>
          {hint && <div style={{ color: '#888', fontSize: 12 }}>{hint}</div>}
          {tips && <div style={{ color: '#999', fontSize: 12 }}>{tips}</div>}
        </div>
      </Upload>
      {renderPreview()}
    </div>
  );
};

export default Uploader;
