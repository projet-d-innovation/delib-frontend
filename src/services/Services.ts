import { departementApi, utilisateurApi } from "../api/apis";
import { Departement, Utilisateur } from "../types/interfaces";
import { CRUDService } from "./crudService";

export class Services {

  // TODO : use utilsateurServvice instead of the old methods in Administrateur page
  static utilisateurService = new CRUDService<Utilisateur>(utilisateurApi, "/administration/utilisateurs");

  static departementService = new CRUDService<Departement>(departementApi , "/departements");




}