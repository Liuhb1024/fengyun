import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import React from 'react';
import type { OperationLogItem } from '@/services/yingge';
import { statsAPI } from '@/services/yingge';

const OperationLogs: React.FC = () => {
  return (
    <PageContainer>
      <ProTable<OperationLogItem>
        rowKey="id"
        request={(params) =>
          statsAPI.logs({
            page: params.current,
            page_size: params.pageSize,
          })
        }
        columns={[
          { title: '管理员 ID', dataIndex: 'admin_id' },
          { title: '模块', dataIndex: 'module' },
          { title: '动作', dataIndex: 'action' },
          { title: '内容', dataIndex: 'content', ellipsis: true },
          { title: 'IP', dataIndex: 'ip_address' },
          { title: '时间', dataIndex: 'created_at', valueType: 'dateTime' },
        ]}
      />
    </PageContainer>
  );
};

export default OperationLogs;
