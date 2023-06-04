import { IPagination, IProfesseur, IUtilisateur } from "../types/interfaces";
import { api } from "./axios";

const ADMINISTRATEURS_BASE_URL = "/administration/utilisateurs";

const UTILISATEURS_BASE_URL = "http://localhost:3000/utilisateurs";

const PROFESSEURS_BASE_URL = "http://localhost:3000/professeurs";

const TOTALE_ELEMENT = 20; //TODO: should delete when the backend is ready

const ADMIN_GROUP = "ADMIN"; //TODO: should delete when the backend is ready

export const getUtilisaturs = async ({
  page,
  size = 10,
  nom = "",
  roleId = "",
  isadmin = false,
}: {
  page: number;
  size?: number;
  nom?: string;
  roleId?: string;
  isadmin?: boolean;
}): Promise<IPagination<IUtilisateur>> => {
  // TODO: should delete this two params when the backend is ready
  const searchParams = {
    page: page - 1,
    size,
    nom,
  };
  const params = {
    page: page - 1,
    size,
  };

  const { data } = await api.get(UTILISATEURS_BASE_URL, {
    params: nom ? searchParams : params,
  });

  //TODO  should delete this when the backend is ready
  let users = data.filter((user: IUtilisateur) => {
    if (roleId!="") {
      return user.roles?.some((role) => role.roleId === roleId);
    }
    return true;
  });

  if (isadmin) {
    users = users.filter((user: IUtilisateur) => {
      return user.roles?.some((role) => role.groupe === ADMIN_GROUP);
    });
  }

  const paginationEtudiant = {
    page: page,
    size: size,
    totalElements: TOTALE_ELEMENT,
    totalPages: TOTALE_ELEMENT / size - 1,
    records: users,
  };
  console.log(paginationEtudiant);
  return paginationEtudiant;
};

export const deleteUtilisateur = async (
  utilisateurId: string[]
): Promise<void> => {
  //TODO: should use the code instead of id when the backend is ready
  // await api.delete(`${UTILISATEURS_BASE_URL}/bulk`, {
  //   params: {
  //     codes: utilisateurId,
  //   }
  // });

  for (let index = 0; index < utilisateurId.length; index++) {
    const element = utilisateurId[index];
    await api.delete(`${UTILISATEURS_BASE_URL}/${element}`);
  }
};

export const getUtilisateur = async (
  utilisateurId: string
): Promise<IUtilisateur> => {
  const { data } = await api.get(`${UTILISATEURS_BASE_URL}/${utilisateurId}`);
  return data;
};

export const updateUtilisateur = async (
  utilisateur: IUtilisateur
): Promise<IUtilisateur> => {
  const { data } = await api.patch(
    `${UTILISATEURS_BASE_URL}/${utilisateur.id}`, //TODO: should use the code instead of id when the backend is ready
    utilisateur
  );
  console.log(data);

  return data;
};

export const saveUtilisateur = async (
  utilisateur: IUtilisateur
): Promise<IUtilisateur> => {
  const { data } = await api.post(UTILISATEURS_BASE_URL, utilisateur);
  console.log(data);

  return data;
};

export const getProfesseurs = async ({
  page,
  size = 10,
  nom = "",
}: {
  page: number;
  size?: number;
  nom?: string;
}): Promise<IPagination<IProfesseur>> => {
  // TODO: should delete this two params when the backend is ready
  const searchParams = {
    page: page - 1,
    size,
    nom,
  };
  const params = {
    page: page - 1,
    size,
  };

  const { data } = await api.get(PROFESSEURS_BASE_URL, {
    params: nom ? searchParams : params,
  });
  const paginationEtudiant = {
    page: page,
    size: size,
    totalElements: TOTALE_ELEMENT,
    totalPages: TOTALE_ELEMENT / size - 1,
    records: data,
  };

  console.log(paginationEtudiant);

  return paginationEtudiant;
};

export const deleteProfesseur = async (
  professeurId: string[]
): Promise<void> => {
  //TODO: should use the code instead of id when the backend is ready
  // await api.delete(`${ETUDIANTS_BASE_URL}/bulk`, {
  //   params: {
  //     codes: professeurId
  //   }
  // });

  for (let index = 0; index < professeurId.length; index++) {
    const element = professeurId[index];
    await api.delete(`${PROFESSEURS_BASE_URL}/${element}`);
  }
};

export const getProfesseur = async (
  professeurId: string
): Promise<IProfesseur> => {
  const { data } = await api.get(`${PROFESSEURS_BASE_URL}/${professeurId}`);
  return data;
};

export const updateProfesseur = async (
  professeur: IProfesseur
): Promise<IProfesseur> => {
  const { data } = await api.patch(
    `${PROFESSEURS_BASE_URL}/${professeur.id}`, //TODO: should use the code instead of id when the backend is ready
    professeur
  );
  console.log(data);

  return data;
};

export const saveProfesseur = async (
  utilisateur: IProfesseur
): Promise<IProfesseur> => {
  const { data } = await api.post(PROFESSEURS_BASE_URL, utilisateur);
  console.log(data);

  return data;
};

export const updateElementsProfesseur = async (
  professeur: IProfesseur
): Promise<IProfesseur> => {
  const { data } = await api.patch(
    `${PROFESSEURS_BASE_URL}/${professeur.id}`,
    professeur
  );
  return data;
};
