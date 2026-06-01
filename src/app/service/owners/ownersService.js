import { http } from '@/app/config/httpClient.js';

export const ownersService = {
  getOwners: () => http.get('/owners'),
};
