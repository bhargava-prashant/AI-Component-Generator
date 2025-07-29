
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ai-component-generator-0akk.onrender.com/api', // Adjust this URL to your backend server
  withCredentials: true,  // Allow cookies/session to be sent
});

export default api;
