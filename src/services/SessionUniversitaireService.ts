import { api as AXIOS_INSTANCE } from '../api/axios';
import { IPagination, SessionUniv } from '../types/interfaces';



export class SessionUniversitaireervice {

  static async getSessionUniversitaire(page = 0, size = 10): Promise<IPagination<SessionUniv>> {
    const response = await AXIOS_INSTANCE.get("/sessions-universitaire", {
      params: {
        page,
        size,
      }
    });
    return response.data;
  }

}