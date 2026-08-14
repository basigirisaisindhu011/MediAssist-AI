import api from './api';

export const appointmentService = {
  getAppointments: async () => {
    const response = await api.get('/appointments');
    return response.data;
  },

  createAppointment: async (appointmentData) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },

  cancelAppointment: async (id) => {
    const response = await api.put(`/appointments/${id}/cancel`);
    return response.data;
  }
};

export default appointmentService;
