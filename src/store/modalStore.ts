import { create } from "zustand";

export interface ModalState {
  opened: boolean,
  close: () => void,
  open: () => void,
}



const useModalState = create<ModalState>((set, get) => ({
  opened: false,
  close: () => {
    set({ opened: false })
  },
  open: () => {
    set({ opened: true })
  }
}))


export default useModalState;

