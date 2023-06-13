import { api as AXIOS_INSTANCE } from '../api/axios';
import { ICreateSemestre, ISemestre, IPagination, IUpdateSemestre } from '../types/interfaces';


interface IGetSemestreParams {
  search?: string,
  page?: number,
  size?: number,
  includeFiliere?: boolean
  includeModules?: boolean
}

export class SemestreService {

  static async getSemestres({ page = 0, size = 10, includeFiliere = false, includeModules = false }: IGetSemestreParams): Promise<IPagination<ISemestre>> {
    const response = await AXIOS_INSTANCE.get("/semestres", {
      params: {
        page: page,
        size,
        includeFiliere,
        includeModules
      }
    });

    return response.data;
  }

  static async getSemestresUnpaginated(getSemestreParams: IGetSemestreParams): Promise<ISemestre[]> {
    const response = this.getSemestres(getSemestreParams);
    return (await response).records;
  }

  static async createSemestre(semestre: ICreateSemestre): Promise<ISemestre> {
    const response = await AXIOS_INSTANCE.post(`/semestres`, semestre);
    return response.data;
  }

  static async updateSemestre(id: String, semestre: IUpdateSemestre): Promise<ISemestre> {
    const response = await AXIOS_INSTANCE.patch(`/semestres/${id}`, semestre);
    return response.data;
  }

  static async deleteSemestre(id: String): Promise<void> {
    await AXIOS_INSTANCE.delete(`/semestres/${id}`);
  }

  static async deleteAllSemestres(ids: String[]): Promise<void> {
    await AXIOS_INSTANCE.delete(`/semestres/bulk`, {
      params: {
        codesSemestre: ids
      }
    });
  }


}