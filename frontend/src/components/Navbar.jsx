import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';
import { Stethoscope, LogOut, User, Sparkles, Menu, Activity } from 'lucide-react';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800/80 px-4 lg:px-8 py-3 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left section: Brand & Mobile Menu button */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl focus:outline-none transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-teal-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/25 group-hover:scale-105 transition-all">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-sky-500 via-teal-400 to-indigo-400 bg-clip-text text-transparent">
                  MediAssist
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-500/10 text-sky-500 dark:bg-sky-950 dark:text-sky-300 border border-sky-500/20">
                  <Sparkles className="w-2.5 h-2.5 mr-0.5 text-sky-400 animate-pulse-glow" /> AI
                </span>
              </div>
              <span className="text-[11px] block font-medium text-slate-400 dark:text-slate-500 -mt-1">
                Clinical Intelligence System
              </span>
            </div>
          </Link>
        </div>

        {/* Right section: Active indicator, Theme toggle & User Actions */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
            <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>AI Gateway Connected</span>
          </div>

          <ThemeToggle />

          {user ? (
            <div className="flex items-center space-x-3 pl-3 border-l border-slate-200 dark:border-slate-800">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                  {user.name}
                </span>
                <span className="text-[10px] text-slate-400">
                  {user.email}
                </span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-sky-600 text-white flex items-center justify-center font-extrabold text-sm shadow-md">
                {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
              </div>
              <button
                type="button"
                onClick={logout}
                title="Log Out"
                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-sky-500 transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 rounded-xl shadow-md transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
