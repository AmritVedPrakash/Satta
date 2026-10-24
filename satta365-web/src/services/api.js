import axios from 'axios';
import { API_BASE_URL, API_TOKEN } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 35000, // 35 seconds to avoid false timeouts on slow remote hosting
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

api.interceptors.request.use((config) => {
  // Ensure token is attached if not already present
  if (config.params) {
    if (!config.params.token) {
      config.params.token = API_TOKEN;
    }
  } else {
    config.params = { token: API_TOKEN };
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Format technical timeout and network errors into clear user messages
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      error.message = 'Server connection timeout. Backend server se response aane me time lag raha hai, kripya dobara try karein.';
    } else if (error.message === 'Network Error') {
      error.message = 'Internet ya server connection me issue hai. Kripya dobara check karein.';
    }

    console.warn('API Request Failed:', error.config?.url, error.message);
    return Promise.reject(error);
  }
);

export default api;

