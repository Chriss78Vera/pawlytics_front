import { http } from '../../config/httpClient.js';

const listConfig = ({ page = 1, limit = 5, filters = {} } = {}) => ({
  params: filters,
  headers: {
    'x-page': page,
    'x-limit': limit,
  },
});

export const mascotasService = {
  getMascotas: (options) => http.get('/mascotas', listConfig(options)),
  getMascotasByUserData: (userDataId, options) => http.get(`/mascotas/user-data/${userDataId}`, listConfig(options)),
  createMascota: (payload) => http.post('/mascotas', payload),
};
