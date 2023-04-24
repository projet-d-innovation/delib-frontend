import { create } from "zustand";

export interface NavState {
  opened: boolean,
  close: () => void,
  open: () => void,
  toggle: () => void
}



const useNavStore = create<NavState>((set, get) => ({
  opened: false,
  toggle: () => {
    set((state) => ({ opened: !state.opened }))
  },
  close: () => {
    set({ opened: false })
  },
  open: () => {
    set({ opened: true })
  }
}))


export default useNavStore;

