import { IEtudiant, IPagination, IProfesseur, IUtilisateur } from "../types/interfaces";
import { api } from "./axios";

const ADMINISTRATEURS_BASE_URL = '/administration/utilisateurs';

const ETUDIANTS_BASE_URL = 'http://localhost:3000/etudiants';

const PROFESSEURS_BASE_URL = 'http://localhost:3000/professeurs';

const TOTALE_ELEMENT = 20; //TODO: should delete when the backend is ready


export const getUtilisateurs = async ({
  page,
  size = 10,
  nom = "",
}: {
  page: number;
  size?: number;
  nom?: string;
}): Promise<IPagination<IUtilisateur>> => {
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

export const getEtudiants = async ({
  page,
  size = 10,
  nom = "",
}: {
  page: number;
  size?: number;
  nom?: string;
}): Promise<IPagination<IEtudiant>> => {

  // TODO: should delete this two params when the backend is ready
  const searchParams = {
    page: page - 1,
    size,
    nom,
  }
  const params = {
    page: page - 1,
    size
  }
  
  const { data } = await api.get(ETUDIANTS_BASE_URL, {
    params: nom ? searchParams : params
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


export const deleteEtudiant = async (etudiantId: string[]): Promise<void> => {

  //TODO: should use the code instead of id when the backend is ready
  // await api.delete(`${ETUDIANTS_BASE_URL}/bulk`, {  
  //   params: {
  //     codes: etudiantId
  //   }
  // });

  for (let index = 0; index < etudiantId.length; index++) {
    const element = etudiantId[index];
    await api.delete(`${ETUDIANTS_BASE_URL}/${element}`);
  }
}


export const getEtudiant = async (
  utilisateurId: string
): Promise<IEtudiant> => {
  const { data } = await api.get(`${ETUDIANTS_BASE_URL}/${utilisateurId}`);
  return data;
}


export const updateEtudiant = async (
  etudiant: IEtudiant
): Promise<IEtudiant> => {
  const { data } = await api.patch(
    `${ETUDIANTS_BASE_URL}/${etudiant.id}`,  //TODO: should use the code instead of id when the backend is ready
    etudiant
  );
  console.log(data);
  
  return data;
};


export const saveEtudiant = async (
  utilisateur: IEtudiant
): Promise<IEtudiant> => {
 
  const { data } = await api.post(ETUDIANTS_BASE_URL, utilisateur);
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
  }
  const params = {
    page: page - 1,
    size
  }
  
  const { data } = await api.get(PROFESSEURS_BASE_URL, {
    params: nom ? searchParams : params
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


export const deleteProfesseur = async (professeurId: string[]): Promise<void> => {

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
}


export const getProfesseur = async (
  professeurId: string
): Promise<IProfesseur> => {
  const { data } = await api.get(`${PROFESSEURS_BASE_URL}/${professeurId}`);
  return data;
}


export const updateProfesseur = async (
  professeur: IProfesseur
): Promise<IProfesseur> => {
  const { data } = await api.patch(
    `${PROFESSEURS_BASE_URL}/${professeur.id}`,  //TODO: should use the code instead of id when the backend is ready
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
}