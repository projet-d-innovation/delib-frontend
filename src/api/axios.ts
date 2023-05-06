import axios from 'axios';


const baseURL = import.meta.env.BASE_URL as string

const myBaseURL = 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const auth_api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const utilisateur_api = axios.create({
  baseURL: myBaseURL+'/administration',
  headers: {
    'Content-Type': 'application/json',
  },
});


const role_api = axios.create({
  baseURL: myBaseURL+'/utilisateurs',
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
  utilisateur_api,
  role_api
};

