import { useState } from 'react';
import aiService from '../services/aiService';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';
import {
  HeartPulse,
  Sparkles,
  ShieldAlert,
  Loader2,
  AlertCircle,
  Activity,
  CheckCircle2
} from 'lucide-react';

export const HealthRiskEvaluator = () => {
  const [age, setAge] = useState(45);
  const [bmi, setBmi] = useState(28.5);
  const [bpSys, setBpSys] = useState(135);
  const [bpDia, setBpDia] = useState(88);
  const [glucose, setGlucose] = useState(110);
  const [smoker, setSmoker] = useState(false);
  const [exerciseDays, setExerciseDays] = useState(2);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleEvaluate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await aiService.calculateRiskScore({
        age: Number(age),
        bmi: Number(bmi),
        blood_pressure_sys: Number(bpSys),
        blood_pressure_dia: Number(bpDia),
        glucose_mg_dl: Number(glucose),
        is_smoker: Boolean(smoker),
        exercise_days_per_week: Number(exerciseDays),
      });
      setResult(data);
    } catch (err) {
      setError(
        err.response?.data?.detail || err.response?.data?.message || 'Failed to calculate health risk score via gateway.'
      );
    } finally {
      setLoading(false);
    }
  };

  const chartData = result
    ? [
        { name: 'Calculated Risk Score', value: result.risk_score },
        { name: 'Optimal Baseline', value: Math.max(0, 100 - result.risk_score) },
      ]
    : [];

  const getRiskCategoryColor = (category) => {
    switch (category?.toUpperCase()) {
      case 'HIGH':
        return 'text-rose-400 bg-rose-500/15 border-rose-500/30';
      case 'MODERATE':
        return 'text-amber-400 bg-amber-500/15 border-amber-500/30';
      default:
        return 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 bg-gradient-to-r from-teal-600/90 via-emerald-600/90 to-sky-600/90 text-white rounded-2xl shadow-2xl border border-slate-800">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-md">
            <HeartPulse className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Health Risk Evaluator
          </h1>
        </div>
        <p className="text-teal-100 text-sm sm:text-base max-w-xl leading-relaxed">
          Input clinical vitals to generate a predictive cardiovascular and metabolic risk score with Recharts analytics and actionable clinical guidelines.
        </p>
      </div>

      {/* Main Form */}
      <div className="glass-card p-6 sm:p-8 space-y-6 border border-slate-800">
        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleEvaluate} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Age (Years)
              </label>
              <input
                type="number"
                min="0"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-100 focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Body Mass Index (BMI)
              </label>
              <input
                type="number"
                step="0.1"
                value={bmi}
                onChange={(e) => setBmi(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-100 focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Systolic BP (mmHg)
              </label>
              <input
                type="number"
                value={bpSys}
                onChange={(e) => setBpSys(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-100 focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Diastolic BP (mmHg)
              </label>
              <input
                type="number"
                value={bpDia}
                onChange={(e) => setBpDia(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-100 focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Fasting Glucose (mg/dL)
              </label>
              <input
                type="number"
                value={glucose}
                onChange={(e) => setGlucose(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-100 focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Exercise (Days / Week)
              </label>
              <input
                type="number"
                min="0"
                max="7"
                value={exerciseDays}
                onChange={(e) => setExerciseDays(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-100 focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <input
              type="checkbox"
              id="smokerToggle"
              checked={smoker}
              onChange={(e) => setSmoker(e.target.checked)}
              className="w-4.5 h-4.5 rounded text-teal-500 focus:ring-teal-500 border-slate-800 bg-slate-900"
            />
            <label htmlFor="smokerToggle" className="text-sm text-slate-300 font-semibold cursor-pointer">
              Current Tobacco / Nicotine User
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-4 rounded-xl text-white font-extrabold bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-teal-500/20 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01]"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Calculating Risk Score...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Evaluate Health Risk Score</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="glass-card p-6 sm:p-8 space-y-4 border border-slate-800 animate-pulse">
          <div className="h-6 w-1/3 rounded-lg skeleton-shimmer" />
          <div className="h-40 rounded-xl skeleton-shimmer" />
        </div>
      )}

      {/* Output Section */}
      {result && (
        <div className="glass-card p-6 sm:p-8 space-y-6 border-l-4 border-l-teal-500 border-slate-800 animate-slide-up shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-100 flex items-center space-x-2">
                <Activity className="w-5 h-5 text-teal-400" />
                <span>AI Risk Assessment Output</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1 font-medium">
                Model confidence: {(result.confidence * 100).toFixed(0)}%
              </p>
            </div>
            <span
              className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-extrabold border ${getRiskCategoryColor(
                result.risk_category
              )}`}
            >
              Risk Level: {result.risk_category}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Recharts Visualization */}
            <div className="h-60 flex flex-col items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill={result.risk_score > 50 ? '#f43f5e' : '#10b981'} />
                    <Cell fill="#334155" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center -mt-36 pointer-events-none">
                <span className="text-4xl font-extrabold text-slate-100">
                  {result.risk_score}
                </span>
                <span className="text-xs block font-bold text-slate-400">/ 100 Score</span>
              </div>
            </div>

            {/* Recommendations List */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>Clinical Action Plan</span>
              </h3>
              <ul className="space-y-2.5 text-sm text-slate-300">
                {result.recommendations?.map((rec, idx) => (
                  <li key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start space-x-2.5">
                    <span className="font-bold text-teal-400">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* MANDATORY DISCLAIMER */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs sm:text-sm font-medium flex items-start space-x-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <span>
              AI-generated risk scores are informational models and do not constitute a formal diagnosis. Always consult a physician.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthRiskEvaluator;
