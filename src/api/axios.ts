import axios from 'axios';


// const baseURL = import.meta.env.VITE_BACKEND_URL as string
const baseURL = ""

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: (params) => {
    const searchParams = new URLSearchParams();
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const param = params[key];
        if (Array.isArray(param)) {
          param.forEach((value) => {
            searchParams.append(key, value);
          });
        } else {
          searchParams.append(key, param);
        }
      }
    }
    return searchParams.toString();
  }
});

const auth_api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);

export {
  api,
  auth_api,
};

