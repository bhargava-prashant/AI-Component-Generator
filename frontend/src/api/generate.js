import axios from 'axios';

export const generateComponent = async (formData) => {
  return await axios.post('/api/generate', formData);
};
