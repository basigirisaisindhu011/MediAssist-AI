import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import healthService from '../services/healthService';
import appointmentService from '../services/appointmentService';
import medicalRecordService from '../services/medicalRecordService';
import {
  Activity,
  HeartPulse,
  FileText,
  Calendar,
  FolderOpen,
  ArrowRight,
  Sparkles,
  User,
  Loader2,
  AlertCircle,
  Clock,
  Plus
} from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    Promise.allSettled([
      healthService.getProfile(),
      appointmentService.getAppointments(),
      medicalRecordService.getRecords(),
    ])
      .then(([profileRes, appointmentsRes, recordsRes]) => {
        if (!isMounted) return;
        if (profileRes.status === 'fulfilled') setProfile(profileRes.value);
        if (appointmentsRes.status === 'fulfilled') setAppointments(appointmentsRes.value || []);
        if (recordsRes.status === 'fulfilled') setRecords(recordsRes.value || []);
        setLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setError('Failed to load dashboard data. Please try refreshing.');
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const upcomingAppointments = appointments
    .filter((app) => app.status === 'BOOKED')
    .slice(0, 3);

  const calculateBmi = (weightKg, heightCm) => {
    if (!weightKg || !heightCm) return null;
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    return bmi.toFixed(1);
  };

  const bmiVal = profile ? calculateBmi(profile.weightKg, profile.heightCm) : null;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin text-sky-600 mb-3" />
        <p className="font-medium animate-pulse">Loading dashboard insights...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl glass-panel p-6 sm:p-8 bg-gradient-to-r from-sky-600/90 via-teal-600/90 to-indigo-600/90 text-white shadow-xl">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-white">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Care Gateway Active</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Patient'}!
          </h1>
          <p className="text-sky-100 max-w-xl text-sm sm:text-base">
            Track your health vitals, run preliminary AI symptom checks, evaluate health risks, and manage your clinical appointments.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400 text-sm flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card p-5 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">BMI Metric</span>
            <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {bmiVal ? `${bmiVal}` : 'N/A'}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">kg/m²</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {profile ? `Height: ${profile.heightCm || 0}cm | Weight: ${profile.weightKg || 0}kg` : 'No health profile set'}
          </p>
        </div>

        <div className="glass-card p-5 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Upcoming Appointments</span>
            <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {upcomingAppointments.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">scheduled</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Total appointments: {appointments.length}
          </p>
        </div>

        <div className="glass-card p-5 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Blood Group</span>
            <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <HeartPulse className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {profile?.bloodGroup || 'Not set'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Allergies: {profile?.allergies || 'None logged'}
          </p>
        </div>

        <div className="glass-card p-5 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Medical Vault</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <FolderOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {records.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">documents</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Lab reports & prescriptions
          </p>
        </div>
      </div>

      {/* AI Quick Launch Tools */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-sky-600" />
          <span>AI Clinical Intelligence Tools</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/symptom-checker"
            className="glass-card p-6 flex flex-col justify-between hover:border-sky-500/50 group transition-all"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                AI Symptom Checker
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Describe your symptoms for an instant preliminary assessment and specialist recommendation.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-sky-600 dark:text-sky-400">
              <span>Analyze Symptoms</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/risk-evaluator"
            className="glass-card p-6 flex flex-col justify-between hover:border-teal-500/50 group transition-all"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <HeartPulse className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                Health Risk Evaluator
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Calculate your cardiovascular and metabolic risk score using vital clinical metrics.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-teal-600 dark:text-teal-400">
              <span>Calculate Risk Score</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/report-summarizer"
            className="glass-card p-6 flex flex-col justify-between hover:border-indigo-500/50 group transition-all"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Medical Report Summarizer
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Transform complex diagnostic documents into readable executive clinical summaries.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <span>Summarize Report</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Upcoming Appointments Section */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-teal-600" />
            <span>Upcoming Scheduled Appointments</span>
          </h2>
          <Link
            to="/appointments"
            className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center space-x-1"
          >
            <span>Book / View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {upcomingAppointments.length === 0 ? (
          <div className="text-center py-8 px-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
            <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No upcoming appointments scheduled</p>
            <Link
              to="/appointments"
              className="mt-3 inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule New Appointment</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingAppointments.map((app) => (
              <div
                key={app.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {app.doctorName}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-semibold">
                      {app.specialty}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Reason: {app.reason}
                  </p>
                </div>
                <div className="flex items-center space-x-4 text-xs">
                  <div className="text-slate-600 dark:text-slate-300">
                    <span className="font-medium">{app.appointmentDate}</span> at{' '}
                    <span className="font-medium">{app.appointmentTime}</span>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                    BOOKED
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
