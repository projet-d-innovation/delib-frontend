import { IPagination, IUtilisateur } from "../types/interfaces";
import { api } from "./axios";

const ADMINISTRATEURS_BASE_URL = '/administration/utilisateurs';


export const getUtilisateurs = async ({
  page,
  size = 10,
  nom = "",
}: {
  page: number;
  size?: number;
  nom?: string;
}): Promise<IPagination<IUtilisateur>> => {
  console.log(ADMINISTRATEURS_BASE_URL);

  const { data } = await api.get(ADMINISTRATEURS_BASE_URL, {
    params: {
      page: page - 1,
      size,
      nom,
      includeRole: true
    }
  });
  return data;
}

export const saveUtilisateur = async (
  utilisateur: IUtilisateur
): Promise<IUtilisateur> => {
  const { data } = await api.post(ADMINISTRATEURS_BASE_URL, utilisateur);
  return data;
};

export const updateUtilisateur = async (
  utilisateur: IUtilisateur
): Promise<IUtilisateur> => {
  const { data } = await api.patch(
    `${ADMINISTRATEURS_BASE_URL}/${utilisateur.code}`,
    utilisateur
  );
  return data;
};

export const getUtilisateur = async (
  utilisateurId: string
): Promise<IUtilisateur> => {
  const { data } = await api.get(`${ADMINISTRATEURS_BASE_URL}/${utilisateurId}`);
  return data;
}


export const deleteUtilisateurs = async (utilisateurIds: string[]): Promise<void> => {
  await api.delete(`${ADMINISTRATEURS_BASE_URL}/bulk`, {
    params: {
      codes: utilisateurIds
    }
  });
}