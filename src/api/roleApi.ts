import { IPagination, IPermission, IRole } from '../types/interfaces';
import { api, role_api } from './axios';

import { faker } from "@faker-js/faker"

export const getRoles = async ({ page, size = 10 }: {
  page: number,
  size?: number
}): Promise<IPagination<IRole>> => (await role_api.get(`/roles?page=0&size=10`)).data;

export const getRolesList = async ():Promise<IRole[]> => (await role_api.get(`/roles/all`)).data;  //TODO: should create getroles endpoint without pagination


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