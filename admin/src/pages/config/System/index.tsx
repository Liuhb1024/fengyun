import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormList,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { App, Col, Row } from 'antd';
import React from 'react';
import type { SystemConfigItem } from '@/services/yingge';
import { systemAPI } from '@/services/yingge';

type SiteInfoConfig = {
  name_zh?: string;
  name_en?: string;
  phone?: string;
  email?: string;
};

type HeroConfig = {
  video_url?: string;
  title_zh?: string;
  subtitle_zh?: string;
  cta_text_zh?: string;
  cta_link?: string;
};

type StatsConfig = {
  founded_year?: string | number;
  members?: string | number;
  performances?: string | number;
};

type ContactConfig = {
  title?: string;
  description?: string;
  phone?: string;
  email?: string;
  wechat?: string;
  locations?: string[];
  tags?: string[];
  cta_text?: string;
  cta_link?: string;
};

const parseJSON = <T extends object>(value?: string, fallback: T = {} as T) => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const SystemSettings: React.FC = () => {
  const { message } = App.useApp();
  const { data, loading, refresh } = useRequest<SystemConfigItem[]>(() => systemAPI.list());
  const configs: SystemConfigItem[] = Array.isArray(data) ? data : [];

  const findConfig = (key: string) => configs.find((item) => item.config_key === key);

  const hero = parseJSON<HeroConfig>(findConfig('home_hero')?.config_value);
  const stats = parseJSON<StatsConfig>(findConfig('home_stats')?.config_value);
  const siteInfo = parseJSON<SiteInfoConfig>(findConfig('site_info')?.config_value);
  const contact = parseJSON<ContactConfig>(findConfig('contact_info')?.config_value, {
    locations: [],
    tags: [],
  });

  const handleSubmit = async (values: Record<string, any>) => {
    await systemAPI.update('site_info', {
      config_value: JSON.stringify({
        name_zh: values.site_name_zh,
        name_en: values.site_name_en,
        phone: values.contact_phone,
        email: values.contact_email,
      }),
    });
    await systemAPI.update('home_hero', {
      config_value: JSON.stringify(
        {
          video_url: values.hero_video_url,
          title_zh: values.hero_title_zh,
          subtitle_zh: values.hero_subtitle_zh,
          cta_text_zh: values.hero_cta_text,
          cta_link: values.hero_cta_link,
        },
        null,
        0,
      ),
    });
    await systemAPI.update('home_stats', {
      config_value: JSON.stringify({
        founded_year: values.stat_year,
        members: values.stat_members,
        performances: values.stat_performances,
      }),
    });
    await systemAPI.updateContactInfo({
      title: values.contact_title,
      description: values.contact_description,
      phone: values.contact_phone,
      email: values.contact_email,
      wechat: values.contact_wechat,
      locations: (values.contact_locations || []).filter((item: string) => item && item.trim()),
      tags: (values.contact_tags || []).filter((item: string) => item && item.trim()),
      cta_text: values.contact_cta_text,
      cta_link: values.contact_cta_link,
    });
    message.success('更新成功');
    refresh();
  };

  return (
    <PageContainer>
      <ProForm
        initialValues={{
          site_name_zh: siteInfo.name_zh,
          site_name_en: siteInfo.name_en,
          contact_phone: contact.phone ?? siteInfo.phone,
          contact_email: contact.email ?? siteInfo.email,
          contact_title: contact.title,
          contact_description: contact.description,
          contact_wechat: contact.wechat,
          contact_locations: contact.locations && contact.locations.length > 0 ? contact.locations : [''],
          contact_tags: contact.tags && contact.tags.length > 0 ? contact.tags : [''],
          contact_cta_text: contact.cta_text,
          contact_cta_link: contact.cta_link,
          hero_video_url: hero.video_url,
          hero_title_zh: hero.title_zh,
          hero_subtitle_zh: hero.subtitle_zh,
          hero_cta_text: hero.cta_text_zh,
          hero_cta_link: hero.cta_link,
          stat_year: stats.founded_year,
          stat_members: stats.members,
          stat_performances: stats.performances,
        }}
        loading={loading}
        onFinish={async (values) => {
          await handleSubmit(values);
          return true;
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <ProCard title="站点信息" bordered>
              <ProFormText name="site_name_zh" label="中文名称" />
              <ProFormText name="site_name_en" label="英文名称" />
            </ProCard>
          </Col>
          <Col span={12}>
            <ProCard title="Hero 区域" bordered>
              <ProFormText name="hero_video_url" label="视频地址" />
              <ProFormText name="hero_title_zh" label="标题" />
              <ProFormText name="hero_subtitle_zh" label="副标题" />
              <ProFormText name="hero_cta_text" label="按钮文案" />
              <ProFormText name="hero_cta_link" label="按钮链接" />
            </ProCard>
          </Col>
        </Row>

        <ProCard title="统计配置" bordered style={{ marginTop: 16 }}>
          <ProFormText name="stat_year" label="成立年份" />
          <ProFormText name="stat_members" label="成员数量" />
          <ProFormText name="stat_performances" label="演出场次" />
        </ProCard>

        <ProCard title="联系我们" bordered style={{ marginTop: 16 }}>
          <ProFormText name="contact_title" label="区块标题" />
          <ProFormTextArea name="contact_description" label="简介" fieldProps={{ autoSize: { minRows: 3 } }} />
          <ProFormText name="contact_phone" label="联系电话" />
          <ProFormText name="contact_email" label="联系邮箱" />
          <ProFormText name="contact_wechat" label="微信 / 其他渠道" />
          <ProFormList
            name="contact_locations"
            label="常驻城市 / 服务范围"
            creatorButtonProps={{ creatorButtonText: '添加城市' }}
            copyIconProps={false}
            deleteIconProps={{ tooltipText: '删除' }}
          >
            <ProFormText placeholder="例如 汕头 / 深圳" />
          </ProFormList>
          <ProFormList
            name="contact_tags"
            label="能力标签"
            creatorButtonProps={{ creatorButtonText: '添加标签' }}
            copyIconProps={false}
            deleteIconProps={{ tooltipText: '删除' }}
          >
            <ProFormText placeholder="例如 品牌共创" />
          </ProFormList>
          <ProFormText name="contact_cta_text" label="按钮文案" />
          <ProFormText name="contact_cta_link" label="按钮链接" />
        </ProCard>
      </ProForm>
    </PageContainer>
  );
};

export default SystemSettings;
