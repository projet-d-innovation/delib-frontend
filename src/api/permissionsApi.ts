import { IPagination, IPermission } from '../types/interfaces';
import { api } from './axios';

const PERMISSIONS_BASE_URL = '/utilisateurs/permissions';

export const getPermissions = async ({ page = 1, size = 10 }: {
  page?: number,
  size?: number
}): Promise<IPagination<IPermission>> => {


  const { data } = await api.get(PERMISSIONS_BASE_URL, {
    params: {
      page: page - 1,
      size
    }
  })

  return data;
}