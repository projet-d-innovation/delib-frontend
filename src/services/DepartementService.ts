import axios from 'axios';
import { IDepartement, IPagination } from '../types/interfaces';


export class DepartementService {

  static readonly api = axios.create({
    baseURL: "http://localhost:50000/api/v1",
    headers: {
      'Content-Type': 'application/json',
    },
    paramsSerializer: (params) => {
      const searchParams = new URLSearchParams();
      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          const param = params[key];
          if (Array.isArray(param)) {
            param.forEach((value) => {
              searchParams.append(key, value);
            });
          } else {
            searchParams.append(key, param);
          }
        }
      }
      return searchParams.toString();
    }
  });

  static async getDepartements({ search = "", page = 0, size = 10, includeFilieres = false, includeChefDepartement = false }: {
    search?: string,
    page?: number,
    size?: number,
    includeFilieres?: boolean,
    includeChefDepartement?: boolean
  }): Promise<IPagination<IDepartement>> {
    const response = await this.api.get("/departements", {
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

}