import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Stethoscope,
  Lock,
  Mail,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  Activity,
  ArrowRight
} from 'lucide-react';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await login(data);
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(
        err.response?.data?.message || err.response?.data?.error || 'Invalid email or password. Please try again.'
      );
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100">
      {/* Left Visual Panel - Desktop Only */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-900 via-sky-950 to-teal-950 p-12 flex-col justify-between border-r border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-400 flex items-center justify-center text-white shadow-xl shadow-sky-500/20">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-sky-400 to-teal-300 bg-clip-text text-transparent">
              MediAssist AI
            </span>
            <span className="text-xs block font-semibold text-slate-400 -mt-1">
              Clinical Intelligence & Patient Care
            </span>
          </div>
        </div>

        <div className="relative z-10 space-y-6 my-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Diagnostic Assistant Platform</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight max-w-lg">
            Empowering Healthcare Decisions with Real-Time Clinical AI
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-md">
            Log in to evaluate patient symptoms, calculate cardiovascular risk scores, analyze diagnostic reports, and manage appointment schedules effortlessly.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
              <Activity className="w-5 h-5 text-teal-400 mb-2" />
              <div className="text-xs font-extrabold text-slate-200">Symptom Checker</div>
              <div className="text-[11px] text-slate-500">Instant AI Triage</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
              <ShieldCheck className="w-5 h-5 text-sky-400 mb-2" />
              <div className="text-xs font-extrabold text-slate-200">HIPAA Compliant</div>
              <div className="text-[11px] text-slate-500">Secure Vault Storage</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-500 flex items-center justify-between">
          <span>&copy; {new Date().getFullYear()} MediAssist AI</span>
          <span>Enterprise Healthcare SaaS</span>
        </div>
      </div>

      {/* Right Authentication Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left space-y-2">
            <div className="lg:hidden inline-flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-400 flex items-center justify-center text-white">
                <Stethoscope className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl bg-gradient-to-r from-sky-400 to-teal-300 bg-clip-text text-transparent">
                MediAssist AI
              </span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-100">
              Sign in to Portal
            </h2>
            <p className="text-sm text-slate-400">
              Enter your credentials to access your health dashboard
            </p>
          </div>

          {serverError && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-start space-x-3 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  {...register('email')}
                  placeholder="patient@example.com"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-slate-900/80 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all text-sm ${
                    errors.email
                      ? 'border-rose-500 focus:ring-rose-500'
                      : 'border-slate-800 focus:border-sky-500 focus:ring-sky-500/20'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-11 py-3 rounded-xl border bg-slate-900/80 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all text-sm ${
                    errors.password
                      ? 'border-rose-500 focus:ring-rose-500'
                      : 'border-slate-800 focus:border-sky-500 focus:ring-sky-500/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl text-white font-bold bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-sky-500/20 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 text-center text-sm text-slate-400 border-t border-slate-800">
            Don't have a patient account?{' '}
            <Link
              to="/register"
              className="font-bold text-sky-400 hover:text-sky-300 hover:underline"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
