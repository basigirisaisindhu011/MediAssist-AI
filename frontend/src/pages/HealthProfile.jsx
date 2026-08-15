import { useState, useEffect } from 'react';
import healthService from '../services/healthService';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import {
  User,
  HeartPulse,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Phone,
  Activity,
  Shield
} from 'lucide-react';

export const HealthProfile = () => {
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(72);
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [allergies, setAllergies] = useState('Penicillin');
  const [medicalHistory, setMedicalHistory] = useState('Mild seasonal asthma');
  const [emergencyContact, setEmergencyContact] = useState('+1 (555) 234-5678');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let isMounted = true;
    healthService.getProfile()
      .then((data) => {
        if (!isMounted) return;
        if (data) {
          setHeightCm(data.heightCm || 175);
          setWeightKg(data.weightKg || 72);
          setBloodGroup(data.bloodGroup || 'O+');
          setAllergies(data.allergies || '');
          setMedicalHistory(data.medicalHistory || '');
          setEmergencyContact(data.emergencyContact || '');
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        if (err.response?.status !== 404) {
          setError('Could not load existing health profile.');
        }
        setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess('');

    const payload = {
      heightCm: Number(heightCm),
      weightKg: Number(weightKg),
      bloodGroup,
      allergies,
      medicalHistory,
      emergencyContact,
    };

    try {
      await healthService.updateProfile(payload);
      setSuccess('Health profile updated successfully!');
    } catch {
      try {
        await healthService.createProfile(payload);
        setSuccess('Health profile created successfully!');
      } catch {
        setError('Failed to save health profile.');
      }
    } finally {
      setSaving(false);
    }
  };

  const bmiVal = heightCm && weightKg ? (weightKg / ((heightCm / 100) ** 2)).toFixed(1) : null;

  // Mock Recharts Trend Data based on current profile
  const vitalsTrendData = [
    { month: 'Jan', weight: Number(weightKg) + 3, bmi: Number(bmiVal) + 1 },
    { month: 'Feb', weight: Number(weightKg) + 2, bmi: Number(bmiVal) + 0.6 },
    { month: 'Mar', weight: Number(weightKg) + 1, bmi: Number(bmiVal) + 0.3 },
    { month: 'Current', weight: Number(weightKg), bmi: Number(bmiVal) || 23.5 },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin text-sky-600 mb-3" />
        <p className="font-medium animate-pulse">Loading patient health profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 bg-gradient-to-r from-sky-600/90 to-indigo-600/90 text-white rounded-2xl shadow-xl">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-md">
            <User className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Patient Health Profile
          </h1>
        </div>
        <p className="text-sky-100 text-sm sm:text-base max-w-xl">
          Manage your baseline vitals, known allergies, chronic conditions, emergency contact info, and health metric trends.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-sm flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400 text-sm flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Profile Form */}
      <div className="glass-card p-6 sm:p-8 space-y-6">
        <form onSubmit={handleSave} className="space-y-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <HeartPulse className="w-5 h-5 text-rose-500" />
            <span>Baseline Vitals & Physical Metrics</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Height (cm)
              </label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Weight (kg)
              </label>
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Blood Group
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 text-sm"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3 pt-4">
            <Shield className="w-5 h-5 text-amber-500" />
            <span>Clinical History & Safety Notes</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Known Allergies
              </label>
              <input
                type="text"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="e.g. Penicillin, Peanuts, Latex..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Emergency Contact Phone
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 text-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Medical History / Chronic Conditions
            </label>
            <textarea
              rows={3}
              value={medicalHistory}
              onChange={(e) => setMedicalHistory(e.target.value)}
              placeholder="List any past surgeries, chronic conditions, or ongoing treatments..."
              className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 text-sm leading-relaxed"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-8 py-3 rounded-xl text-white font-bold bg-sky-600 hover:bg-sky-700 disabled:opacity-50 shadow-md shadow-sky-500/20 flex items-center justify-center space-x-2 transition-all"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Saving Profile...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Health Profile</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Recharts Vital Trend View */}
      <div className="glass-card p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
          <Activity className="w-5 h-5 text-sky-600" />
          <span>Weight & Vital Metrics Trend</span>
        </h2>
        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={vitalsTrendData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="weight" fill="#0284c7" name="Weight (kg)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default HealthProfile;
