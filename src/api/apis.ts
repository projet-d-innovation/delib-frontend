import { api } from "./axiosInstanciation";

const url = import.meta.env.VITE_BACKEND_URL as string;

export const gatewayApi = api(url);
