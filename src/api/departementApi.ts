import { IDepartement, IPagination } from "../types/interfaces";
import { api } from "./axios";

const DEPARTEMENT_BASE_URL = 'http://localhost:3000/departements';

const TOTALE_ELEMENT = 20; //TODO: should delete when the backend is ready

export const getDepartements = async ({
  page,
  size = 10
}: {
  page: number;
  size?: number;
}): Promise<IPagination<IDepartement>> => {

  const { data } = await api.get(DEPARTEMENT_BASE_URL, {
    params: {
      page: page - 1,
      size
    }
  });
  const paginationEtudiant = {
    page: page,
    size: size,
    totalElements: TOTALE_ELEMENT,
    totalPages: TOTALE_ELEMENT / size -1,
    records: data
  }

  console.log(paginationEtudiant);
  
  return paginationEtudiant;
}
