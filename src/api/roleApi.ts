import { IPagination, IPermission, IRole } from '../types/interfaces';
import { api } from './axios';

import { faker } from "@faker-js/faker"

export const getRoles = async ({ page, size = 10 }: {
  page: number,
  size?: number
}): Promise<IPagination<IRole>> => {


  await new Promise((resolve) => setTimeout(resolve, 1000))

  const perms: IPermission[] = Array.from({ length: 60 }, () => ({
    permissionId: faker.random.word(),
    permissionName: faker.random.word(),
    path: faker.system.directoryPath()
  }))

  const roles = Array.from({ length: 60 }, () => {

    const roleName = faker.random.word()
    return {
      roleId: roleName.toUpperCase(),
      roleName,
      permissions: perms.slice(0, 5)
    }
  })

  return {
    page: page,
    size: size,
    totalPages: perms.length / size,
    totalElements: perms.length,
    records: roles.slice((page - 1) * size, page * size)
  }
  // return api.get('/permissions');
}



export const getRole = async (roleId: string): Promise<IRole> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const perms: IPermission[] = Array.from({ length: 60 }, () => ({
    permissionId: faker.random.word(),
    permissionName: faker.random.word(),
    path: faker.system.directoryPath()
  }))

  const roleName = faker.random.word()
  return {
    roleId: roleName.toUpperCase(),
    roleName,
    permissions: perms.slice(0, 5)
  }
  // return api.get(`/roles/${roleId}`);
}