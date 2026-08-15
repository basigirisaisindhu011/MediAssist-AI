import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Stethoscope,
  Lock,
  Mail,
  User,
  Shield,
  Loader2,
  AlertCircle,
  Phone,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.literal('PATIENT').default('PATIENT'),
});

export const Register = () => {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'PATIENT',
    },
  });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await registerAuth(data);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const responseData = err.response?.data;
      if (responseData?.errors && typeof responseData.errors === 'object') {
        let hasMappedFieldError = false;
        Object.entries(responseData.errors).forEach(([field, message]) => {
          setError(field, { type: 'server', message });
          hasMappedFieldError = true;
        });
        if (!hasMappedFieldError && responseData.message) {
          setServerError(responseData.message);
        }
      } else {
        setServerError(
          responseData?.message || responseData?.error || 'Registration failed. Email may already be registered.'
        );
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100">
      {/* Left Visual Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-900 via-teal-950 to-sky-950 p-12 flex-col justify-between border-r border-slate-800">
        <div className="relative z-10 flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-400 to-sky-500 flex items-center justify-center text-white shadow-xl">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-teal-300 to-sky-400 bg-clip-text text-transparent">
              MediAssist AI
            </span>
            <span className="text-xs block font-semibold text-slate-400 -mt-1">
              Patient Care & AI Intelligence
            </span>
          </div>
        </div>

        <div className="relative z-10 space-y-6 my-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Join 10,000+ Active Patients</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight max-w-lg">
            Create Your Smart Health Account Today
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-md">
            Gain immediate access to AI-assisted symptom checks, risk assessments, digital health profile tracking, and secure medical document storage.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center space-x-3 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Real-time AI symptom assessment & specialist routing</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Personalized health risk scoring with Recharts analytics</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Clinical document summarization and record vault</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-500">
          &copy; {new Date().getFullYear()} MediAssist AI Platform
        </div>
      </div>

      {/* Right Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-100">
              Create Patient Account
            </h2>
            <p className="text-sm text-slate-400">
              Fill in your information to register for the AI portal
            </p>
          </div>

          {serverError && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-start space-x-3 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  {...register('name')}
                  placeholder="Jane Doe"
                  className={`w-full pl-11 pr-4 py-2.5 rounded-xl border bg-slate-900/80 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all text-sm ${
                    errors.name ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-800 focus:border-teal-500 focus:ring-teal-500/20'
                  }`}
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-rose-400">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  {...register('email')}
                  placeholder="jane.doe@example.com"
                  className={`w-full pl-11 pr-4 py-2.5 rounded-xl border bg-slate-900/80 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all text-sm ${
                    errors.email ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-800 focus:border-teal-500 focus:ring-teal-500/20'
                  }`}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-rose-400">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  {...register('phone')}
                  placeholder="+1 (555) 000-0000"
                  className={`w-full pl-11 pr-4 py-2.5 rounded-xl border bg-slate-900/80 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all text-sm ${
                    errors.phone ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-800 focus:border-teal-500 focus:ring-teal-500/20'
                  }`}
                />
              </div>
              {errors.phone && <p className="mt-1 text-xs text-rose-400">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-11 py-2.5 rounded-xl border bg-slate-900/80 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all text-sm ${
                    errors.password ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-800 focus:border-teal-500 focus:ring-teal-500/20'
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
              {errors.password && <p className="mt-1 text-xs text-rose-400">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Account Role
              </label>
              <div className="relative">
                <Shield className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
                <select
                  {...register('role')}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/50 text-slate-400 text-sm cursor-not-allowed"
                  disabled
                >
                  <option value="PATIENT">Patient Account</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl text-white font-bold bg-gradient-to-r from-teal-500 to-sky-500 hover:from-teal-600 hover:to-sky-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-500/20 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Patient Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 text-center text-sm text-slate-400 border-t border-slate-800">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold text-teal-400 hover:text-teal-300 hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
