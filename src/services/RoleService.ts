import { api as AXIOS_INSTANCE } from '../api/axios';
import { IPagination, IPermission, IRole, IUpdateRole } from '../types/interfaces';


interface IGetRoleParams {
  page?: number,
  size?: number,
  includePermissions?: boolean
}

interface IGetPermissionParams {
  page?: number,
  size?: number,
}

export class RoleService {

  static async getRoles({
    page = 0, size = 10,
    includePermissions = false,
  }: IGetRoleParams): Promise<IPagination<IRole>> {
    const response = await AXIOS_INSTANCE.get(`/roles`, {
      params: {
        page, size, includePermissions
      }
    });
    console.log(response.data);
    return response.data;
  }

  static async getRole(id: string, params: IGetRoleParams): Promise<IRole> {
    const response = await AXIOS_INSTANCE.get(`/roles/${id}`, {
      params: {
        includePermissions: params.includePermissions
      }
    });
    return response.data;
  }

  static async getRolesUnpaginated(getRoleParams: IGetRoleParams): Promise<IRole[]> {
    const response = this.getRoles(getRoleParams);
    return (await response).records;
  }

  static async updateRole(id: string, role: IUpdateRole): Promise<IRole> {
    console.log(role, id)
    const response = await AXIOS_INSTANCE.patch(`/roles/${id}`, role);
    return response.data;
  }


  static async getPermissions({
    page = 0, size = 10,
  }: IGetPermissionParams): Promise<IPagination<IPermission>> {
    const response = await AXIOS_INSTANCE.get(`/permissions`, {
      params: {
        page, size
      }
    });
    return response.data;
  }

  static async getPermission(id: String): Promise<IPermission> {
    const response = await AXIOS_INSTANCE.get(`/roles/${id}`);
    return response.data;
  }
}