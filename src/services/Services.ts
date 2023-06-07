import { gatewayApi } from "../api/apis";
import { Departement, Utilisateur, Filiere, Module } from "../types/interfaces";
import { CRUDService } from "./crudService";

export class Services {

  // TODO: use utilisateurService instead of the old methods in Administrateur page
  static utilisateurService = new CRUDService<Utilisateur>(gatewayApi, "/administration/utilisateurs");

  static departementService = new CRUDService<Departement>(gatewayApi, "/departements");
  static elementService = new CRUDService<Element>(gatewayApi, "/elements");
  static filiereService = new CRUDService<Filiere>(gatewayApi, "/filieres"); // Add filiereService
  static moduleService = new CRUDService<Module>(gatewayApi, "/modules"); // Add moduleService

}
