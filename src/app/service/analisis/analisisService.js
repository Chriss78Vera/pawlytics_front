import { http } from '@/app/config/httpClient.js';

export const analisisService = {
  getAiAnalyses: () => http.get('/ai-analyses'),
};
