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
};

const Uploader: React.FC<Props> = ({ value, onChange, hint, category = 'general', accept, disabled }) => {
  const { message } = App.useApp();

  const customRequest: UploadProps['customRequest'] = async ({ file, onSuccess, onError }) => {
    try {
      const result = await uploadAPI.upload(file as File, category);
      onChange?.(result.url);
      onSuccess?.(result);
      message.success('上传成功');
    } catch (error) {
      message.error('上传失败，请重试');
      onError?.(error as Error);
    }
  };

  return (
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
          cursor: 'pointer',
        }}
      >
        <CloudUploadOutlined />
        <div>{value ? '已上传，点击重新上传' : '点击上传'}</div>
        {hint && <div style={{ color: '#888', fontSize: 12 }}>{hint}</div>}
      </div>
    </Upload>
  );
};

export default Uploader;
