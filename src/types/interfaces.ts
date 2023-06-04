export enum resulta {
  VALIDE = "VALIDE",
  NON_VALIDE = "NON_VALIDE",
  ENCOURS = "ENCOURS",
}

export enum etats {
  VALIDE = "TERMINE",
  NON_VALIDE = "ENCOURS",
}

export interface ISessionUniversitaire {
  id: string;
  code: string;
  from: Date;
  to: Date;
  etats: etats;
}

export interface IFiliere {
  id: string;
  code: string;
  intitule: string;
  codeDepartement: string;
}

export interface IAnneUniversitaire {
  id: string;
  annee: string;
  resultat: resulta;
  codeSessionUniversitaire: number;
  sessionUniversitaire?: ISessionUniversitaire;
  codeFiliere: 1;
  filiere?: IFiliere;
  sessions?: ISession[];
  note: number;
}

export interface ISession {
  id?: string;
  type: string;
  note: number;
  resultat: resulta;
  codeSemester: string;
  semester?: ISemestre;
  notesElements?: INoteElement[];
  notesModules?: INoteModule[];
  noteSemester?: INoteSemester;
}

export interface INoteSemester {
  id?: string;
  note: number;
}
export interface INoteElement {
  id?: string;
  type: string;
  note: number;
  resultat: resulta;
  codeElement: string;
  element?: IElement;
  codeSession: string;
}

export interface INoteModule {
  id?: string;
  note: number;
  resultat: resulta;
  redoublant: boolean;
  rattrapage: boolean;
  codeModule: string;
  module?: IModule;
  codeSession: string;
}

export interface IUtilisateur {
  id?: string;
  code: string;
  cin: string;
  cne: string;
  nom: string;
  prenom: string;
  telephone: string;
  adresse: string;
  dateNaissance: Date;
  ville: string;
  pays: string;
  photo: string;
  codeFiliere?: string;
  filiere?: IFiliere;
  codeDepartement?: string;
  departement?: IDepartement;
  roles?: IRole[];
  permissions?: IPermission[];
  elements?: IElement[];
  codeAnneUniversitaire?: number; //TODO: should delete ? when the backend is ready
  anneUniversitaire?: IAnneUniversitaire[]; //TODO: should delete ? when the backend is ready
}

export interface IProfesseur {
  id?: string; //TODO: should delete id when the backend is ready
  code: string;
  nom: string;
  prenom: string;
  telephone: string;
  photo: string;
  codeDepartement: string;
  departement?: IDepartement; //TODO: should delete ? when the backend is ready
  elements?: IElement[];
}

export interface IUtilisateurs {
  code: string;
  nom: string;
  prenom: string;
  telephone: string;
  photo?: string;
  roles?: IRoleWithoutPermissions[];
}

export interface IDepartement {
  codeDepartement: string;
  intituleDepartement: string;
  codeChefDepartement: string;
  chefDepartement?: IUtilisateur;
}

export interface ISemestre {
  codeSemestre: string;
  codeFiliere: string;
  intituleSemestre: string;
  filiere?: IFiliere;
  modules?: IModule[];
}

export interface IModule {
  codeModule: string;
  intituleModule: string;
  coefficientModule: number;
  codeSemestre: string;
  elements?: IElement[];
}

export interface IElement {
  id?: string;
  codeElement: string;
  intituleElement: string;
  coefficientElement: number;
  codeModule: string;
  codeProfesseur: string;
}

export interface IPagination<Item> {
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  records: Item[];
}

export interface IPermission {
  permissionId: string;
  permissionName: string;
  path: string;
}

export interface IRole {
  id ?: string;
  roleId: string;
  roleName: string;
  groupe?: string;
  permissions?: IPermission[];
}

export interface IRoleWithoutPermissions {
  roleId: string;
  roleName: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: IRole[];
}

export interface IAuth {
  accessToken: string;
}

export interface IBusinessException {
  code: number;
  status: string;
  error: string;
}
