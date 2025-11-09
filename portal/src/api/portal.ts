import apiClient from './client';

export type HeroConfig = {
  video_url: string;
  title_zh: string;
  title_en?: string;
  subtitle_zh?: string;
  subtitle_en?: string;
  cta_text_zh?: string;
  cta_link?: string;
};

export type StatsConfig = {
  founded_year: number;
  members: number;
  performances: number;
};

export type Carousel = {
  id: number;
  image_url: string;
  title_zh?: string;
  link_url?: string;
  is_active?: boolean;
};

export type Article = {
  id: number;
  title_zh: string;
  summary_zh?: string;
  cover_url?: string;
  publish_at?: string;
  category?: string;
};

export type ImageItem = {
  id: number;
  url: string;
  title_zh?: string;
  category?: string;
  thumbnail_url?: string;
};

export type VideoItem = {
  id: number;
  url: string;
  cover_url?: string;
  title_zh: string;
  category?: string;
  duration?: number;
};

export type MemberItem = {
  id: number;
  name_zh: string;
  position_zh?: string;
  bio_zh?: string;
  avatar?: string;
};

export type ContactInfo = {
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

export type MilestoneEvent = {
  id: number;
  title: string;
  description?: string;
  event_date: string;
  location?: string;
  highlight?: boolean;
  sort_order?: number;
  category?: string;
  cover_url?: string;
};

export const fetchHomeConfig = async () => {
  const { data } = await apiClient.get('/portal/home/config');
  return data.data as {
    hero: HeroConfig;
    stats: StatsConfig;
    carousels: Carousel[];
    quick_nav: { id: number; name: string; link_url: string; is_external?: boolean }[];
  };
};

export const fetchLatestNews = async (limit = 4) => {
  const { data } = await apiClient.get('/portal/home/latest-news', { params: { limit } });
  return data.data as Article[];
};

export const fetchGallery = async (limit = 6) => {
  const { data } = await apiClient.get('/portal/images', { params: { page_size: limit } });
  return data.data.items as ImageItem[];
};

export const fetchVideos = async (limit = 4) => {
  const { data } = await apiClient.get('/portal/videos', { params: { page_size: limit } });
  return data.data.items as VideoItem[];
};

export const fetchMembers = async (homepage = true) => {
  const { data } = await apiClient.get('/portal/members', { params: { homepage } });
  return data.data as MemberItem[];
};

export const recordVisit = async (payload: {
  page_url: string;
  referer?: string;
  user_agent?: string;
  device_type?: string;
  browser?: string;
  os?: string;
  region?: string;
}) => {
  try {
    await apiClient.post('/portal/stats/visit', payload);
  } catch (error) {
    console.warn('Failed to record visit', error);
  }
};

export const fetchContactInfo = async () => {
  const { data } = await apiClient.get('/portal/contact');
  return data.data as ContactInfo;
};

export const fetchMilestones = async (limit = 8) => {
  const { data } = await apiClient.get('/portal/milestones', { params: { limit } });
  return data.data as MilestoneEvent[];
};
