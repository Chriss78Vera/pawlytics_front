import { http } from '../../config/httpClient.js';

export const ownersService = {
  getOwners: () => http.get('/owners'),
};
