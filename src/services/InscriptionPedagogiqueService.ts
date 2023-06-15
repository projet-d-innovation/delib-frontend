import { api as AXIOS_INSTANCE } from "../api/axios";
import { IUtilisateur } from "../types/interfaces";

export class InscriptionPedagogiqueService {
  static async getEtudiant(id: string): Promise<IUtilisateur> {
    const response = await AXIOS_INSTANCE.get(`/etudiants/${id}`);
    return response.data;
  }
}
