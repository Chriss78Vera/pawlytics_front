import { http } from '@/app/config/httpClient.js';

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
  createVaccine: (payload) => http.post('/vacunas', payload),
  createDeworming: (payload) => http.post('/desparasitaciones', payload),
  createSurgery: (payload) => http.post('/cirugias', payload),
  createDisease: (payload) => http.post('/enfermedades', payload),
  createClinicalDetail: (payload) => http.post('/detalle-clinico', payload),
  getClinicalDetailsByPet: (petId) => http.get(`/detalle-clinico/pet/${petId}`),
};
