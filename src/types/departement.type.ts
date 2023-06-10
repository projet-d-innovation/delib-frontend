import { IUtilisateur, IFiliere } from "./interfaces"

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