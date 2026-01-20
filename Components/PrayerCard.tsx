
import React from 'react';
import { Prayer, PrayerStatus } from '../types';

interface PrayerCardProps {
  prayer: Prayer;
  onToggle: (id: string) => void;
}

const PrayerCard: React.FC<PrayerCardProps> = ({ prayer, onToggle }) => {
  const isCompleted = prayer.status === PrayerStatus.COMPLETED;
  const isJumma = prayer.name === 'Jumma';

  return (
    <div 
      onClick={() => onToggle(prayer.id)}
      className={`
        relative overflow-hidden cursor-pointer transition-all duration-300 ease-out p-5 rounded-2xl border 
        ${isCompleted 
          ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50 shadow-sm ring-1 ring-emerald-100 dark:ring-emerald-900/20' 
          : isJumma 
            ? 'bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-900/50 hover:border-indigo-400 dark:hover:border-indigo-600'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 hover:shadow-md'
        }
      `}
    >
      <div className="flex items-center justify-between relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className={`text-lg font-semibold ${isCompleted ? 'text-emerald-800 dark:text-emerald-300' : 'text-slate-800 dark:text-slate-100'}`}>
              {prayer.name}
            </h3>
            {isJumma && !isCompleted && (
              <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full">
                Friday Blessing
              </span>
            )}
          </div>
          <p className={`text-sm ${isCompleted ? 'text-emerald-600/80 dark:text-emerald-400/60' : 'text-slate-500 dark:text-slate-400'}`}>
            Expected at {prayer.time}
          </p>
        </div>
        
        <div className={`
          w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300
          ${isCompleted 
            ? 'bg-emerald-500 dark:bg-emerald-600 border-emerald-500 dark:border-emerald-600 text-white shadow-sm' 
            : isJumma 
              ? 'bg-transparent border-indigo-300 dark:border-indigo-700 text-indigo-300 dark:text-indigo-700' 
              : 'bg-transparent border-slate-300 dark:border-slate-700'
          }
        `}>
          {isCompleted ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          ) : isJumma ? (
            <div className="w-1.5 h-1.5 bg-indigo-300 dark:bg-indigo-700 rounded-full animate-pulse"></div>
          ) : null}
        </div>
      </div>
      
      {isCompleted && (
        <div className="absolute -bottom-4 -right-4 text-emerald-100/40 dark:text-emerald-900/20">
           <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
      )}
    </div>
  );
};

export default PrayerCard;
