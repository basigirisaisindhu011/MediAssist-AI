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
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

export const SymptomChecker = () => {
  const [symptomInput, setSymptomInput] = useState('');
  const [symptoms, setSymptoms] = useState(['fever', 'cough']);
  const [severity, setSeverity] = useState('moderate');
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState('female');
  const [durationDays, setDurationDays] = useState(2);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const suggestedTags = [
    'fever',
    'cough',
    'headache',
    'chest tightness',
    'fatigue',
    'dizziness',
    'shortness of breath',
    'sore throat',
  ];

  const handleAddSymptom = (e) => {
    e?.preventDefault();
    if (!symptomInput.trim()) return;
    const clean = symptomInput.trim().toLowerCase();
    if (!symptoms.includes(clean)) {
      setSymptoms([...symptoms, clean]);
    }
    setSymptomInput('');
  };

  const handleAddSuggested = (tag) => {
    if (!symptoms.includes(tag)) {
      setSymptoms([...symptoms, tag]);
    }
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
        severity,
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
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'MODERATE':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      default:
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 bg-gradient-to-r from-sky-600/90 via-teal-600/90 to-indigo-600/90 text-white rounded-2xl shadow-2xl border border-slate-800">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-md">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            AI Symptom Triage & Assessment
          </h1>
        </div>
        <p className="text-sky-100 text-sm sm:text-base max-w-xl leading-relaxed">
          Input your current clinical symptoms, severity, and duration for real-time AI triage assessment, risk level classification, and specialist recommendations.
        </p>
      </div>

      {/* Main Form Container */}
      <div className="glass-card p-6 sm:p-8 space-y-6 border border-slate-800">
        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAnalyze} className="space-y-6">
          {/* Symptom Input & Tag Pills */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Reported Symptoms
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={symptomInput}
                onChange={(e) => setSymptomInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSymptom())}
                placeholder="Type a symptom and press enter or click add..."
                className="flex-1 px-4 py-3 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
              />
              <button
                type="button"
                onClick={handleAddSymptom}
                className="px-5 py-3 bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white font-bold rounded-xl flex items-center space-x-1.5 shadow-md transition-all shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>

            {/* Quick Suggested Symptoms */}
            <div className="mt-3">
              <div className="flex items-center space-x-1 text-[11px] text-slate-400 mb-1.5 font-medium">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Quick-add common symptoms:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {suggestedTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleAddSuggested(tag)}
                    className="px-2.5 py-1 rounded-lg text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Symptoms Pills */}
            <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-800/60">
              {symptoms.map((sym) => (
                <span
                  key={sym}
                  className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-sky-500/10 text-sky-400 border border-sky-500/30 shadow-sm"
                >
                  <span>{sym}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSymptom(sym)}
                    className="hover:text-rose-400 focus:outline-none"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
              {symptoms.length === 0 && (
                <p className="text-xs text-slate-500 italic">No symptoms added yet. Select or type above.</p>
              )}
            </div>
          </div>

          {/* Demographics, Severity & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Symptom Severity
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-100 focus:ring-2 focus:ring-sky-500 text-sm"
              >
                <option value="mild">Mild (Noticeable)</option>
                <option value="moderate">Moderate (Uncomfortable)</option>
                <option value="severe">Severe (Disruptive)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Patient Age
              </label>
              <input
                type="number"
                min="0"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-100 focus:ring-2 focus:ring-sky-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Biological Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-100 focus:ring-2 focus:ring-sky-500 text-sm"
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Duration (Days)
              </label>
              <input
                type="number"
                min="1"
                max="365"
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-100 focus:ring-2 focus:ring-sky-500 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || symptoms.length === 0}
            className="w-full py-4 px-4 rounded-xl text-white font-extrabold bg-gradient-to-r from-sky-500 via-teal-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-sky-500/20 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01]"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-white" />
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

      {/* Loading Skeleton */}
      {loading && (
        <div className="glass-card p-6 sm:p-8 space-y-4 border border-slate-800 animate-pulse">
          <div className="h-6 w-1/3 rounded-lg skeleton-shimmer" />
          <div className="h-4 w-2/3 rounded-lg skeleton-shimmer" />
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="h-20 rounded-xl skeleton-shimmer" />
            <div className="h-20 rounded-xl skeleton-shimmer" />
          </div>
        </div>
      )}

      {/* AI Assessment Result Card */}
      {result && (
        <div className="glass-card p-6 sm:p-8 space-y-6 border-l-4 border-l-sky-500 border-slate-800 animate-slide-up shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-sky-400" />
                <h2 className="text-xl font-extrabold text-slate-100">
                  AI Preliminary Assessment Output
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-medium">
                Model confidence: {(result.confidence * 100).toFixed(0)}%
              </p>
            </div>
            <span
              className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-extrabold border ${getRiskBadgeColor(
                result.risk_level
              )}`}
            >
              Risk Level: {result.risk_level}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
                <Stethoscope className="w-4 h-4 text-sky-400" />
                <span>Recommended Specialist</span>
              </h3>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 font-extrabold text-slate-100 text-sm">
                {result.recommended_specialist}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>Recommended Action Plan</span>
              </h3>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-slate-300 leading-relaxed">
                {result.recommended_action}
              </div>
            </div>
          </div>

          {/* MANDATORY AI DISCLAIMER */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs sm:text-sm font-medium flex items-start space-x-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <span>
              AI-generated information is not a medical diagnosis. Consult a qualified healthcare professional for emergency or persistent symptoms.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;
