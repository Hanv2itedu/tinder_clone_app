import API from './generalApi';

const LIMIT = 20;
export const fetchUsers = (page: number) =>
  API.get('/user', { params: { limit: LIMIT, page: page } });

export const fetchUserDetail = (userId: string) => API.get(`/user/${userId}`);
