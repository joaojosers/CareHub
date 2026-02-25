import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // URL do backend NestJS
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
