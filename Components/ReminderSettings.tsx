
import React from 'react';
import { PrayerName, ReminderConfig } from '../types';

interface ReminderSettingsProps {
  reminders: Record<PrayerName, ReminderConfig>;
  onUpdate: (name: PrayerName, config: ReminderConfig) => void;
  onClose: () => void;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const ReminderSettings: React.FC<ReminderSettingsProps> = ({ reminders, onUpdate, onClose }) => {
  const toggleDay = (name: PrayerName, dayIndex: number) => {
    const config = reminders[name];
    const newDays = config.days.includes(dayIndex)
      ? config.days.filter(d => d !== dayIndex)
      : [...config.days, dayIndex];
    onUpdate(name, { ...config, days: newDays });
  };

  const toggleEnabled = (name: PrayerName) => {
    const config = reminders[name];
    onUpdate(name, { ...config, enabled: !config.enabled });
  };

  const updateLeadTime = (name: PrayerName, minutes: number) => {
    onUpdate(name, { ...reminders[name], leadTimeMinutes: minutes });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/10 dark:border-slate-800">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
          <h2 className="text-2xl font-serif font-bold text-indigo-950 dark:text-indigo-100">Reminders</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400 dark:text-slate-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-8 dark:bg-slate-900/50">
          {(Object.keys(reminders) as PrayerName[]).map((name) => (
            <div key={name} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-8 rounded-full ${reminders[name].enabled ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{name}</h3>
                </div>
                <button
                  onClick={() => toggleEnabled(name)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none shadow-inner ${reminders[name].enabled ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${reminders[name].enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {reminders[name].enabled && (
                <div className="pl-5 space-y-4 animate-in slide-in-from-top-2 duration-300">
                  <div>
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Lead Time</p>
                    <div className="flex flex-wrap gap-2">
                      {[0, 5, 10, 15, 30].map(mins => (
                        <button
                          key={mins}
                          onClick={() => updateLeadTime(name, mins)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${reminders[name].leadTimeMinutes === mins ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-200 dark:ring-indigo-800' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                        >
                          {mins === 0 ? 'On time' : `${mins}m before`}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Repeat Days</p>
                    <div className="flex gap-1.5">
                      {DAYS.map((day, idx) => (
                        <button
                          key={day}
                          onClick={() => toggleDay(name, idx)}
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${reminders[name].days.includes(idx) ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                        >
                          {day[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          <button 
            onClick={onClose}
            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-95 uppercase tracking-widest text-sm"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReminderSettings;
