import { EtatInscription } from "../enums/enums";

export interface IUtilisateur {
  code: string;
  cin?: string;
  cne?: string;
  nom: string;
  prenom: string;
  telephone?: string;
  adresse?: string;
  dateNaissance?: Date;
  ville?: string;
  sexe?: string;
  pays?: string;
  photo?: string;
  roles?: IRole[];
  departement?: IDepartement;
  elements?: IElement[];
  permissions?: IPermission[];
  inscriptions?: IInscription[];
}

export interface ICreateUtilisateur {
  code: string;
  cin?: string;
  cne?: string;
  nom: string;
  prenom: string;
  telephone?: string;
  adresse?: string;
  dateNaissance?: Date;
  ville?: string;
  sexe?: string;
  pays?: string;
  photo?: string;
  roles?: string[];
  codeDepartement?: string;
}

export interface IUpdateUtilisateur {
  cin?: string;
  cne?: string;
  nom: string;
  prenom: string;
  telephone?: string;
  adresse?: string;
  dateNaissance?: Date;
  ville?: string;
  sexe?: string;
  pays?: string;
  photo?: string;
  roles?: string[];
  codeDepartement?: string;
}

interface IInscription {
  id: string;
  etudiant?: IEtudiant;
  codeFiliere: string;
  codeSessionUniversitaire: string;
  annee: number;
  etat: EtatInscription;
  note: number;
}

interface IEtudiant {
  code: string;
  cin?: string;
  cne?: string;
  nom: string;
  prenom: string;
  telephone?: string;
  adresse?: string;
  dateNaissance?: Date;
  ville?: string;
  sexe?: string;
  pays?: string;
  photo?: string;
}

export interface IDepartement {
  codeDepartement: string;
  intituleDepartement: string;
  codeChefDepartement: string;
  chefDepartement?: IUtilisateur;
  filieres?: IFiliere[];
}

export interface IUpdateDepartement {
  intituleDepartement: string;
  codeChefDepartement: string;
}

export interface ICreateDepartement {
  codeDepartement: string;
  intituleDepartement: string;
  codeChefDepartement: string;
}

export interface IFiliere {
  codeFiliere: string;
  intituleFiliere: string;
  codeDepartement: string;
  codeChefFiliere: string | null;
  chefFiliere: IUtilisateur | null;
  semestres?: ISemestre[];
  departement?: IDepartement;
}

export interface IUpdateFiliere {
  intituleFiliere: string;
  codeChefFiliere: string | null;
  codeDepartement: string | null;
}

export interface ICreateFiliere {
  codeFiliere: string;
  intituleFiliere: string;
  codeChefFiliere?: string | null;
  codeDepartement: string;
}

export interface ISemestre {
  codeSemestre: string;
  codeFiliere: string;
  intituleSemestre: string;
  modules?: IModule[];
  filiere?: IFiliere;
}

export interface IUpdateSemestre {
  intituleSemestre: string;
  codeFiliere: string | null;
}

export interface ICreateSemestre {
  codeSemestre: string;
  intituleSemestre: string;
  codeFiliere: string;
}

export interface IModule {
  codeModule: string;
  intituleModule: string;
  coefficientModule: number;
  codeSemestre: string;
  elements: IElement[];
  semestre: ISemestre;
}

export interface IUpdateModule {
  intituleModule: string;
  codeSemestre: string | null;
  coefficientModule: number;
}

export interface ICreateModule {
  codeModule: string;
  intituleModule: string;
  codeSemestre: string;
  coefficientModule: number;
}

export interface IElement {
  codeElement: string;
  intituleElement: string;
  coefficientElement: number;
  codeModule: string;
  codeProfesseur: string;
  professeur?: IUtilisateur;
}

export interface IPagination<Item> {
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  records: Item[];
}

export interface IPaging {
  pageIndex: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface IRole {
  roleId: string;
  roleName: string;
  permissions?: IPermission[];
  groupe?: string;
}

export interface IUpdateRole {
  roleId?: string;
  permissions?: number[];
  groupe?: string;
  roleName?: string;
}

export interface IPermission {
  permissionId: string;
  permissionName: string;
  path?: string;
  method?: string;
  groupe?: string;
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

export interface IExceptionResponse {
  code?: number;
  status?: string;
  message?: string;
  identifiers?: string[];
  errors: IValidationError[];
  error?: string;
  path?: string;
  timestamp?: string;
}

export interface IValidationError {

  field: string
  message: string
}


/* ************************************************************************************************************ 
  the below part concerns notes dtos 
*/

export interface AcademicRecord {
  idSession: string;
  idInscription: string;
  codeSemestre: string;
  sessionType: string;
  note: number;
  sessionResult: null | string;
  notes: Note[];
  inscription: Inscription;
}

interface Note {
  codeModule: string;
  sessionId: string;
  note: number;
  redoublant: boolean;
  module: Module;
  notesElement: ElementRecord[];
}

interface Module {
  codeModule: string;
  intituleModule: string;
  coefficientModule: number;
  codeSemestre: string;
}

interface ElementRecord {
  codeElement: string;
  sessionId: string;
  note: number;
  redoublant: boolean;
  element: Element;
}

interface Element {
  codeElement: string;
  intituleElement: string;
  coefficientElement: number;
  codeModule: string;
  codeProfesseur: string | null;
}

interface Inscription {
  id: string;
  etudiant: Etudiant;
  codeFiliere: string;
  codeSessionUniversitaire: string;
  annee: number;
  etat: string;
  note: number;
}

interface Etudiant {
  code: string;
  cne: string;
  nom: string;
  prenom: string;
  cin: string;
  telephone: string;
  adresse: string;
  dateNaissance: string;
  ville: string;
  pays: string;
  photo: string;
}


export interface DeliberationData {
  numero: string;
  nom: string;
  prenom: string;
  naissance: string;
  sessionType: string;
  modules: Array<Array<ModuleData>>;
}

export interface ModuleData 
{
  code: string;
  nom: string;
  note: number;
  bareme: number;
}


export interface SessionUniv {
  id: string;
  startDate: string;
  endDate: string;
  etat: string
}

