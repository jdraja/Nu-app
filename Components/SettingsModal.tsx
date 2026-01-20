
import React from 'react';

interface SettingsModalProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ darkMode, onToggleDarkMode, onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-white/20 dark:border-slate-800 transition-colors">
        <div className="p-8 pb-4 flex justify-between items-center">
          <h2 className="text-2xl font-serif font-bold text-indigo-950 dark:text-indigo-100">Settings</h2>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors text-slate-400 dark:text-slate-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className="p-8 pt-4 space-y-6">
          <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 transition-colors group">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${darkMode ? 'bg-indigo-900 text-indigo-400' : 'bg-amber-100 text-amber-600 shadow-sm shadow-amber-100'}`}>
                {darkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Dark Mode</h3>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{darkMode ? 'Comfortable for Night' : 'Clear for Day'}</p>
              </div>
            </div>
            <button
              onClick={onToggleDarkMode}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 focus:outline-none shadow-inner ${darkMode ? 'bg-indigo-600' : 'bg-slate-200'}`}
            >
              <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-300 ease-spring ${darkMode ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="p-6 bg-indigo-50 dark:bg-indigo-950/30 rounded-[2rem] border border-indigo-100 dark:border-indigo-900/50">
             <p className="text-[10px] font-black text-indigo-400 dark:text-indigo-500 uppercase tracking-widest mb-2">Version</p>
             <p className="text-xs font-bold text-indigo-950 dark:text-indigo-200">Noor v2.1.0-Spirit</p>
          </div>
        </div>

        <div className="p-8 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          <button 
            onClick={onClose}
            className="w-full bg-indigo-950 dark:bg-indigo-600 text-white font-bold py-5 rounded-[2rem] shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-900 dark:hover:bg-indigo-500 transition-all active:scale-95 uppercase text-sm tracking-widest"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
