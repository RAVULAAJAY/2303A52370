import axios from 'axios';

const apiClient = axios.create({
  timeout: 20000,
});

function getStoredValue(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

apiClient.interceptors.request.use((config) => {
  const nextConfig = { ...config, headers: { ...(config.headers ?? {}) } };
  const token =
    getStoredValue('authToken') ??
    getStoredValue('accessToken') ??
    getStoredValue('token');
  const apiKey = import.meta.env.VITE_API_KEY ?? getStoredValue('apiKey');
  const customHeaderName = import.meta.env.VITE_API_CUSTOM_HEADER_NAME;
  const customHeaderValue = import.meta.env.VITE_API_CUSTOM_HEADER_VALUE;

  if (token) {
    nextConfig.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  }

  if (apiKey) {
    nextConfig.headers['x-api-key'] = apiKey;
  }

  if (customHeaderName && customHeaderValue) {
    nextConfig.headers[customHeaderName] = customHeaderValue;
  }

  return nextConfig;
});

export function hasAuthorizationMaterial() {
  const token =
    getStoredValue('authToken') ??
    getStoredValue('accessToken') ??
    getStoredValue('token');
  const apiKey = import.meta.env.VITE_API_KEY ?? getStoredValue('apiKey');
  const customHeaderName = import.meta.env.VITE_API_CUSTOM_HEADER_NAME;
  const customHeaderValue = import.meta.env.VITE_API_CUSTOM_HEADER_VALUE;

  return Boolean(token || apiKey || (customHeaderName && customHeaderValue));
}

export function getAuthorizationHeadersPreview() {
  const token =
    getStoredValue('authToken') ??
    getStoredValue('accessToken') ??
    getStoredValue('token');
  const apiKey = import.meta.env.VITE_API_KEY ?? getStoredValue('apiKey');
  const customHeaderName = import.meta.env.VITE_API_CUSTOM_HEADER_NAME;
  const customHeaderValue = import.meta.env.VITE_API_CUSTOM_HEADER_VALUE;

  return {
    authorization: token ? 'present' : 'missing',
    apiKey: apiKey ? 'present' : 'missing',
    customHeader: customHeaderName && customHeaderValue ? 'present' : 'missing',
  };
}

export default apiClient;