import { IPagination, IRole } from '../types/interfaces';
import { api } from './axios';

const ROLES_BASE_URL = '/utilisateurs/roles';

export const getRoles = async ({ page, size = 10 }: {
  page: number,
  size?: number
}): Promise<IPagination<IRole>> => {

  const { data } = await api.get(ROLES_BASE_URL, {
    params: {
      page: page - 1,
      size
    }
  })
  return data;
}