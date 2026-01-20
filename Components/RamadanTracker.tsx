
import React from 'react';
import { FastingLog } from '../types';

interface RamadanTrackerProps {
  data: FastingLog;
  onUpdate: (data: FastingLog) => void;
  dayOfRamadan: number;
}

const RamadanTracker: React.FC<RamadanTrackerProps> = ({ data, onUpdate, dayOfRamadan }) => {
  const toggle = (key: keyof Omit<FastingLog, 'quranPages'>) => {
    onUpdate({ ...data, [key]: !data[key] });
  };

  const setPages = (val: number) => {
    onUpdate({ ...data, quranPages: Math.max(0, val) });
  };

  const stages = [
    { label: 'Suhoor', completed: data.suhoor, icon: '☕' },
    { label: 'Fast', completed: data.isFasting, icon: '☀️' },
    { label: 'Iftar', completed: data.iftar, icon: '🍽️' }
  ];

  const progressPercentage = data.iftar ? 100 : data.isFasting ? 66 : data.suhoor ? 33 : 0;

  return (
    <section className="bg-gradient-to-br from-amber-50 to-orange-50/40 dark:from-amber-950/20 dark:to-orange-950/10 rounded-[2.5rem] p-8 mb-8 border border-orange-100 dark:border-orange-900/30 shadow-sm relative overflow-hidden transition-colors">
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-serif font-bold text-orange-950 dark:text-orange-100 flex items-center gap-2">
              <span className="text-2xl">🌙</span> Ramadan Mubarak
            </h2>
            <p className="text-orange-600/70 dark:text-orange-400/60 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Day {dayOfRamadan} of 30</p>
          </div>
        </div>

        {/* Journey Progress Indicator */}
        <div className="mb-10 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-orange-100 dark:bg-orange-900/50 -translate-y-1/2 rounded-full"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-orange-400 dark:bg-orange-500 -translate-y-1/2 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
          <div className="flex justify-between relative">
            {stages.map((stage) => (
              <div key={stage.label} className="flex flex-col items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                    stage.completed 
                      ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-100 dark:shadow-none' 
                      : 'bg-white dark:bg-slate-800 border-orange-100 dark:border-orange-900 text-orange-200 dark:text-orange-900'
                  }`}
                >
                  <span className={`text-sm ${!stage.completed && 'grayscale opacity-50'}`}>{stage.icon}</span>
                </div>
                <span className={`text-[9px] font-black uppercase tracking-tighter mt-3 ${stage.completed ? 'text-orange-900 dark:text-orange-400' : 'text-orange-300 dark:text-orange-800'}`}>
                  {stage.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <button 
            onClick={() => toggle('isFasting')}
            className={`p-5 rounded-[2rem] border transition-all duration-300 flex flex-col gap-2 ${data.isFasting ? 'bg-orange-500 border-orange-500 text-white shadow-xl shadow-orange-100 dark:shadow-none' : 'bg-white dark:bg-slate-800 border-orange-50 dark:border-orange-900 hover:border-orange-200 dark:hover:border-orange-700 text-orange-900 dark:text-orange-100'}`}
          >
            <span className="text-2xl mb-1">☀️</span>
            <span className="text-sm font-bold">Fasting Today</span>
            <span className="text-[10px] opacity-60 font-medium uppercase tracking-widest">{data.isFasting ? 'Active' : 'Off'}</span>
          </button>
          <button 
            onClick={() => toggle('taraweeh')}
            className={`p-5 rounded-[2rem] border transition-all duration-300 flex flex-col gap-2 ${data.taraweeh ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-none' : 'bg-white dark:bg-slate-800 border-indigo-50 dark:border-indigo-900 hover:border-indigo-200 dark:hover:border-indigo-700 text-indigo-900 dark:text-indigo-100'}`}
          >
            <span className="text-2xl mb-1">🕌</span>
            <span className="text-sm font-bold">Taraweeh</span>
            <span className="text-[10px] opacity-60 font-medium uppercase tracking-widest">{data.taraweeh ? 'Done' : 'Pending'}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button 
            onClick={() => toggle('suhoor')}
            className={`p-4 rounded-[1.5rem] border transition-all duration-300 flex items-center justify-center gap-3 ${data.suhoor ? 'bg-amber-100 dark:bg-amber-900/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200' : 'bg-white/40 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-600'}`}
          >
            <span className="text-lg">☕</span>
            <span className="text-xs font-bold uppercase tracking-widest">Suhoor {data.suhoor ? '✓' : ''}</span>
          </button>
          <button 
            onClick={() => toggle('iftar')}
            className={`p-4 rounded-[1.5rem] border transition-all duration-300 flex items-center justify-center gap-3 ${data.iftar ? 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200' : 'bg-white/40 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-600'}`}
          >
            <span className="text-lg">🍽️</span>
            <span className="text-xs font-bold uppercase tracking-widest">Iftar {data.iftar ? '✓' : ''}</span>
          </button>
        </div>

        <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-5 rounded-[2rem] border border-orange-100/50 dark:border-orange-900/30 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-orange-900 dark:text-orange-200">Quran Recitation</h4>
            <p className="text-[10px] text-orange-600/70 dark:text-orange-400/60 font-black uppercase tracking-tighter">Pages completed today</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setPages(data.quranPages - 1)}
              className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 flex items-center justify-center font-bold hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors"
            >—</button>
            <span className="text-xl font-serif font-bold text-orange-900 dark:text-orange-200 min-w-[1.5rem] text-center">{data.quranPages}</span>
            <button 
              onClick={() => setPages(data.quranPages + 1)}
              className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 flex items-center justify-center font-bold hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors"
            >+</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RamadanTracker;
