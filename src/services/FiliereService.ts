import { api as AXIOS_INSTANCE } from '../api/axios';
import { ICreateFiliere, IFiliere, IPagination, IUpdateFiliere } from '../types/interfaces';


interface IGetFiliereParams {
  search?: string,
  page?: number,
  size?: number,
  includeSemestre?: boolean,
  includeRegleDeCalcule?: boolean
  includeChefFiliere?: boolean
  includeDepartement?: boolean
}

export class FiliereService {

  static async getFilieres({ search = "", page = 0, size = 10, includeSemestre = false, includeRegleDeCalcule = false, includeChefFiliere = false, includeDepartement = false }: IGetFiliereParams): Promise<IPagination<IFiliere>> {
    const response = await AXIOS_INSTANCE.get("/filieres", {
      params: {
        searchByIntitute: search,
        page: page,
        size,
        includeSemestre,
        includeRegleDeCalcule,
        includeChefFiliere,
        includeDepartement
      }
    });

    return response.data;
  }

  static async getFilieresUnpaginated(getFiliereParams: IGetFiliereParams): Promise<IFiliere[]> {
    const response = this.getFilieres(getFiliereParams);
    return (await response).records;
  }

  static async createFiliere(filiere: ICreateFiliere): Promise<IFiliere> {
    await new Promise(resolve => setTimeout(resolve, 4000));

    const response = await AXIOS_INSTANCE.post(`/filieres`, filiere);
    return response.data;
  }

  static async updateFiliere(id: String, filiere: IUpdateFiliere): Promise<IFiliere> {
    await new Promise(resolve => setTimeout(resolve, 4000));

    const response = await AXIOS_INSTANCE.patch(`/filieres/${id}`, filiere);
    return response.data;
  }

  static async deleteFiliere(id: String): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 4000));

    await AXIOS_INSTANCE.delete(`/filieres/${id}`);

  }

  static async deleteAllFilieres(ids: String[]): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 4000));

    await AXIOS_INSTANCE.delete(`/filieres/bulk`, {
      params: {
        codeFiliere: ids
      }
    });
  }


}