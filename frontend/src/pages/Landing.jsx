import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import {
  Stethoscope,
  Activity,
  HeartPulse,
  FileText,
  Shield,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Landing Header */}
      <header className="sticky top-0 z-40 glass-panel border-b border-slate-200/80 dark:border-slate-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-sky-600 via-teal-600 to-indigo-600 dark:from-sky-400 dark:via-teal-400 dark:to-indigo-400 bg-clip-text text-transparent">
                MediAssist AI
              </span>
              <span className="text-[10px] block font-semibold text-slate-500 dark:text-slate-400 -mt-1">
                Clinical Decision Support & Care
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 rounded-xl shadow-md transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative py-20 px-6 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 text-xs font-semibold mb-6 animate-pulse-glow">
            <Sparkles className="w-4 h-4 text-sky-500" />
            <span>Next-Generation AI Medical Assistant</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Intelligent Health Insights & Digital Patient Care, Powered by{' '}
            <span className="bg-gradient-to-r from-sky-600 via-teal-500 to-indigo-600 dark:from-sky-400 dark:via-teal-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Clinical AI
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            MediAssist-AI combines preliminary symptom evaluation, health risk scoring, AI medical report summarization, and seamless doctor appointment management.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 text-base font-bold text-white bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 rounded-xl shadow-lg shadow-sky-500/25 flex items-center justify-center space-x-2 transition-all hover:scale-105"
            >
              <span>Start Free Assessment</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 rounded-xl shadow-sm transition-all"
            >
              Log In to Portal
            </Link>
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section className="py-16 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-6 flex flex-col space-y-4 border border-slate-200/80 dark:border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">AI Symptom Analysis</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Describe your symptoms, severity, and duration to receive instant preliminary AI assessment and specialist recommendations.
              </p>
            </div>

            <div className="glass-card p-6 flex flex-col space-y-4 border border-slate-200/80 dark:border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Health Risk Evaluator</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Calculate comprehensive health risk scores using clinical indicators like BMI, Blood Pressure, Glucose levels, and lifestyle factors.
              </p>
            </div>

            <div className="glass-card p-6 flex flex-col space-y-4 border border-slate-200/80 dark:border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Medical Report Summarizer</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Upload complex clinical reports or lab tests to extract clear executive summaries, vital metrics, and actionable clinical advice.
              </p>
            </div>
          </div>
        </section>

        {/* Disclaimer Notice */}
        <section className="py-8 px-6 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs sm:text-sm text-center leading-relaxed font-medium">
            <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400 mx-auto mb-2" />
            AI-generated information is not a medical diagnosis. Always consult a qualified healthcare professional for medical advice, diagnoses, or treatment decisions.
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 px-6 text-center text-xs text-slate-500 dark:text-slate-400">
        &copy; {new Date().getFullYear()} MediAssist-AI. All rights reserved. Designed for Intelligent Patient Care.
      </footer>
    </div>
  );
};

export default Landing;
