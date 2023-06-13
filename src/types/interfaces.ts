export interface IUtilisateur {
  code: string
  cin?: string
  cne?: string
  nom: string
  prenom: string
  telephone?: string
  adresse?: string
  dateNaissance?: Date
  ville?: string
  sexe?: string
  pays?: string
  photo?: string
  roles?: IRole[]
}

export interface IDepartement {
  codeDepartement: string
  intituleDepartement: string
  codeChefDepartement: string
  chefDepartement?: IUtilisateur
  filieres?: IFiliere[]
}

export interface IUpdateDepartement {
  intituleDepartement: string
  codeChefDepartement: string
}

export interface ICreateDepartement {
  codeDepartement: string
  intituleDepartement: string
  codeChefDepartement: string
}

export interface IFiliere {

  codeFiliere: string
  intituleFiliere: string
  codeDepartement: string
  codeChefFiliere: string | null
  chefFiliere: IUtilisateur | null
  semestres?: ISemestre[]
  departement?: IDepartement
}


export interface IUpdateFiliere {
  intituleFiliere: string
  codeChefFiliere: string | null
  codeDepartement: string | null
}

export interface ICreateFiliere {
  codeFiliere: string
  intituleFiliere: string
  codeChefFiliere?: string | null
  codeDepartement: string
}

export interface ISemestre {
  codeSemestre: string
  codeFiliere: string
  intituleSemestre: string
  modules?: IModule[]
  filiere?: IFiliere
}

export interface IUpdateSemestre {
  intituleSemestre: string
  codeFiliere: string | null
}

export interface ICreateSemestre {
  codeSemestre: string
  intituleSemestre: string
  codeFiliere: string
}


export interface IModule {
  codeModule: string
  intituleModule: string
  coefficientModule: number
  codeSemestre: string
  elements: IElement[]
  semestre: ISemestre
}


export interface IUpdateModule {
  intituleModule: string
  codeSemestre: string | null
  coefficientModule: number
}

export interface ICreateModule {
  codeModule: string
  intituleModule: string
  codeSemestre: string
  coefficientModule: number
}

export interface IElement {
  codeElement: string
  intituleElement: string
  coefficientElement: number
  codeModule: string
  codeProfesseur: string
  professeur?: IUtilisateur
}




export interface IPagination<Item> {
  page: number
  size: number
  totalPages: number
  totalElements: number
  records: Item[]
}

export interface IPaging {
  pageIndex: number,
  pageSize: number,
  totalItems: number,
  totalPages: number,
}

export interface IRole {
  roleId: string
  roleName: string
  permissions?: IPermission[]
  groupe?: string
}
export interface IPermission {
  permissionId: string
  permissionName: string
  path?: string
  method?: string
  groupe?: string
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
  code?: number
  status?: string
  message?: string
  identifiers?: string[]
  errors: IValidationError[]
  error?: string
  path?: string
  timestamp?: string
}

export interface IValidationError {
  field: string
  message: string
}