import { api as AXIOS_INSTANCE } from '../api/axios';
import { IDepartement, IPagination } from '../types/interfaces';

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