import { IPagination, IPermission, IUtilisateur } from '../types/interfaces';
import { api } from './axios';

import { faker } from "@faker-js/faker"
import { getRoles } from './roleApi';


export const getUtilisateurs = async ({ page, size = 10 }: {
  page: number,
  size?: number
}): Promise<IPagination<IUtilisateur>> => {

  await new Promise((resolve) => setTimeout(resolve, 1000))

  const roles = await getRoles({ page: 1, size: 10 })


  const utilisateurs: IUtilisateur[] = Array.from({ length: 60 }, () => ({
    code: faker.random.word(),
    nom: faker.random.word(),
    prenom: faker.random.word(),
    telephone: faker.random.word(),
    photo: faker.image.avatar(),
    roles: roles.records.slice(0, Math.floor(Math.random() * 2) + 1)
  })
  )

  return {
    page: page,
    size: size,
    totalPages: utilisateurs.length / size,
    totalElements: utilisateurs.length,
    records: utilisateurs.slice((page - 1) * size, page * size)
  }
  // return api.get('/utilisateurs');
}


export const getUtilisateur = async (utilisateurId: string): Promise<IUtilisateur> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const roles = await getRoles({ page: 1, size: 10 })

  const utilisateurs: IUtilisateur = {
    code: faker.random.word(),
    nom: faker.random.word(),
    prenom: faker.random.word(),
    telephone: faker.random.word(),
    photo: faker.image.avatar(),
    roles: roles.records.slice(0, Math.floor(Math.random() * 2) + 1)
  }

  return utilisateurs;
  // return api.get(`/utilisateurs/${utilisateurId}`);
}