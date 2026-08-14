import api from './api';

export const aiService = {
  analyzeSymptoms: async (symptomData) => {
    // Calls Spring Boot backend proxy /api/ai/analyze-symptoms
    const response = await api.post('/ai/analyze-symptoms', symptomData);
    return response.data;
  },

  calculateRiskScore: async (riskData) => {
    // Calls Spring Boot backend proxy /api/ai/risk-score
    const response = await api.post('/ai/risk-score', riskData);
    return response.data;
  },

  summarizeReport: async (reportData) => {
    // Calls Spring Boot backend proxy /api/ai/summarize-report
    const response = await api.post('/ai/summarize-report', reportData);
    return response.data;
  }
};

export default aiService;
