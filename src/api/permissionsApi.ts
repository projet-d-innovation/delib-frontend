import { IPagination, IPermission } from '../types/interfaces';
import { api } from './axios';

import { faker } from "@faker-js/faker"

export const getPermissions = async ({ page, size = 10 }: {
  page: number,
  size?: number
}): Promise<IPagination<IPermission>> => {


  await new Promise((resolve) => setTimeout(resolve, 1000))

  // generate list of 60 element if IPERMISSION

  const perms: IPermission[] = Array.from({ length: 60 }, () => ({
    permissionId: faker.random.word(),
    permissionName: faker.random.word(),
    path: faker.system.directoryPath()
  }))

  return {
    page: page,
    size: size,
    totalPages: perms.length / size,
    totalElements: perms.length,
    records: perms.slice((page - 1) * size, page * size)
  }
  // return api.get('/permissions');
}