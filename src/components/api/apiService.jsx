// apiService.js
import axios from 'axios';

const BASE_URL = 'https://room-craft-api.vercel.app/api';

const api = axios.create({
  baseURL: BASE_URL,
});

const apiService = {
  fetchProducts: async () => {
    try {
      const response = await api.get('/productlist/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },
 
  // Other API methods...
};

export default apiService;
