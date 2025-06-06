import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Se utiliza la variable de entorno
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("AUTH_TOKEN");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default api;