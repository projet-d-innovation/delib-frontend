import { IAuth } from '../types/interfaces';
import { auth_api } from './axios';

export const login = async (email: string, password: string): Promise<IAuth> => {

  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJhZG1pbkBtYWlsLmNvbSIsIm5hbWUiOiJhZG1pbiIsInJvbGUiOlt7InJvbGVJZCI6IjEiLCJyb2xlTmFtZSI6ImFkbWluIiwicGVybWlzc2lvbnMiOlt7InBlcm1pc3Npb25JZCI6IkFDQ0VTU19EQVNIQk9BUkQiLCJwZXJtaXNzaW9uTmFtZSI6IkFDQ0VTU19EQVNIQk9BUkQiLCJwYXRoIjoiL2Rhc2hib2FyZCJ9XX1dLCJpYXQiOjE1MTYyMzkwMjJ9.9QcOYpzlok_pSRjT2iHjY27eXmVByG7moCex1n7ZBSQ"
  }
  // return auth_api.post('/auth/login', {
  //   email,
  //   password,
  // });
}