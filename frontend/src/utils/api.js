
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust this URL to your backend server
  withCredentials: true,  // Allow cookies/session to be sent
});

export default api;
