import { create } from "zustand";
import { IPaging } from "../types/interfaces";


export interface PaginationState {
  paginations: Map<string, IPaging>
  getPagination: (key: string) => IPaging | undefined
  setPagination: (key: string, pagination: IPaging) => void
}


const usePaginationState = create<PaginationState>((set, get) => ({
  paginations: new Map(),
  setPagination: (key, pagination) => {
    set((state) => {
      const paginations = state.paginations
      paginations.set(key, pagination)
      return { paginations }
    })
  },
  getPagination: (key) => {
    return get().paginations.get(key) || undefined
  }
}))


export default usePaginationState;

