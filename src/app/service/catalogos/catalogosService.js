import { http } from '@/app/config/httpClient.js';

export const catalogosService = {
  getTipos: () => http.get('/tipos'),
  getRazasByTipo: (typeId) => http.get(`/razas/tipo/${typeId}`),
};
