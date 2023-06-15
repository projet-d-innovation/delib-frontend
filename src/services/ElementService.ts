import { api as AXIOS_INSTANCE } from '../api/axios';
import { ICreateElement, IElement, IPagination, IUpdateElement } from '../types/interfaces';


interface IGetElementParams {
  search?: string,
  page?: number,
  size?: number,
  includeSemestre?: boolean
  includeElements?: boolean
}

export class ElementService {

  static async getElements({ page = 0, size = 10, includeSemestre = false, includeElements = false }: IGetElementParams): Promise<IPagination<IElement>> {
    const response = await AXIOS_INSTANCE.get("/elements", {
      params: {
        page: page,
        size,
        includeSemestre,
        includeElements
      }
    });
    return response.data;
  }

  static async getElementsUnpaginated(getElementParams: IGetElementParams): Promise<IElement[]> {
    const response = this.getElements(getElementParams);
    return (await response).records;
  }

  static async createElement(element: ICreateElement): Promise<IElement> {
    const response = await AXIOS_INSTANCE.post(`/elements`, element);
    return response.data;
  }

  static async updateElement(id: String, element: IUpdateElement): Promise<IElement> {
    const response = await AXIOS_INSTANCE.patch(`/elements/${id}`, element);
    return response.data;
  }

  static async deleteElement(id: String): Promise<void> {
    await AXIOS_INSTANCE.delete(`/elements/${id}`);
  }

  static async deleteAllElements(ids: String[]): Promise<void> {
    await AXIOS_INSTANCE.delete(`/elements/bulk`, {
      params: {
        codesModule: ids
      }
    });
  }


}