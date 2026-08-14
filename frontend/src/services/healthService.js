import api from './api';

export const healthService = {
  getProfile: async () => {
    const response = await api.get('/health-profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/health-profile', profileData);
    return response.data;
  },

  createProfile: async (profileData) => {
    const response = await api.post('/health-profile', profileData);
    return response.data;
  }
};

export default healthService;
