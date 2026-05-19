import { http } from '@/app/config/httpClient.js';

export const dashboardService = {
  getDashboardSummary: ({ role, userDataId } = {}) =>
    http.get('/dashboard/summary', {
      params: {
        role,
        userDataId,
      },
    }),
};
