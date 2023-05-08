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



export const getRole = async (roleId: string): Promise<IRole> => {
  const { data } = await api.get(`${ROLES_BASE_URL}/${roleId}`);
  return data;
}


export const updateRolePerms = async (roleId: string, permissions: number[]): Promise<IRole> => {
  const { data } = await api.patch(`${ROLES_BASE_URL}/${roleId}`, {
    permissions
  });
  return data;
}