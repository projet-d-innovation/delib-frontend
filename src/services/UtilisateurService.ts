import { api as AXIOS_INSTANCE } from '../api/axios';
import { IPagination, IUtilisateur } from '../types/interfaces';


interface IGetUtilisateurByGroupParams {
  group: string,
  search?: string,
  page?: number,
  size?: number,
  includeRoles?: boolean
  includePermissions?: boolean
  includeDepartement?: boolean
  includeElements?: boolean
}


interface IGetUtilisateurByRole {
  role: string,
  search?: string,
  page?: number,
  size?: number,
  includeRoles?: boolean
  includePermissions?: boolean
  includeDepartement?: boolean
  includeElements?: boolean
}

export class UtilisateurService {

  static async getUtilisateursByGroup({
    group,
    search = "",
    page = 0, size = 10,
    includeRoles = false,
    includePermissions = false,
    includeDepartement = false,
    includeElements = false
  }: IGetUtilisateurByGroupParams): Promise<IPagination<IUtilisateur>> {
    const response = await AXIOS_INSTANCE.get(`/utilisateurs/group/${group}`, {
      params: {
        search, page, size, includeRoles, includePermissions, includeDepartement, includeElements
      }
    });
    return response.data;
  }

  static async getUtilisateursByGroupUnpaginated(getUtilisateurByGroup: IGetUtilisateurByGroupParams): Promise<IUtilisateur[]> {
    const response = this.getUtilisateursByGroup(getUtilisateurByGroup);
    return (await response).records;
  }


  static async getUtilisateursByRole({
    role,
    search = "",
    page = 0, size = 10,
    includeRoles = false,
    includePermissions = false,
    includeDepartement = false,
    includeElements = false
  }: IGetUtilisateurByRole): Promise<IPagination<IUtilisateur>> {
    const response = await AXIOS_INSTANCE.get(`/utilisateurs/role/${role}`, {
      params: {
        search, page, size, includeRoles, includePermissions, includeDepartement, includeElements
      }
    });
    return response.data;
  }

  static async getUtilisateursByRoleUnpaginated(getUtilisateurByRole: IGetUtilisateurByRole): Promise<IUtilisateur[]> {
    const response = this.getUtilisateursByRole(getUtilisateurByRole);
    return (await response).records;
  }


}