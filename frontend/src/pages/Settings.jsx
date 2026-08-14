import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import { Settings as SettingsIcon, User, Lock, Moon, Shield, CheckCircle2 } from 'lucide-react';

export const Settings = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [saveSuccess, setSaveSuccess] = useState('');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSaveSuccess('Profile settings saved.');
    setTimeout(() => setSaveSuccess(''), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 bg-gradient-to-r from-slate-700/90 to-slate-900/90 text-white rounded-2xl shadow-xl">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-md">
            <SettingsIcon className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Account & Application Settings
          </h1>
        </div>
        <p className="text-slate-300 text-sm sm:text-base max-w-xl">
          Customize your user profile details, application appearance theme, and security preferences.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-sm flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* Profile Settings */}
      <div className="glass-card p-6 sm:p-8 space-y-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <User className="w-5 h-5 text-sky-600" />
          <span>Personal Information</span>
        </h2>

        <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address (Read-only)
            </label>
            <input
              type="email"
              disabled
              value={email}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 text-sm cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-white font-bold bg-sky-600 hover:bg-sky-700 shadow-md text-sm transition-all"
          >
            Update Profile
          </button>
        </form>
      </div>

      {/* Theme Settings */}
      <div className="glass-card p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <Moon className="w-5 h-5 text-indigo-500" />
          <span>Interface Appearance Theme</span>
        </h2>

        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50">
          <div>
            <span className="font-semibold text-sm text-slate-800 dark:text-slate-200 block">
              Toggle Light / Dark Mode
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Switch between clean high-contrast light mode and sleek dark theme
            </span>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default Settings;
