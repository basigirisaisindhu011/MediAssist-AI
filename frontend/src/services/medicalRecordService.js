import api from './api';

export const medicalRecordService = {
  getRecords: async () => {
    const response = await api.get('/medical-records');
    return response.data;
  },

  uploadRecord: async (formData) => {
    const response = await api.post('/medical-records/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteRecord: async (id) => {
    const response = await api.delete(`/medical-records/${id}`);
    return response.data;
  },

  getDownloadUrl: (id) => {
    return `${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/medical-records/${id}/download`;
  }
};

export default medicalRecordService;
