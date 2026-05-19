import { http } from '../../config/httpClient.js';

export const userService = {
  login: ({ email, password }) => http.post('/users/login', { email, password }),
  getUsers: () => http.get('/users'),
  createUser: (payload) => http.post('/users', payload),
  updateUser: (userId, payload) => http.put(`/users/${userId}`, payload),
  getUserData: (userDataId) => http.get(`/user-data/${userDataId}`),
  createUserData: (payload) => http.post('/user-data', payload),
  registerClient: (payload) =>
    http.post('/auth/register', {
      ...payload,
      role: 'cliente',
    }),
};
