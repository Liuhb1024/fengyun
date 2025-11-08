const TOKEN_STORAGE_KEY = 'yingge_admin_token';

const API_BASE_URL =
  process.env.UMI_APP_API_URL ||
  process.env.YINGGE_API_URL ||
  process.env.API_BASE_URL ||
  'http://127.0.0.1:8000/api/v1';

export const getToken = () => localStorage.getItem(TOKEN_STORAGE_KEY);

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
};

export const getApiBaseUrl = () => API_BASE_URL;

export const getAuthorizationHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
