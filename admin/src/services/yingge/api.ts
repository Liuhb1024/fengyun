import { request } from '@umijs/max';

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface PaginationMeta {
  total?: number;
  page?: number;
  page_size?: number;
}

export interface PaginatedData<T> {
  items: T[];
  meta?: PaginationMeta;
}

export interface PageParams {
  current?: number;
  pageSize?: number;
  page?: number;
  page_size?: number;
  [key: string]: any;
}

const unwrap = async <T>(promise: Promise<ApiResponse<T>>) => {
  const res = await promise;
  return res.data;
};

export const authAPI = {
  login: (data: { username: string; password: string }) =>
    unwrap(request<ApiResponse<{ access_token: string; profile: API.CurrentUser }>>('/admin/auth/login', {
      method: 'POST',
      data,
    })),
  me: () =>
    unwrap(
      request<ApiResponse<API.CurrentUser>>('/admin/auth/me', {
        method: 'GET',
      }),
    ),
  changePassword: (data: { old_password: string; new_password: string }) =>
    unwrap(
      request<ApiResponse<Record<string, string>>>('/admin/auth/change-password', {
        method: 'POST',
        data,
      }),
    ),
  logout: () =>
    request<ApiResponse<Record<string, string>>>('/admin/auth/logout', {
      method: 'POST',
    }),
};

export const adminUserAPI = {
  list: (params?: PageParams) => listRequest<AdminUser>('/admin/users', params),
  create: (data: AdminUserCreatePayload) =>
    unwrap(request<ApiResponse<AdminUser>>('/admin/users', { method: 'POST', data })),
  update: (id: number, data: AdminUserUpdatePayload) =>
    unwrap(request<ApiResponse<AdminUser>>(`/admin/users/${id}`, { method: 'PUT', data })),
  resetPassword: (id: number, data?: { new_password?: string }) =>
    unwrap(
      request<ApiResponse<{ password: string }>>(`/admin/users/${id}/reset-password`, {
        method: 'POST',
        data: data ?? {},
      }),
    ),
};

const buildPagination = (params?: PageParams) => ({
  page: params?.page || params?.current || 1,
  page_size: params?.page_size || params?.pageSize || 10,
  ...params,
});

const listRequest = async <T>(url: string, params?: PageParams) => {
  const data = await unwrap(request<ApiResponse<PaginatedData<T>>>(url, { params: buildPagination(params) }));
  return {
    data: data.items,
    total: data.meta?.total || data.items.length,
    success: true,
  };
};

export const carouselAPI = {
  list: (params?: PageParams) => listRequest<CarouselItem>('/admin/carousels', params),
  create: (data: Partial<CarouselItem>) =>
    unwrap(request<ApiResponse<CarouselItem>>('/admin/carousels', { method: 'POST', data })),
  update: (id: number, data: Partial<CarouselItem>) =>
    unwrap(request<ApiResponse<CarouselItem>>(`/admin/carousels/${id}`, { method: 'PUT', data })),
  remove: (id: number) =>
    request<ApiResponse<Record<string, unknown>>>(`/admin/carousels/${id}`, { method: 'DELETE' }),
};

export const imageAPI = {
  list: (params?: PageParams) => listRequest<ImageItem>('/admin/images', params),
  create: (data: Partial<ImageItem>) =>
    unwrap(request<ApiResponse<ImageItem>>('/admin/images', { method: 'POST', data })),
  update: (id: number, data: Partial<ImageItem>) =>
    unwrap(request<ApiResponse<ImageItem>>(`/admin/images/${id}`, { method: 'PUT', data })),
  remove: (id: number) =>
    request<ApiResponse<Record<string, unknown>>>(`/admin/images/${id}`, { method: 'DELETE' }),
};

export const videoAPI = {
  list: (params?: PageParams) => listRequest<VideoItem>('/admin/videos', params),
  create: (data: Partial<VideoItem>) =>
    unwrap(request<ApiResponse<VideoItem>>('/admin/videos', { method: 'POST', data })),
  update: (id: number, data: Partial<VideoItem>) =>
    unwrap(request<ApiResponse<VideoItem>>(`/admin/videos/${id}`, { method: 'PUT', data })),
  remove: (id: number) =>
    request<ApiResponse<Record<string, unknown>>>(`/admin/videos/${id}`, { method: 'DELETE' }),
};

export const audioAPI = {
  list: (params?: PageParams) => listRequest<AudioItem>('/admin/audios', params),
  create: (data: Partial<AudioItem>) =>
    unwrap(request<ApiResponse<AudioItem>>('/admin/audios', { method: 'POST', data })),
  update: (id: number, data: Partial<AudioItem>) =>
    unwrap(request<ApiResponse<AudioItem>>(`/admin/audios/${id}`, { method: 'PUT', data })),
  remove: (id: number) =>
    request<ApiResponse<Record<string, unknown>>>(`/admin/audios/${id}`, { method: 'DELETE' }),
};

export const articleAPI = {
  list: (params?: PageParams) => listRequest<ArticleItem>('/admin/articles', params),
  detail: (id: number) => unwrap(request<ApiResponse<ArticleItem>>(`/admin/articles/${id}`)),
  create: (data: Partial<ArticleItem>) =>
    unwrap(request<ApiResponse<ArticleItem>>('/admin/articles', { method: 'POST', data })),
  update: (id: number, data: Partial<ArticleItem>) =>
    unwrap(request<ApiResponse<ArticleItem>>(`/admin/articles/${id}`, { method: 'PUT', data })),
  publish: (id: number) =>
    request<ApiResponse<Record<string, unknown>>>(`/admin/articles/${id}/publish`, { method: 'POST' }),
  remove: (id: number) =>
    request<ApiResponse<Record<string, unknown>>>(`/admin/articles/${id}`, { method: 'DELETE' }),
};

export const memberAPI = {
  list: (params?: PageParams) => listRequest<MemberItem>('/admin/members', params),
  create: (data: Partial<MemberItem>) =>
    unwrap(request<ApiResponse<MemberItem>>('/admin/members', { method: 'POST', data })),
  update: (id: number, data: Partial<MemberItem>) =>
    unwrap(request<ApiResponse<MemberItem>>(`/admin/members/${id}`, { method: 'PUT', data })),
  remove: (id: number) =>
    request<ApiResponse<Record<string, unknown>>>(`/admin/members/${id}`, { method: 'DELETE' }),
};

export const navigationAPI = {
  list: () => unwrap(request<ApiResponse<NavigationItem[]>>('/admin/navigation')),
  tree: () => unwrap(request<ApiResponse<NavigationTree[]>>('/admin/navigation/tree')),
  create: (data: Partial<NavigationItem>) =>
    unwrap(request<ApiResponse<NavigationItem>>('/admin/navigation', { method: 'POST', data })),
  update: (id: number, data: Partial<NavigationItem>) =>
    unwrap(request<ApiResponse<NavigationItem>>(`/admin/navigation/${id}`, { method: 'PUT', data })),
  remove: (id: number) =>
    request<ApiResponse<Record<string, unknown>>>(`/admin/navigation/${id}`, { method: 'DELETE' }),
};

export const seoAPI = {
  list: () => unwrap(request<ApiResponse<SEOItem[]>>('/admin/seo')),
  create: (data: Partial<SEOItem>) =>
    unwrap(request<ApiResponse<SEOItem>>('/admin/seo', { method: 'POST', data })),
  update: (id: number, data: Partial<SEOItem>) =>
    unwrap(request<ApiResponse<SEOItem>>(`/admin/seo/${id}`, { method: 'PUT', data })),
  remove: (id: number) =>
    request<ApiResponse<Record<string, unknown>>>(`/admin/seo/${id}`, { method: 'DELETE' }),
};

export const systemAPI = {
  list: () => unwrap(request<ApiResponse<SystemConfigItem[]>>('/admin/system/config')),
  get: (key: string) =>
    unwrap(request<ApiResponse<{ config_key: string; config_value: string }>>(`/admin/system/config/${key}`)),
  update: (key: string, data: { config_value: string; description?: string }) =>
    unwrap(
      request<ApiResponse<SystemConfigItem>>(`/admin/system/config/${key}`, {
        method: 'PUT',
        data,
      }),
    ),
};

export const statsAPI = {
  overview: () => unwrap(request<ApiResponse<StatsOverview>>('/admin/stats/overview')),
  visits: (params?: { days?: number }) =>
    unwrap(request<ApiResponse<VisitStats>>('/admin/stats/visits', { params })),
  contentHot: (type: string) =>
    unwrap(request<ApiResponse<ContentHotItem[]>>(`/admin/stats/content-hot`, { params: { type } })),
  logs: (params?: PageParams) => listRequest<OperationLogItem>('/admin/logs/operations', params),
};

export const uploadAPI = {
  upload: (file: File, category: string = 'general') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    return unwrap(
      request<ApiResponse<UploadResult>>('/admin/upload', {
        method: 'POST',
        data: formData,
      }),
    );
  },
};

export type CarouselItem = {
  id: number;
  image_url: string;
  title_zh?: string;
  title_en?: string;
  link_url?: string;
  sort_order?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type ImageItem = {
  id: number;
  url: string;
  thumbnail_url?: string;
  title_zh?: string;
  category?: string;
  shot_date?: string;
  view_count?: number;
  is_homepage?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type VideoItem = {
  id: number;
  url: string;
  cover_url?: string;
  title_zh: string;
  category?: string;
  duration?: number;
  play_count?: number;
  created_at?: string;
  updated_at?: string;
};

export type AudioItem = {
  id: number;
  url: string;
  cover_url?: string;
  title_zh: string;
  category?: string;
  duration?: number;
  play_count?: number;
  created_at?: string;
  updated_at?: string;
};

export type ArticleItem = {
  id: number;
  title_zh: string;
  category?: string;
  summary_zh?: string;
  cover_url?: string;
  publish_at?: string;
  is_published?: boolean;
  view_count?: number;
};

export type MemberItem = {
  id: number;
  name_zh: string;
  position_zh?: string;
  bio_zh?: string;
  avatar?: string;
  join_date?: string;
  sort_order?: number;
  is_homepage?: boolean;
};

export type AdminUser = {
  id: number;
  username: string;
  nickname?: string;
  avatar?: string;
  role: string;
  is_active: boolean;
  last_login_at?: string;
  last_login_ip?: string;
  created_at: string;
};

export type AdminUserCreatePayload = {
  username: string;
  password: string;
  nickname?: string;
  avatar?: string;
  role?: string;
  is_active?: boolean;
};

export type AdminUserUpdatePayload = {
  nickname?: string;
  avatar?: string;
  role?: string;
  is_active?: boolean;
  password?: string;
};

export type NavigationItem = {
  id: number;
  name_zh: string;
  name_en?: string;
  link_url: string;
  parent_id?: number;
  sort_order?: number;
  is_visible?: boolean;
  is_external?: boolean;
};

export type NavigationTree = NavigationItem & { children?: NavigationTree[] };

export type SEOItem = {
  id: number;
  page_key: string;
  title_zh?: string;
  description_zh?: string;
  keywords_zh?: string;
  updated_at?: string;
};

export type SystemConfigItem = {
  id: number;
  config_key: string;
  config_value: string;
  description?: string;
  updated_at?: string;
};

export type StatsOverview = {
  total_articles: number;
  total_images: number;
  total_videos: number;
  total_members: number;
  total_visits: number;
};

export type VisitStats = {
  total_pv: number;
  total_uv: number;
  data: { date: string; pv: number; uv: number }[];
};

export type ContentHotItem = {
  id: number;
  title: string;
  metric: number;
};

export type OperationLogItem = {
  id: number;
  admin_id: number;
  module: string;
  action: string;
  content?: string;
  ip_address?: string;
  created_at: string;
};

export type UploadResult = {
  url: string;
  thumbnail_url?: string;
  file_size?: number;
};
