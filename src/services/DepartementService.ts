import { api as AXIOS_INSTANCE } from '../api/axios';
import { ICreateDepartement, IDepartement, IUpdateDepartement } from '../types/departement.type';
import { IPagination } from '../types/interfaces';

export class DepartementService {

  static async getDepartements({ search = "", page = 0, size = 10, includeFilieres = false, includeChefDepartement = false }: {
    search?: string,
    page?: number,
    size?: number,
    includeFilieres?: boolean,
    includeChefDepartement?: boolean
  }): Promise<IPagination<IDepartement>> {
    const response = await AXIOS_INSTANCE.get("/departements", {
      params: {
        search,
        page: page,
        size,
        includeFilieres,
        includeChefDepartement
      }
    });
    return response.data;
  }

  static async createDepartement(departement: ICreateDepartement): Promise<IDepartement> {
    const response = await AXIOS_INSTANCE.post(`/departements`, departement);
    return response.data;
  }

  static async updateDepartement(id: String, departement: IUpdateDepartement): Promise<IDepartement> {
    const response = await AXIOS_INSTANCE.patch(`/departements/${id}`, departement);
    return response.data;
  }

  static async deleteDepartement(id: String): Promise<void> {
    await AXIOS_INSTANCE.delete(`/departements/${id}`);
  }

  static async deleteAllDepartements(ids: String[]): Promise<void> {
    await AXIOS_INSTANCE.delete(`/departements/bulk`, {
      params: {
        codeDepartementList: ids
      }
    });
  }


}