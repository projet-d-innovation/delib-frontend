import { IPagination, IProfesseur, IUtilisateur } from "../types/interfaces";
import { api } from "./axios";

const baseURL = import.meta.env.UTILISATEUR_BACKEND_URL as string;

const UTILISATEURS_BASE_URL = "http://localhost:8082/api/v1/utilisateurs";
const UTILISATEURS_BASE_URL_JSON = "http://localhost:3000/utilisateurs";

const ADMIN_GROUP = "ADMIN"; //TODO: should delete when the backend is ready

export const getUtilisatursJsonServer = async ({
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

  const { data } = await api.get(UTILISATEURS_BASE_URL_JSON, {
    params: nom ? searchParams : params,
  });

  //TODO  should delete this when the backend is ready
  let users = data.filter((user: IUtilisateur) => {
    if (roleId != "") {
      return user.roles?.some((role) => role.roleId === roleId);
    }
    return true;
  });

  const TOTALE_ELEMENT = users.length;

  if (isadmin) {
    users = users.filter((user: IUtilisateur) => {
      return user.roles?.some((role) => role.groupe === ADMIN_GROUP);
    });
  }

  // TODO: should delete this when the backend is ready
  // const startIndex = (page - 1) * size;
  // const endIndex = startIndex + size;
  // // Extract the users for the current page
  // users = users.slice(startIndex, endIndex);

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

export const deleteUtilisateurJsonServer = async (
  utilisateurId: string[]
): Promise<void> => {
  //TODO: should use the code instead of id when the backend is ready
  // await api.delete(`${UTILISATEURS_BASE_URL_JSON}/bulk`, {
  //   params: {
  //     codes: utilisateurId,
  //   }
  // });

  for (let index = 0; index < utilisateurId.length; index++) {
    const element = utilisateurId[index];
    await api.delete(`${UTILISATEURS_BASE_URL_JSON}/${element}`);
  }
};

export const getUtilisateurJsonServer = async (
  utilisateurId: string
): Promise<IUtilisateur> => {
  const { data } = await api.get(
    `${UTILISATEURS_BASE_URL_JSON}/${utilisateurId}`
  );
  return data;
};

export const updateUtilisateurJsonServer = async (
  utilisateur: IUtilisateur
): Promise<IUtilisateur> => {
  const { data } = await api.patch(
    `${UTILISATEURS_BASE_URL_JSON}/${utilisateur.id}`, //TODO: should use the code instead of id when the backend is ready
    utilisateur
  );
  console.log(data);

  return data;
};

export const saveUtilisateurJsonServer = async (
  utilisateur: IUtilisateur
): Promise<IUtilisateur> => {
  const { data } = await api.post(UTILISATEURS_BASE_URL_JSON, utilisateur);
  console.log(data);

  return data;
};

export const getUtilisaturs = async ({
  page,
  size = 10,
  nom = "",
  roleId = "",
  group = "",
  includeRoles = false,
  includePermissions = false,
  includeDepartement = false,
  includeElements = false,
}: {
  page: number;
  size?: number;
  nom?: string;
  roleId?: string;
  group?: string;
  includeRoles?: boolean;
  includePermissions?: boolean;
  includeDepartement?: boolean;
  includeElements?: boolean;
}): Promise<IPagination<IUtilisateur>> => {
  const params = {
    page: page,
    size,
    includeDepartement,
    includeElements,
    includePermissions,
    includeRoles,
  };
  let data: Promise<IPagination<IUtilisateur>>;

  if (group !== "") {
    const response = await api.get(UTILISATEURS_BASE_URL + "/group/" + group, {
      params,
    });
    data = response.data;
  } else if (roleId !== "") {
    const response = await api.get(UTILISATEURS_BASE_URL + "/role/" + roleId, {
      params,
    });
    data = response.data;
  } else {
    const response = await api.get(UTILISATEURS_BASE_URL, {
      params,
    });
    data = response.data;
  }

  return data;
};

export const deleteUtilisateur = async (
  utilisateurId: string[]
): Promise<void> => {
  // TODO: should use the code instead of id when the backend is ready
  await api.delete(`${UTILISATEURS_BASE_URL}/bulk`, {
    params: {
      codes: utilisateurId,
    },
  });
};

export const getUtilisateur = async ({
  utilisateurId,
  includeRoles = false,
  includePermissions = false,
  includeDepartement = false,
  includeElements = false,
}: {
  utilisateurId: string;
  includeRoles?: boolean;
  includePermissions?: boolean;
  includeDepartement?: boolean;
  includeElements?: boolean;
}): Promise<IUtilisateur> => {
  const { data } = await api.get(`${UTILISATEURS_BASE_URL}/${utilisateurId}`, {
    params: {
      includeDepartement,
      includeElements,
      includePermissions,
      includeRoles,
    },
  });
  return data;
};

export const updateUtilisateur = async (
  utilisateur: IUtilisateur
): Promise<IUtilisateur> => {
  const { data } = await api.patch(
    `${UTILISATEURS_BASE_URL}/${utilisateur.code}`,
    utilisateur
  );

  return data;
};

export const saveUtilisateur = async (
  utilisateur: IUtilisateur
): Promise<IUtilisateur> => {
  const { data } = await api.post(UTILISATEURS_BASE_URL, utilisateur);
  console.log(data);

  return data;
};

export const getUtilisateurSheet = async (utilisateurId: string[]) => {
 return  api
      .get("http://localhost:8082/api/v1/utilisateurs/sheet", {
        responseType: "blob",
   
        params: {
          codes: utilisateurId,
        },
      })

};

export const uploadUtilisateurSheet = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post(
      `${UTILISATEURS_BASE_URL}/sheet`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log("File uploaded successfully!", response);
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};
