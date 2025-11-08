import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (resp) => resp,
  (error) => {
    console.error('API error:', error);
    return Promise.reject(error);
  },
);

export default apiClient;
