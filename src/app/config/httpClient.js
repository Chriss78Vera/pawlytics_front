import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_PAWLYTICS_API_URL;

export const pawlyticsHttpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const http = {
  get: (url, config) =>
    pawlyticsHttpClient.get(url, config).then((response) => response.data),
  post: (url, data, config) =>
    pawlyticsHttpClient.post(url, data, config).then((response) => response.data),
  put: (url, data, config) =>
    pawlyticsHttpClient.put(url, data, config).then((response) => response.data),
  patch: (url, data, config) =>
    pawlyticsHttpClient.patch(url, data, config).then((response) => response.data),
  delete: (url, config) =>
    pawlyticsHttpClient.delete(url, config).then((response) => response.data),
};
