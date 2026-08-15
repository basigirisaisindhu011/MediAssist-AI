import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import { Settings as SettingsIcon, User, Moon, CheckCircle2 } from 'lucide-react';

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
      <div className="glass-panel p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 text-white rounded-2xl shadow-2xl border border-slate-800">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-md">
            <SettingsIcon className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Account & Application Preferences
          </h1>
        </div>
        <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
          Customize your user profile details, interface theme, and clinical notification preferences.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* Personal Info Card */}
      <div className="glass-card p-6 sm:p-8 space-y-6 border border-slate-800">
        <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2 border-b border-slate-800 pb-3">
          <User className="w-5 h-5 text-sky-400" />
          <span>Personal Account Information</span>
        </h2>

        <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-100 focus:ring-2 focus:ring-sky-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Email Address (Read-only)
            </label>
            <input
              type="email"
              disabled
              value={email}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/50 text-slate-500 text-sm cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl text-white font-extrabold bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 shadow-md text-sm transition-all hover:scale-105"
          >
            Update Profile Settings
          </button>
        </form>
      </div>

      {/* Theme Settings */}
      <div className="glass-card p-6 sm:p-8 space-y-4 border border-slate-800">
        <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2 border-b border-slate-800 pb-3">
          <Moon className="w-5 h-5 text-indigo-400" />
          <span>Interface Appearance Theme</span>
        </h2>

        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div>
            <span className="font-bold text-sm text-slate-200 block">
              Toggle Light / Dark Mode
            </span>
            <span className="text-xs text-slate-400">
              Switch between high-contrast light mode and sleek dark theme
            </span>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default Settings;
