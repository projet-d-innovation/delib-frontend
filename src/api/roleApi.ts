import { IPagination, IRole } from '../types/interfaces';
import { api } from './axios';

const ROLES_BASE_URL = 'http://localhost:3000/roles';
const TOTALE_ELEMENT = 20; //TODO: should delete when the backend is ready


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

  //TODO: should delete when the backend is ready
  const paginationRole = {
    page: page,
    size: size,
    totalElements: TOTALE_ELEMENT,
    totalPages: TOTALE_ELEMENT / size -1,
    records: data
  }
  
  return paginationRole;
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