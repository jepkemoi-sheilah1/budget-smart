import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjusted backend URL to include /api prefix
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // if backend uses cookies for auth
});

export default api;
