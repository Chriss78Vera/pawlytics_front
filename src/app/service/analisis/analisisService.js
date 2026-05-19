import { http } from '../../config/httpClient.js';

export const analisisService = {
  getAiAnalyses: () => http.get('/ai-analyses'),
};
