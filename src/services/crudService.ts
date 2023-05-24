import { IPagination } from "../types/interfaces";
import { AxiosInstance } from "axios";



// T type must have id attribute, simply use a getter id that maps to the model id for example for Element get id () {return this.codeElement} 

export class CRUDService<T extends { id?: string }> {
  private api: AxiosInstance;
  private baseUrl : string;

  constructor(api : AxiosInstance, baseUrl : string) {
    this.baseUrl = baseUrl;
    this.api = api;
  }

  public async getAll(
    page: number,
    size = 10,
    nom = ""
  ): Promise<IPagination<T>> {
    const { data } = await this.api.get(this.baseUrl, {
      params: {
        page,
        size,
      }
    });
    return data;
  }

  public async save(item: T): Promise<T> {
    if (!item.id) {
      throw new Error("Item must have an 'id' attribute.");
    }

    const { data } = await this.api.post(this.baseUrl, item);
    return data;
  }

  public async update(item: T): Promise<T> {
    if (!item.id) {
      throw new Error("Item must have an 'id' attribute.");
    }

    const { data } = await this.api.patch(
      `${this.baseUrl}/${item.id}`,
      item
    );
    return data;
  }

  public async getById(id: string): Promise<T> {
    const { data } = await this.api.get(`${this.baseUrl}/${id}`);
    return data;
  }

  public async delete(requestParams: Object): Promise<void> {
    await this.api.delete(`${this.baseUrl}/bulk`, {
      params: requestParams
    });
  }
}