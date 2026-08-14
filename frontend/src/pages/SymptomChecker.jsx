import { useState } from 'react';
import aiService from '../services/aiService';
import {
  Activity,
  Sparkles,
  ShieldAlert,
  Loader2,
  AlertCircle,
  Stethoscope,
  Plus,
  X,
  CheckCircle2
} from 'lucide-react';

export const SymptomChecker = () => {
  const [symptomInput, setSymptomInput] = useState('');
  const [symptoms, setSymptoms] = useState(['fever', 'cough']);
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState('female');
  const [durationDays, setDurationDays] = useState(2);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleAddSymptom = (e) => {
    e.preventDefault();
    if (!symptomInput.trim()) return;
    const clean = symptomInput.trim().toLowerCase();
    if (!symptoms.includes(clean)) {
      setSymptoms([...symptoms, clean]);
    }
    setSymptomInput('');
  };

  const handleRemoveSymptom = (sym) => {
    setSymptoms(symptoms.filter((s) => s !== sym));
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (symptoms.length === 0) {
      setError('Please add at least one symptom to analyze.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await aiService.analyzeSymptoms({
        symptoms,
        age: Number(age),
        gender,
        duration_days: Number(durationDays),
      });
      setResult(data);
    } catch (err) {
      setError(
        err.response?.data?.detail || err.response?.data?.message || 'Failed to analyze symptoms via AI gateway.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadgeColor = (level) => {
    switch (level?.toUpperCase()) {
      case 'CRITICAL':
      case 'HIGH':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300';
      case 'MODERATE':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300';
      default:
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 bg-gradient-to-r from-sky-600/90 to-teal-600/90 text-white rounded-2xl shadow-xl">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-md">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            AI Symptom Assessment
          </h1>
        </div>
        <p className="text-sky-100 text-sm sm:text-base max-w-xl">
          Enter your current clinical symptoms, age, and duration for an automated AI preliminary assessment and recommended care steps.
        </p>
      </div>

      {/* Main Input Form */}
      <div className="glass-card p-6 sm:p-8 space-y-6">
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400 text-sm flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAnalyze} className="space-y-6">
          {/* Add Symptom Tag Bar */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
              Reported Symptoms
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={symptomInput}
                onChange={(e) => setSymptomInput(e.target.value)}
                placeholder="e.g. headache, fever, fatigue..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <button
                type="button"
                onClick={handleAddSymptom}
                className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl flex items-center space-x-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>

            {/* Selected Symptoms Pills */}
            <div className="flex flex-wrap gap-2 mt-3">
              {symptoms.map((sym) => (
                <span
                  key={sym}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800"
                >
                  <span>{sym}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSymptom(sym)}
                    className="hover:text-rose-600 dark:hover:text-rose-400 focus:outline-none"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
              {symptoms.length === 0 && (
                <p className="text-xs text-slate-400 italic">No symptoms added yet.</p>
              )}
            </div>
          </div>

          {/* Demographics & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Patient Age
              </label>
              <input
                type="number"
                min="0"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Biological Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-sky-500"
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Duration (Days)
              </label>
              <input
                type="number"
                min="1"
                max="365"
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || symptoms.length === 0}
            className="w-full py-3.5 px-4 rounded-xl text-white font-bold bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-sky-500/20 flex items-center justify-center space-x-2 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Running AI Clinical Model...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate AI Preliminary Assessment</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Results Section */}
      {result && (
        <div className="glass-card p-6 sm:p-8 space-y-6 border-l-4 border-l-sky-500 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-sky-600" />
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                  AI Preliminary Assessment
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Evaluation confidence: {(result.confidence * 100).toFixed(0)}%
              </p>
            </div>
            <span
              className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold border ${getRiskBadgeColor(
                result.risk_level
              )}`}
            >
              Risk Level: {result.risk_level}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-2">
                <Stethoscope className="w-4 h-4 text-sky-600" />
                <span>Recommended Specialist</span>
              </h3>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 p-3 rounded-xl bg-slate-100 dark:bg-slate-800">
                {result.recommended_specialist}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>Recommended Action Plan</span>
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 leading-relaxed">
                {result.recommended_action}
              </p>
            </div>
          </div>

          {/* MANDATORY AI DISCLAIMER */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs sm:text-sm font-medium flex items-start space-x-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <span>
              AI-generated information is not a medical diagnosis. Consult a qualified healthcare professional.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;
