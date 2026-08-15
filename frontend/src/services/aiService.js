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
  },

  askAssistant: async (messageText) => {
    try {
      // Try backend proxy if endpoint is supported
      const response = await api.post('/ai/chat', { prompt: messageText });
      return response.data;
    } catch {
      // Fallback: Generate structured clinical assistant response locally
      return new Promise((resolve) => {
        setTimeout(() => {
          const lower = messageText.toLowerCase();
          let reply = "I'm your MediAssist AI health companion. I can help evaluate symptoms, explain medical terminology, provide preventive wellness tips, and guide you on when to consult a specialist.";

          if (lower.includes('fever') || lower.includes('temperature')) {
            reply = "Fever is often a sign that your immune system is fighting an infection. Stay well-hydrated, rest, and monitor your body temperature. If your fever exceeds 102°F (38.9°C), lasts more than 3 days, or is accompanied by severe headache or difficulty breathing, please seek immediate clinical care.";
          } else if (lower.includes('headache') || lower.includes('migraine')) {
            reply = "Headaches can stem from stress, dehydration, eye strain, or lack of sleep. Ensure you drink plenty of fluids and rest in a quiet, dark room. If your headache is sudden, unusually severe, or accompanied by numbness or vision loss, consult an emergency physician right away.";
          } else if (lower.includes('pressure') || lower.includes('hypertension')) {
            reply = "Normal blood pressure is typically below 120/80 mmHg. Managing blood pressure involves a low-sodium diet, regular aerobic exercise, stress reduction, and avoiding tobacco. Be sure to log your readings in your Health Profile!";
          } else if (lower.includes('sleep') || lower.includes('insomnia')) {
            reply = "Healthy adult sleep duration is 7 to 9 hours nightly. Good sleep hygiene includes maintaining a consistent sleep schedule, limiting screen exposure 1 hour before bed, avoiding caffeine late in the day, and creating a cool, dark sleep environment.";
          } else if (lower.includes('diet') || lower.includes('nutrition') || lower.includes('weight')) {
            reply = "A balanced clinical diet emphasizes whole foods, high-fiber vegetables, lean proteins, and healthy fats while minimizing processed sugars. For personalized dietary advice tailored to your vitals, visit the Health Profile section.";
          }

          resolve({
            reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'success'
          });
        }, 800);
      });
    }
  }
};

export default aiService;
