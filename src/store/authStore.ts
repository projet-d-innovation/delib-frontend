import { create } from "zustand";
import { IAuth, IUser } from "../types/interfaces";
import jwt_decode from "jwt-decode";

export interface AuthState {
  user: IUser | null,
  error: string | null,
  loading: boolean,
  isAuthenticated: boolean,
  mounted: boolean,
  getPermissions: () => string[],
  login: (email: string, password: string) => Promise<boolean>
  isAdmin: () => boolean,
  isPermeted: (permission: string) => boolean,
  loadUser: () => Promise<void>,
  logout: () => void
}



const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  error: null,
  loading: false,
  isAuthenticated: false,
  mounted: false,
  login: async (email, password) => {

    console.log("login", {
      email,
      password
    })

    set((state) => ({ ...state, loading: true }))



    // for testing

    await new Promise((resolve) => setTimeout(resolve, 500))

    const data: IAuth | null = {
      accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJhZG1pbkBtYWlsLmNvbSIsIm5hbWUiOiJhZG1pbiIsInJvbGUiOlt7InJvbGVJZCI6IjEiLCJyb2xlTmFtZSI6ImFkbWluIiwicGVybWlzc2lvbnMiOlt7InBlcm1pc3Npb25JZCI6IkFDQ0VTU19EQVNIQk9BUkQiLCJwZXJtaXNzaW9uTmFtZSI6IkFDQ0VTU19EQVNIQk9BUkQiLCJwYXRoIjoiL2Rhc2hib2FyZCJ9XX1dLCJpYXQiOjE1MTYyMzkwMjJ9.9QcOYpzlok_pSRjT2iHjY27eXmVByG7moCex1n7ZBSQ"
    }

    // end for testing


    if (!data) {
      set({ user: null, error: "Something went wrong", loading: false, isAuthenticated: false })
      return false
    }

    localStorage.setItem('access_token', data.accessToken);

    const user = jwt_decode(data.accessToken) as IUser

    console.log("USER : ", user)

    set({ user, loading: false, error: null, isAuthenticated: true })

    return true
  },
  isAdmin: () => {
    const user = get().user
    if (!user) return false
    const notAdmin = user.role.length == 1 && user.role.find(role => role.roleName === "ETUDIANT")
    return !notAdmin
  },
  isPermeted: (perm) => {
    const permissions = get().getPermissions()
    console.log("isPermeted :", permissions.includes(perm))
    return permissions.includes(perm)
  },
  loadUser: async () => {
    set((state) => ({ ...state, mounted: true }))
    const token = localStorage.getItem('access_token')


    if (!token) {
      console.log("no token ")
      set({ user: null, error: null, loading: false, isAuthenticated: false, mounted: true })
      return
    }

    // TODO : check if token is expired

    const user = jwt_decode(token) as IUser

    set({ user, loading: false, error: null, isAuthenticated: true, mounted: true })
    console.log("loaded user : ", user)
  },
  logout: () => {
    localStorage.removeItem('access_token')
    set({ user: null, error: null, loading: false, isAuthenticated: false, mounted: true })
  },
  getPermissions: () => {
    const user = get().user
    if (!user) return []
    const permissions = user.role.map(role => role.permissions.map(permission => permission.permissionId))
    return permissions.flat()
  }
}))


export default useAuthStore;

