import { http } from '@/app/config/httpClient.js';

const aiHeaders = (headers = {}) => {
  const apiKey = import.meta.env.VITE_API_KEY_IA;

  return apiKey
    ? { ...headers, 'x-ai-api-key': apiKey }
    : headers;
};

const aiConfig = (config = {}) => ({
  ...config,
  headers: aiHeaders(config.headers),
});

const listConfig = ({ page = 1, limit = 10, filters = {} } = {}) => aiConfig({
  params: filters,
  headers: {
    'x-page': page,
    'x-limit': limit,
  },
});

export const analisisService = {
  createAiAnalysis: (payload) => http.post('/ai/requests', payload, aiConfig()),
  getAiLogs: (options) => http.get('/ai/logs', listConfig(options)),  
  getAiLogById: (id) => http.get(`/ai/logs/${id}`, aiConfig()),
  getDetailedAnalyses: (options) => http.get('/ai/detailed-analysis', listConfig(options)),
  getDetailedAnalysisById: (id) => http.get(`/ai/detailed-analysis/${id}`, aiConfig()),
  updateDetailedAnalysis: (id, payload) => http.patch(`/ai/detailed-analysis/${id}`, payload, aiConfig()),
};
