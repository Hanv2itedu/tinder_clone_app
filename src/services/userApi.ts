import { User, UserDetail } from '../types/users';
import API from './generalApi';

export const LIMIT = 20;
export const fetchUsers = (
  page: number,
): Promise<{ data: User[]; total: number }> =>
  API.get('/user', { params: { limit: LIMIT, page: page } });

export const fetchUserDetail = (userId: string): Promise<UserDetail> =>
  API.get(`/user/${userId}`);
