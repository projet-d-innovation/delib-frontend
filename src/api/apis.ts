import { api } from "./axiosInstanciation";


const utilisateurURL = import.meta.env.VITE_UTILISATEUR_URL as string
const departementURL = import.meta.env.VITE_DEPARTEMENT_URL as string
/// add any other service url here

export const utilisateurApi = api(utilisateurURL);
export const departementApi = api(departementURL);
// create an axios instance from the newly added service url here




