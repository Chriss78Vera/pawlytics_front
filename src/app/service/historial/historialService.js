import { http } from '../../config/httpClient.js';

const listConfig = ({ page = 1, limit = 5, filters = {} } = {}) => ({
  params: filters,
  headers: {
    'x-page': page,
    'x-limit': limit,
  },
});

export const historialService = {
  getClinicalHistory: (options) => http.get('/clinical-history', listConfig(options)),
  getClinicalHistoryByPet: (petId, options) => http.get(`/clinical-history/pet/${petId}`, listConfig(options)),
  createClinicalHistory: (payload) => http.post('/clinical-history', payload),
};
