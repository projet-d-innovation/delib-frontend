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
  pays?: string
  photo?: string
  roles?: IRole[]
}


export interface IFiliere {

  codeFiliere: string
  intituleFiliere: string
  codeDepartement: string
  codeChefFiliere: string
  chefFiliere: IUtilisateur
  semestres?: ISemestre[]
}


export interface ISemestre {
  codeSemestre: string
  codeFiliere: string
  intituleSemestre: string
  modules?: IModule[]
}

export interface IModule {
  codeModule: string
  intituleModule: string
  coefficientModule: number
  codeSemestre: string
  elements: IElement[]
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