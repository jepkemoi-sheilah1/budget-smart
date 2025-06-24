import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Adjust the backend URL as needed
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // if backend uses cookies for auth
});

export default api;
