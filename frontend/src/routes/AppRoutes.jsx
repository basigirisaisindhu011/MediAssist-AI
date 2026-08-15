import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../layouts/Layout';
import ProtectedRoute from '../components/ProtectedRoute';

import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import SymptomChecker from '../pages/SymptomChecker';
import AiAssistant from '../pages/AiAssistant';
import HealthRiskEvaluator from '../pages/HealthRiskEvaluator';
import ReportSummarizer from '../pages/ReportSummarizer';
import Appointments from '../pages/Appointments';
import HealthProfile from '../pages/HealthProfile';
import MedicalRecords from '../pages/MedicalRecords';
import Settings from '../pages/Settings';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Portal Routes inside Layout */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/symptom-checker" element={<SymptomChecker />} />
        <Route path="/ai-assistant" element={<AiAssistant />} />
        <Route path="/risk-evaluator" element={<HealthRiskEvaluator />} />
        <Route path="/report-summarizer" element={<ReportSummarizer />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/health-profile" element={<HealthProfile />} />
        <Route path="/medical-records" element={<MedicalRecords />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Fallback Catch-all Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
