import { PageContainer, ProCard, ProTable } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { Card, Col, Row, Statistic, Typography } from 'antd';
import React from 'react';
import type {
  ContentHotItem,
  OperationLogItem,
  StatsOverview,
  VisitStats,
} from '@/services/yingge';
import { statsAPI } from '@/services/yingge';

type ListResult<T> = {
  data: T[];
  total: number;
  success: boolean;
};

const DashboardOverview: React.FC = () => {
  const { data: overviewData, loading: overviewLoading } = useRequest<StatsOverview>(() =>
    statsAPI.overview(),
  );
  const { data: visitsData, loading: visitsLoading } = useRequest<VisitStats>(() =>
    statsAPI.visits({ days: 7 }),
  );
  const { data: hotArticlesData } = useRequest<ContentHotItem[]>(() => statsAPI.contentHot('article'));
  const { data: logResult, loading: logLoading } = useRequest<ListResult<OperationLogItem>>(() =>
    statsAPI.logs({ pageSize: 5 }),
  );

  const overview = overviewData as StatsOverview | undefined;
  const visits = visitsData as VisitStats | undefined;
  const visitRows: VisitStats['data'] = visits?.data ?? [];
  const hotList: ContentHotItem[] = Array.isArray(hotArticlesData) ? hotArticlesData : [];
  const logs = logResult as ListResult<OperationLogItem> | undefined;
  const logRows: OperationLogItem[] = logs?.data ?? [];

  return (
    <PageContainer>
      <Row gutter={16}>
        <Col span={6}>
          <Card loading={overviewLoading}>
            <Statistic title="文章总数" value={overview?.total_articles ?? 0} />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={overviewLoading}>
            <Statistic title="图片资源" value={overview?.total_images ?? 0} />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={overviewLoading}>
            <Statistic title="视频资源" value={overview?.total_videos ?? 0} />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={overviewLoading}>
            <Statistic title="访问量" value={overview?.total_visits ?? 0} />
          </Card>
        </Col>
      </Row>

      <ProCard title="最近 7 天访问趋势" style={{ marginTop: 16 }} loading={visitsLoading}>
        <ProTable
          rowKey="date"
          search={false}
          pagination={false}
          options={false}
          dataSource={visitRows}
          columns={[
            { title: '日期', dataIndex: 'date' },
            { title: 'PV', dataIndex: 'pv' },
            { title: 'UV', dataIndex: 'uv' },
          ]}
        />
      </ProCard>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <ProCard title="热门内容" loading={!hotArticlesData}>
            {hotList.map((item) => (
              <Card key={item.id} size="small" style={{ marginBottom: 8 }}>
                <Typography.Text strong>{item.title}</Typography.Text>
                <Typography.Text type="secondary" style={{ float: 'right' }}>
                  {item.metric} 热度
                </Typography.Text>
              </Card>
            ))}
          </ProCard>
        </Col>
        <Col span={12}>
          <ProCard title="最新操作日志" loading={logLoading}>
            <ProTable<OperationLogItem>
              rowKey="id"
              options={false}
              search={false}
              pagination={false}
              dataSource={logRows}
              columns={[
                { title: '时间', dataIndex: 'created_at', valueType: 'dateTime' },
                { title: '模块', dataIndex: 'module' },
                { title: '动作', dataIndex: 'action' },
                { title: '详情', dataIndex: 'content', ellipsis: true },
              ]}
            />
          </ProCard>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default DashboardOverview;
