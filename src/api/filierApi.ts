import { IFiliere, IPagination } from "../types/interfaces";
import { api } from "./axios";

const baseURL = import.meta.env.UTILISATEUR_BACKEND_URL as string;

const FILIERS_BASE_URL = "http://localhost:8084/api/v1/filieres";

export const getFiliers = async ({
  page,
  size = 10,
  includeSemestre = false,
  includeRegleDeCalcule = false,
  includeChefFiliere = false,
  searchByIntitute = "",
}: {
  page: number;
  size?: number;
  includeSemestre?: boolean;
  includeRegleDeCalcule?: boolean;
  includeChefFiliere?: boolean;
  searchByIntitute?: string;
}): Promise<IPagination<IFiliere[]>> => {
  const { data } = await api.get(FILIERS_BASE_URL, {
    params: {
      page: page,
      size,
      includeSemestre,
      includeRegleDeCalcule,
      includeChefFiliere,
    },

  });
  return data;
};
