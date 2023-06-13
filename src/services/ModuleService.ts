import { api as AXIOS_INSTANCE } from '../api/axios';
import { ICreateModule, IModule, IPagination, IUpdateModule } from '../types/interfaces';


interface IGetModuleParams {
  search?: string,
  page?: number,
  size?: number,
  includeSemestre?: boolean
  includeElements?: boolean
}

export class ModuleService {

  static async getModules({ page = 0, size = 10, includeSemestre = false, includeElements = false }: IGetModuleParams): Promise<IPagination<IModule>> {
    const response = await AXIOS_INSTANCE.get("/modules", {
      params: {
        page: page,
        size,
        includeSemestre,
        includeElements
      }
    });
    return response.data;
  }

  static async getModulesUnpaginated(getModuleParams: IGetModuleParams): Promise<IModule[]> {
    const response = this.getModules(getModuleParams);
    return (await response).records;
  }

  static async createModule(semestre: ICreateModule): Promise<IModule> {
    const response = await AXIOS_INSTANCE.post(`/modules`, semestre);
    return response.data;
  }

  static async updateModule(id: String, semestre: IUpdateModule): Promise<IModule> {
    const response = await AXIOS_INSTANCE.patch(`/modules/${id}`, semestre);
    return response.data;
  }

  static async deleteModule(id: String): Promise<void> {
    await AXIOS_INSTANCE.delete(`/modules/${id}`);
  }

  static async deleteAllModules(ids: String[]): Promise<void> {
    await AXIOS_INSTANCE.delete(`/modules/bulk`, {
      params: {
        codesModule: ids
      }
    });
  }


}