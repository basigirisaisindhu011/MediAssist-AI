import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import {
  Stethoscope,
  Activity,
  HeartPulse,
  FileText,
  Shield,
  ArrowRight,
  Sparkles,
  Bot,
  Calendar,
  FolderOpen
} from 'lucide-react';

export const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white">
      {/* Landing Header */}
      <header className="sticky top-0 z-40 glass-panel border-b border-slate-800/80 px-6 py-4 backdrop-blur-xl bg-slate-950/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-teal-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/25">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-sky-400 via-teal-400 to-indigo-400 bg-clip-text text-transparent">
                  MediAssist AI
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  <Sparkles className="w-2.5 h-2.5 mr-0.5 text-sky-400" /> AI
                </span>
              </div>
              <span className="text-[11px] block font-medium text-slate-400 -mt-1">
                Clinical Intelligence & Patient Portal
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-sky-400 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 rounded-xl shadow-lg shadow-sky-500/20 transition-all hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative py-24 px-6 max-w-7xl mx-auto text-center overflow-hidden">
          {/* Subtle Background Glow Spheres */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-8 max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-sky-500/10 to-teal-500/10 text-sky-400 border border-sky-500/20 text-xs font-extrabold shadow-sm animate-pulse-glow">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>Next-Generation Healthcare Intelligence Platform</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
              Intelligent Clinical Insights & Patient Care, Powered by{' '}
              <span className="bg-gradient-to-r from-sky-400 via-teal-400 to-indigo-400 bg-clip-text text-transparent">
                Medical AI
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              MediAssist AI integrates preliminary symptom checker triage, machine learning risk assessment, AI medical report summarization, and seamless doctor appointments into one unified healthcare SaaS dashboard.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-sky-500 via-teal-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 rounded-xl shadow-xl shadow-sky-500/25 flex items-center justify-center space-x-2 transition-all hover:scale-105"
              >
                <span>Start Free Assessment</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-slate-200 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl shadow-md transition-all"
              >
                Log In to Portal
              </Link>
            </div>
          </div>
        </section>

        {/* Live Metrics Counter Bar */}
        <section className="py-10 border-y border-slate-800 bg-slate-900/50 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-sky-400">99.4%</div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI Service Reliability</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-teal-400">24/7</div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI Health Assistant</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-indigo-400">10k+</div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Reports Summarized</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">100%</div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">HIPAA Compliant Vault</div>
            </div>
          </div>
        </section>

        {/* Clinical AI Features Section */}
        <section className="py-20 px-6 max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100">
              Complete Clinical Intelligence Suite
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Designed for modern patients, clinicians, and health professionals seeking rapid diagnostic guidance and document analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 flex flex-col space-y-4 border border-slate-800 bg-slate-900/60">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center shadow-inner">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-100">AI Symptom Checker</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Add symptoms, duration, and severity for an instant AI preliminary assessment, confidence scoring, and recommended specialist routing.
              </p>
            </div>

            <div className="glass-card p-8 flex flex-col space-y-4 border border-slate-800 bg-slate-900/60">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center shadow-inner">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-100">24/7 AI Health Companion</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Ask questions about medical terms, lab results, medications, and wellness guidelines in an interactive conversational chat.
              </p>
            </div>

            <div className="glass-card p-8 flex flex-col space-y-4 border border-slate-800 bg-slate-900/60">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shadow-inner">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-100">Health Risk Evaluator</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Calculate your cardiovascular and metabolic risk score using clinical vital inputs and Recharts gauge visualization.
              </p>
            </div>

            <div className="glass-card p-8 flex flex-col space-y-4 border border-slate-800 bg-slate-900/60">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shadow-inner">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-100">Report Summarizer</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Upload or paste lab reports to automatically extract key clinical metrics into readable executive summaries.
              </p>
            </div>

            <div className="glass-card p-8 flex flex-col space-y-4 border border-slate-800 bg-slate-900/60">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shadow-inner">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-100">Clinical Appointments</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Schedule consultations with medical specialists, manage upcoming schedules, and track appointment statuses effortlessly.
              </p>
            </div>

            <div className="glass-card p-8 flex flex-col space-y-4 border border-slate-800 bg-slate-900/60">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shadow-inner">
                <FolderOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-100">Medical Document Vault</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Securely upload, category-filter, search, and download your lab reports, prescriptions, and health history files.
              </p>
            </div>
          </div>
        </section>

        {/* Disclaimer Notice */}
        <section className="py-8 px-6 max-w-4xl mx-auto">
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs sm:text-sm text-center leading-relaxed font-medium">
            <Shield className="w-5 h-5 text-amber-400 mx-auto mb-2" />
            AI-generated information is for clinical decision support and does not constitute a medical diagnosis. Always consult a licensed physician for healthcare advice.
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-6 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} MediAssist AI. All rights reserved. Production-grade AI Healthcare SaaS Platform.
      </footer>
    </div>
  );
};

export default Landing;
