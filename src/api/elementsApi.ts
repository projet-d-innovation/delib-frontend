import { IElement } from "../types/interfaces";
import { api } from "./axios";

const ELEMENTS_BASE_URL = "http://localhost:3000/elements";

export const getElements = async (): Promise<IElement[]> => {
  const { data } = await api.get(ELEMENTS_BASE_URL);
  return data;
};

export const getElement = async (elementId: string): Promise<IElement> => {
  const { data } = await api.get(`${ELEMENTS_BASE_URL}/${elementId}`);
  return data;
};
