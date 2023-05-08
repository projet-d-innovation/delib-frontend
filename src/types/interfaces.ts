
export interface IEtudiant {
  code: string,
  cin: string,
  cne: string,
  nom: string,
  prenom: string,
  telephone: string,
  adresse: string,
  dateNaissance: Date,
  ville: string,
  pays: string,
  photo: string
}

export interface IProfesseur {
  code: string,
  nom: string,
  prenom: string,
  telephone: string,
  photo: string,
  codeDepartement: string,
  departement: IDepartement,
  elements?: IElement[]
}

export interface IUtilisateur {
  code: string,
  nom: string,
  prenom: string,
  telephone: string,
  photo?: string,
  roles?: IRoleWithoutPermissions[]
}

export interface IDepartement {
  codeDepartement: string,
  intituleDepartement: string,
  codeChefDepartement: string
  chefDepartement?: IUtilisateur,
}


export interface ISemestre {
  codeSemestre: string,
  codeFiliere: string,
  intituleSemestre: string
}

export interface IModule {
  codeModule: string,
  intituleModule: string,
  coefficientModule: number,
  codeSemestre: string
}


export interface IElement {
  codeElement: string,
  intituleElement: string,
  coefficientElement: number,
  codeModule: string,
  codeProfesseur: string
}




export interface IPagination<Item> {
  page: number
  size: number
  totalPages: number
  totalElements: number
  records: Item[]
}

export interface IPermission {
  permissionId: string,
  permissionName: string,
  path: string
}

export interface IRole {
  roleId: string,
  roleName: string,
  permissions: IPermission[]
}

export interface IRoleWithoutPermissions {
  roleId: string,
  roleName: string,
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