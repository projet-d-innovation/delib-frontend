import { IPagination, IPermission, IUtilisateur } from "../types/interfaces";
import { api, utilisateur_api, role_api } from "./axios";

export const getUtilisateurs = async ({
  page,
  size = 10,
  nom = "",
}: {
  page: number;
  size?: number;
  nom?: string;
}): Promise<IPagination<IUtilisateur>> =>
  nom==''?(
    await utilisateur_api.get(
      `/utilisateurs?page=${page - 1}&size=${size}&includeRole=true` + ""
    )
  ).data : (
    await utilisateur_api.get(
      `/utilisateurs/nom?page=${page - 1}&size=${size}&nom=${nom}&includeRole=true` + ""    //TODO: should create getUtilisateurByNom endpoint 
      )
  ).data;

export const saveUtilisateur = async (
  utilisateur: IUtilisateur
): Promise<IUtilisateur> => {
  const { data } = await utilisateur_api.post(`/utilisateurs`, utilisateur);
  return data;
};

export const updateUtilisateur = async (
  utilisateur: IUtilisateur
): Promise<IUtilisateur> => {
  const { data } = await utilisateur_api.patch(
    `/utilisateurs/` + utilisateur.code,
    utilisateur
  );
  return data;
};

export const getUtilisateur = async (
  utilisateurId: string
): Promise<IUtilisateur> =>
  (await utilisateur_api.get(`/utilisateurs/` + utilisateurId)).data;


export const deleteUtilisateurs = async (utilisateurIds: string[]): Promise<void> => {
  let codes = "?codes="+utilisateurIds.join("&codes=");
  await utilisateur_api.delete(`/utilisateurs/bulk` + codes);
}