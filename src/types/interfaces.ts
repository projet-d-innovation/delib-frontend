
export class Etudiant {
  code!: string;
  cin!: string;
  cne!: string;
  nom!: string;
  prenom!: string;
  telephone!: string;
  adresse!: string;
  dateNaissance!: Date;
  ville!: string;
  pays!: string;
  photo!: string;

  get id(): string {
    return this.code;
  }
  
}

export class Professeur {
  code!: string;
  nom!: string;
  prenom!: string;
  telephone!: string;
  photo!: string;
  codeDepartement!: string;
  departement!: Departement;
  elements?: IElement[];

  get id(): string {
    return this.code;
  }
}

export interface IUtilisateur {
  code: string,
  nom: string,
  prenom: string,
  telephone: string,
  photo?: string,
  roles?: IRoleWithoutPermissions[]
}

export class Utilisateur {
  code!: string;
  nom!: string;
  prenom!: string;
  telephone!: string;
  photo?: string
  roles?: IRoleWithoutPermissions[]

  get id(): string {
    return this.code;
  }
  
}

export class Departement {
  codeDepartement!: string;
  intituleDepartement!: string;
  codeChefDepartement!: string;
  chefDepartement?: Utilisateur

  constructor(departement?: Departement) {
    if (departement) {
      this.codeDepartement = departement.codeDepartement;
      this.intituleDepartement = departement.intituleDepartement;
      this.codeChefDepartement = departement.codeChefDepartement;
      this.chefDepartement = departement.chefDepartement

    }
  }


  get id() : string {
    return this.codeDepartement;
  }
}


export interface ISemestre {
  codeSemestre: string,
  codeFiliere: string,
  intituleSemestre: string
}

export interface IModule {
  code: string,
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


export type ResponseApi<Type> = {
  page: number,
  size: number,
  totalPages: number,
  totalElements: number,
  records: Array<Type> | null
}
