import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.133.2.60:8080',
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});

export default api;
