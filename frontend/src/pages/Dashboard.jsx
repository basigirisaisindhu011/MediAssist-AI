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
  Plus,
  Bot,
  Zap,
  ShieldAlert,
  PhoneCall
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

  const recentRecords = records.slice(0, 3);

  const calculateBmi = (weightKg, heightCm) => {
    if (!weightKg || !heightCm) return null;
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    return bmi.toFixed(1);
  };

  const bmiVal = profile ? calculateBmi(profile.weightKg, profile.heightCm) : null;

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin text-sky-500 mb-3" />
        <p className="font-semibold text-sm animate-pulse">Initializing your AI Health Portal...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl glass-panel p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-sky-950 to-teal-950 text-white shadow-2xl border border-slate-800">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Your AI-Powered Health Companion</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {getTimeGreeting()}, {user?.name || 'Patient'}!
          </h1>
          <p className="text-slate-300 max-w-xl text-sm sm:text-base leading-relaxed">
            Monitor baseline vitals, evaluate new symptoms using clinical AI, summarize lab reports, and manage upcoming specialist appointments.
          </p>
        </div>

        {/* Ambient Glow Pill */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card p-5 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">BMI Metric</span>
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center">
              <User className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-100">
              {bmiVal ? `${bmiVal}` : '23.5'}
            </span>
            <span className="text-xs font-medium text-slate-400">kg/m²</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {profile ? `H: ${profile.heightCm || 0}cm | W: ${profile.weightKg || 0}kg` : 'Optimal range recorded'}
          </p>
        </div>

        <div className="glass-card p-5 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Scheduled Visits</span>
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center">
              <Calendar className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-100">
              {upcomingAppointments.length}
            </span>
            <span className="text-xs font-medium text-slate-400">upcoming</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Total appointments: {appointments.length}
          </p>
        </div>

        <div className="glass-card p-5 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Blood Group</span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
              <HeartPulse className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-100">
              {profile?.bloodGroup || 'O+'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 truncate">
            Allergies: {profile?.allergies || 'Penicillin'}
          </p>
        </div>

        <div className="glass-card p-5 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Medical Vault</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
              <FolderOpen className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-100">
              {records.length}
            </span>
            <span className="text-xs font-medium text-slate-400">documents</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Lab reports & prescriptions
          </p>
        </div>
      </div>

      {/* Quick AI Clinical Action Launch Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <Zap className="w-5 h-5 text-sky-400" />
            <span>Quick AI Clinical Actions</span>
          </h2>
          <span className="text-xs text-slate-400">Instant AI Gateway</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Link
            to="/symptom-checker"
            className="glass-card p-5 flex flex-col justify-between hover:border-sky-500/50 group transition-all"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base group-hover:text-sky-400 transition-colors">
                Analyze Symptoms
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Run preliminary AI clinical symptom triage & specialist routing.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold text-sky-400">
              <span>Launch Triage</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/ai-assistant"
            className="glass-card p-5 flex flex-col justify-between hover:border-teal-500/50 group transition-all"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base group-hover:text-teal-400 transition-colors">
                Ask AI Assistant
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Interactive 24/7 medical chat assistant for wellness questions.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold text-teal-400">
              <span>Open Chat</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/risk-evaluator"
            className="glass-card p-5 flex flex-col justify-between hover:border-indigo-500/50 group transition-all"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <HeartPulse className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base group-hover:text-indigo-400 transition-colors">
                Health Risk Evaluator
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calculate cardiovascular risk scores using baseline vitals.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold text-indigo-400">
              <span>Calculate Score</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/report-summarizer"
            className="glass-card p-5 flex flex-col justify-between hover:border-emerald-500/50 group transition-all"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base group-hover:text-emerald-400 transition-colors">
                Summarize Report
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Extract key metrics & executive summary from medical files.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold text-emerald-400">
              <span>Upload Document</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Main Section: Upcoming Appointments & Recent Vault Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments Widget */}
        <div className="glass-card p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-teal-400" />
              <span>Upcoming Scheduled Appointments</span>
            </h2>
            <Link
              to="/appointments"
              className="text-xs font-bold text-sky-400 hover:underline flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-8 px-4 rounded-xl border border-dashed border-slate-800">
              <Clock className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-xs text-slate-400 font-medium">No upcoming clinical appointments</p>
              <Link
                to="/appointments"
                className="mt-3 inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-sky-600 rounded-xl hover:bg-sky-500 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Book Appointment</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.map((app) => (
                <div
                  key={app.id}
                  className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-slate-100">{app.doctorName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 font-bold border border-sky-500/20">
                        {app.specialty}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{app.reason}</p>
                  </div>
                  <div className="text-right text-xs text-slate-300 shrink-0">
                    <div className="font-bold">{app.appointmentDate}</div>
                    <div className="text-slate-500">{app.appointmentTime}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Medical Vault Documents */}
        <div className="glass-card p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
              <FolderOpen className="w-5 h-5 text-indigo-400" />
              <span>Recent Vault Documents</span>
            </h2>
            <Link
              to="/medical-records"
              className="text-xs font-bold text-indigo-400 hover:underline flex items-center space-x-1"
            >
              <span>Manage Vault</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentRecords.length === 0 ? (
            <div className="text-center py-8 px-4 rounded-xl border border-dashed border-slate-800">
              <FileText className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-xs text-slate-400 font-medium">No medical files uploaded yet</p>
              <Link
                to="/medical-records"
                className="mt-3 inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Report</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentRecords.map((r) => (
                <div
                  key={r.id}
                  className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-100">{r.title}</h4>
                      <span className="text-[10px] text-slate-400">{r.recordType}</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">{r.recordDate}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Emergency Contact & Health Guidance Notice */}
      <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-amber-300">Clinical Emergency Notice</h4>
            <p className="text-xs text-amber-200/80">
              If you are experiencing severe chest pain, shortness of breath, or emergency symptoms, contact local medical emergency services (911 / 112) immediately.
            </p>
          </div>
        </div>
        <div className="shrink-0">
          <Link
            to="/health-profile"
            className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-bold transition-colors inline-flex items-center space-x-1.5"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Emergency Contacts</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
