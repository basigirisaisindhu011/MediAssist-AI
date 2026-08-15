import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Activity,
  Bot,
  HeartPulse,
  FileText,
  Calendar,
  User,
  FolderOpen,
  Settings,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    {
      title: 'Main Hub',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      ]
    },
    {
      title: 'AI Clinical Tools',
      items: [
        { name: 'AI Symptom Checker', path: '/symptom-checker', icon: Activity, isAi: true },
        { name: 'AI Assistant', path: '/ai-assistant', icon: Bot, isAi: true },
        { name: 'Health Risk Evaluator', path: '/risk-evaluator', icon: HeartPulse, isAi: true },
        { name: 'Report Summarizer', path: '/report-summarizer', icon: FileText, isAi: true },
      ]
    },
    {
      title: 'Patient Records',
      items: [
        { name: 'Appointments', path: '/appointments', icon: Calendar },
        { name: 'Health Profile', path: '/health-profile', icon: User },
        { name: 'Medical Records', path: '/medical-records', icon: FolderOpen },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { name: 'Settings', path: '/settings', icon: Settings },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-md lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed lg:sticky top-16 z-40 h-[calc(100vh-4rem)] w-64 glass-panel border-r border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-4 overflow-y-auto transition-transform duration-300 ease-in-out shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {navItems.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1.5">
              <h3 className="px-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-sky-500/10 to-teal-500/10 dark:from-sky-500/20 dark:to-teal-500/20 text-sky-600 dark:text-sky-400 shadow-sm border border-sky-500/20 dark:border-sky-400/30 font-bold'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                        }`
                      }
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-4 h-4 text-sky-500 dark:text-sky-400 shrink-0" />
                        <span>{item.name}</span>
                      </div>
                      {item.isAi && (
                        <span className="flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-500/10 text-teal-600 dark:bg-teal-950 dark:text-teal-300 border border-teal-500/20">
                          <Sparkles className="w-2.5 h-2.5 mr-0.5" /> AI
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Clinical AI Disclaimer Box in Sidebar */}
        <div className="mt-8 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-[11px] leading-relaxed">
          <div className="flex items-center space-x-1.5 font-bold mb-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>AI Care Disclaimer</span>
          </div>
          MediAssist AI outputs are preliminary clinical aids and do not constitute a medical diagnosis.
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
