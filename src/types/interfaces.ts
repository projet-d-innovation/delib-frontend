
// export interface IEtudiant {
//   code: string,
//   nom: string,
//   prenom: string,
//   email: string,
//   telephone: string,
//   dateNaissance: string,
//   lieuNaissance: string,
//   adresse: string,
//   ville: string,
//   pays: string,
//   sexe: string,
// }

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


export interface IUser {
  id: string;
  name: string;
  email: string;
  role: IRole[];
}

export interface IAuth {
  accessToken: string;
}