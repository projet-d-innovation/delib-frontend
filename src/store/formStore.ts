import { create } from "zustand";

export interface FormState {
  state: string,
  update: () => void,
  create: () => void,
}

const useFormState = create<FormState>((set, get) => ({
  state: "create",
  update: () => {
    set({ state: "edit" })
  },
  create: () => {
    set({ state: "create" })
  }
}))

export default useFormState;
