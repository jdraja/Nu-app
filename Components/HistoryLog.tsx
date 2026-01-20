
import React, { useState, useMemo } from 'react';
import { DailyLog, PrayerStatus, Prayer } from '../types';
import { getHijriParts } from '../App';

interface HistoryLogProps {
  history: DailyLog[];
  currentPrayers: Prayer[];
  currentStreak: number;
  hijriOffset: number;
  onClose: () => void;
}

const normalizeToHijriFirst = (date: Date, offset: number) => {
  const d = new Date(date);
  d.setHours(12, 0, 0, 0); 
  let parts = getHijriParts(d, offset);
  let safety = 0;
  // Safer month-start search
  while (parts.day > 1 && safety < 35) {
    d.setDate(d.getDate() - 1);
    parts = getHijriParts(d, offset);
    safety++;
  }
  return d;
};

const HistoryLog: React.FC<HistoryLogProps> = ({ 
  history, 
  currentPrayers, 
  currentStreak, 
  hijriOffset, 
  onClose 
}) => {
  const [calendarType, setCalendarType] = useState<'gregorian' | 'hijri'>('hijri');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hijriAnchor, setHijriAnchor] = useState(() => normalizeToHijriFirst(new Date(), hijriOffset));
  const [selectedLog, setSelectedLog] = useState<DailyLog | null>(null);

  const stats = useMemo(() => {
    const last30Days = history.slice(0, 30);
    const totalPossible = last30Days.length * 5;
    const completed = last30Days.reduce((acc, log) => 
      acc + (log.prayers ? log.prayers.filter(p => p.status === PrayerStatus.COMPLETED).length : 0), 0);
    const fastingDays = history.filter(h => h.fasting?.isFasting).length;
    return {
      completionRate: totalPossible > 0 ? Math.round((completed / totalPossible) * 100) : 0,
      fastingDays
    };
  }, [history]);

  const changeMonth = (offset: number) => {
    if (calendarType === 'gregorian') {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1));
    } else {
      const d = new Date(hijriAnchor);
      if (offset > 0) {
        d.setDate(d.getDate() + 32); // Jump to next month
      } else {
        d.setDate(d.getDate() - 5); // Jump back to previous month
      }
      setHijriAnchor(normalizeToHijriFirst(d, hijriOffset));
    }
  };

  const renderProgressCircle = (completed: number, total: number, isPerfect: boolean) => {
    const radius = 20; 
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = total > 0 ? circumference - (completed / total) * circumference : circumference;
    
    return (
      <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-1">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="currentColor"
          strokeWidth="3.5"
          fill="transparent"
          className="text-slate-100 dark:text-slate-800"
        />
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className={`${isPerfect ? 'text-emerald-500' : 'text-indigo-400'} transition-all duration-700`}
        />
      </svg>
    );
  };

  const renderCalendarDay = (cellDate: Date, dayNum: number, otherDayNum: number, isToday: boolean, isFuture: boolean) => {
    const dateStr = cellDate.toDateString();
    let logEntry = history.find(h => new Date(h.date).toDateString() === dateStr);
    
    if (isToday && !logEntry) {
      logEntry = { date: dateStr, prayers: currentPrayers, streak: currentStreak };
    }

    const completed = logEntry?.prayers?.filter(p => p.status === PrayerStatus.COMPLETED).length || 0;
    const total = logEntry?.prayers?.length || 5;
    const isPerfect = completed === total && total > 0;

    return (
      <button 
        key={dateStr}
        disabled={isFuture && !isToday}
        onClick={() => setSelectedLog(logEntry || { date: dateStr, prayers: [], streak: 0 })}
        className={`relative aspect-square rounded-[1.25rem] flex items-center justify-center transition-all group
          ${isToday ? 'ring-[3px] ring-indigo-600 dark:ring-indigo-400 ring-offset-2 dark:ring-offset-slate-900 scale-[1.05] z-10' : ''}
          ${isFuture ? 'opacity-15 cursor-default' : 'hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 hover:scale-105 active:scale-95'}
        `}
      >
        {logEntry && renderProgressCircle(completed, total, isPerfect)}
        <div className="flex flex-col items-center relative z-10">
          <span className={`text-base font-bold ${isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-800 dark:text-slate-200'}`}>{dayNum}</span>
          <span className="text-[9px] font-black text-slate-300 dark:text-slate-600 mt-[-2px] uppercase tracking-tighter">{otherDayNum}</span>
        </div>
        {logEntry?.fasting?.isFasting && (
          <div className="absolute top-1.5 right-1.5">
             <span className="text-[12px]" title="Fasted Day">🌙</span>
          </div>
        )}
      </button>
    );
  };

  const renderGregorianCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} className="aspect-square"></div>);

    for (let day = 1; day <= daysInMonth; day++) {
      const cellDate = new Date(year, month, day);
      cellDate.setHours(0, 0, 0, 0);
      const hijri = getHijriParts(cellDate, hijriOffset);
      days.push(renderCalendarDay(cellDate, day, hijri.day, today.toDateString() === cellDate.toDateString(), cellDate > today));
    }

    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-3xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
              {currentMonth.toLocaleString('default', { month: 'long' })}
            </h3>
            <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{currentMonth.getFullYear()}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => changeMonth(-1)} className="p-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl text-slate-600 dark:text-slate-400 transition-all active:scale-90">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <button onClick={() => changeMonth(1)} className="p-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl text-slate-600 dark:text-slate-400 transition-all active:scale-90">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-3">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="text-center text-[11px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest pb-2">{d}</div>)}
          {days}
        </div>
      </div>
    );
  };

  const renderHijriCalendar = () => {
    const startOfHijriMonth = new Date(hijriAnchor);
    const firstWeekday = startOfHijriMonth.getDay();
    const parts = getHijriParts(startOfHijriMonth, hijriOffset);
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < firstWeekday; i++) days.push(<div key={`empty-${i}`} className="aspect-square"></div>);

    const currentMonthName = parts.monthName;
    const tempDate = new Date(startOfHijriMonth);
    let safety = 0;
    while (getHijriParts(tempDate, hijriOffset).monthName === currentMonthName && safety < 32) {
      const cellDate = new Date(tempDate);
      cellDate.setHours(0, 0, 0, 0);
      const hijri = getHijriParts(cellDate, hijriOffset);
      days.push(renderCalendarDay(cellDate, hijri.day, cellDate.getDate(), today.toDateString() === cellDate.toDateString(), cellDate > today));
      tempDate.setDate(tempDate.getDate() + 1);
      safety++;
    }

    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-3xl font-bold text-indigo-950 dark:text-indigo-100 leading-tight">{parts.monthName}</h3>
            <p className="text-xs font-black text-indigo-400 dark:text-indigo-500 uppercase tracking-[0.2em]">{parts.year} AH</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => changeMonth(-1)} className="p-4 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-2xl text-indigo-500 dark:text-indigo-400 transition-all active:scale-90">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <button onClick={() => changeMonth(1)} className="p-4 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-2xl text-indigo-500 dark:text-indigo-400 transition-all active:scale-90">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-3">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="text-center text-[11px] font-black text-indigo-300 dark:text-indigo-700 uppercase tracking-widest pb-2">{d}</div>)}
          {days}
        </div>
      </div>
    );
  };

  const renderDetail = (log: DailyLog) => {
    const dateObj = new Date(log.date);
    const isFriday = dateObj.getDay() === 5;
    const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const formattedHijri = getHijriParts(dateObj, hijriOffset).full;

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
        <button 
          onClick={() => setSelectedLog(null)} 
          className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold text-sm rounded-full border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group active:scale-95"
        >
           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="group-hover:-translate-x-1 transition-transform"><polyline points="15 18 9 12 15 6"/></svg>
           Back to Journey
        </button>
        <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-10 border border-slate-100 dark:border-slate-700 shadow-xl shadow-indigo-50/50 dark:shadow-none text-center relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-3xl font-serif font-bold text-slate-800 dark:text-slate-100 leading-tight">{formattedDate}</h3>
            <p className="text-indigo-500 dark:text-indigo-400 font-black text-xs uppercase tracking-[0.25em] mt-3 mb-10">{formattedHijri}</p>
            
            <div className="grid gap-4 text-left">
              {log.prayers.map(p => {
                const displayName = (isFriday && p.name === 'Dhuhr') ? 'Jumma' : p.name;
                const done = p.status === PrayerStatus.COMPLETED;
                return (
                  <div key={p.id} className={`flex items-center justify-between p-6 rounded-[2rem] border transition-all ${done ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/50' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 opacity-60'}`}>
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${done ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100 dark:shadow-none' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600'}`}>
                        {p.name[0]}
                      </div>
                      <div>
                        <h4 className={`text-lg font-bold ${done ? 'text-emerald-950 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-400'}`}>{displayName}</h4>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest">{p.time}</p>
                      </div>
                    </div>
                    {done && (
                      <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {log.fasting?.isFasting && (
              <div className="mt-10 p-8 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-[2.5rem] border border-orange-100 dark:border-orange-900/30 text-left relative overflow-hidden group">
                <div className="flex justify-between items-center mb-6">
                  <p className="text-[12px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-[0.2em]">Fasting Journal</p>
                  <span className="text-3xl group-hover:rotate-12 transition-transform">🌙</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-5 rounded-[1.5rem] border flex items-center justify-center gap-3 transition-all ${log.fasting.suhoor ? 'bg-white dark:bg-slate-700 border-orange-200 dark:border-orange-800 text-orange-950 dark:text-orange-100 shadow-sm' : 'opacity-40 border-transparent text-slate-400'}`}>
                    <span className="text-xl">☕</span>
                    <p className="text-xs font-bold uppercase tracking-widest">Suhoor</p>
                  </div>
                  <div className={`p-5 rounded-[1.5rem] border flex items-center justify-center gap-3 transition-all ${log.fasting.iftar ? 'bg-white dark:bg-slate-700 border-orange-200 dark:border-orange-800 text-orange-950 dark:text-orange-100 shadow-sm' : 'opacity-40 border-transparent text-slate-400'}`}>
                    <span className="text-xl">🍽️</span>
                    <p className="text-xs font-bold uppercase tracking-widest">Iftar</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-slate-50 dark:bg-slate-900 w-full max-w-xl rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] border border-white dark:border-slate-800 transition-colors">
        <div className="p-10 pb-6 flex flex-col sticky top-0 z-30 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-lg">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-serif font-bold text-indigo-950 dark:text-indigo-100 tracking-tight">Journey Journal</h2>
            <button onClick={onClose} className="p-4 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-[1.5rem] text-slate-500 dark:text-slate-400 shadow-sm transition-all active:scale-90 border border-slate-100 dark:border-slate-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          
          {!selectedLog && (
            <div className="flex flex-col gap-8">
              <div className="flex p-2 bg-indigo-950/5 dark:bg-white/5 rounded-[2.5rem] border border-slate-200/50 dark:border-slate-700 shadow-inner w-full">
                <button 
                  onClick={() => setCalendarType('gregorian')}
                  className={`flex-1 py-4 rounded-[2rem] text-sm font-black uppercase tracking-[0.2em] transition-all duration-500 ${calendarType === 'gregorian' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xl dark:shadow-none border border-indigo-50 dark:border-indigo-900/30' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
                >
                  Gregorian
                </button>
                <button 
                  onClick={() => setCalendarType('hijri')}
                  className={`flex-1 py-4 rounded-[2rem] text-sm font-black uppercase tracking-[0.2em] transition-all duration-500 ${calendarType === 'hijri' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xl dark:shadow-none border border-indigo-50 dark:border-indigo-900/30' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
                >
                  Hijri
                </button>
              </div>

              <div className="grid grid-cols-2 gap-5">
                 <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] border border-indigo-50 dark:border-indigo-900/30 shadow-sm flex items-center gap-5 transition-transform hover:scale-105">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-500 text-2xl shadow-sm shadow-indigo-100/50">⚡</div>
                    <div>
                      <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">30d Stats</p>
                      <p className="text-2xl font-bold text-indigo-950 dark:text-indigo-100">{stats.completionRate}%</p>
                    </div>
                 </div>
                 <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] border border-orange-50 dark:border-orange-900/30 shadow-sm flex items-center gap-5 transition-transform hover:scale-105">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-900/50 flex items-center justify-center text-orange-500 text-2xl shadow-sm shadow-orange-100/50">🌙</div>
                    <div>
                      <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Fasting</p>
                      <p className="text-2xl font-bold text-orange-950 dark:text-orange-100">{stats.fastingDays} Days</p>
                    </div>
                 </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="overflow-y-auto p-10 pt-4 flex-1 scrollbar-hide">
          {selectedLog ? renderDetail(selectedLog) : (
            <div className="space-y-12">
              <div className="bg-white dark:bg-slate-800 p-10 rounded-[3.5rem] border border-slate-200/60 dark:border-slate-700/60 shadow-xl shadow-slate-200/20 dark:shadow-none transition-colors">
                 {calendarType === 'gregorian' ? renderGregorianCalendar() : renderHijriCalendar()}
                 
                 <div className="mt-12 pt-10 border-t border-slate-50 dark:border-slate-700 flex flex-col gap-6">
                    <p className="text-[11px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.25em] mb-2">Guide</p>
                    <div className="grid grid-cols-2 gap-6">
                       <div className="flex items-center gap-4">
                          <div className="w-5 h-5 rounded-full border-[3px] border-emerald-500"></div>
                          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Perfect Day</span>
                       </div>
                       <div className="flex items-center gap-4">
                          <div className="w-5 h-5 rounded-full border-[3px] border-indigo-300 dark:border-indigo-700"></div>
                          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Building</span>
                       </div>
                       <div className="flex items-center gap-4">
                          <span className="text-2xl">🌙</span>
                          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Fasted</span>
                       </div>
                       <div className="flex items-center gap-4">
                          <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700"></div>
                          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Empty</span>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-[3.5rem] border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/20 dark:shadow-none overflow-hidden transition-colors">
                <div className="p-10 border-b border-slate-50 dark:border-slate-700">
                   <h4 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em]">Recent Timeline</h4>
                </div>
                <div className="divide-y divide-slate-50 dark:divide-slate-700">
                  {history.slice(0, 5).map(log => {
                    const d = new Date(log.date);
                    const completed = log.prayers?.filter(p => p.status === PrayerStatus.COMPLETED).length || 0;
                    return (
                      <button 
                        key={log.date} 
                        onClick={() => setSelectedLog(log)} 
                        className="w-full p-8 flex items-center justify-between hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-all active:scale-[0.98] group"
                      >
                        <div className="text-left">
                          <p className="text-xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest mt-0.5">{getHijriParts(d, hijriOffset).full}</p>
                        </div>
                        <div className="flex items-center gap-6">
                           {log.fasting?.isFasting && <span className="text-2xl">🌙</span>}
                           <div className="flex gap-1.5">
                              {[1,2,3,4,5].map(i => (
                                <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${i <= completed ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)] dark:shadow-none' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                              ))}
                           </div>
                        </div>
                      </button>
                    )
                  })}
                  {history.length === 0 && (
                    <div className="p-16 text-center">
                       <p className="text-slate-400 dark:text-slate-600 font-bold italic">Your spiritual journey starts here...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-10 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] dark:shadow-none">
           <button 
             onClick={onClose} 
             className="w-full bg-indigo-950 dark:bg-indigo-600 text-white font-bold py-6 rounded-[2.5rem] shadow-2xl shadow-indigo-900/20 dark:shadow-none hover:bg-indigo-900 dark:hover:bg-indigo-500 transition-all active:scale-95 uppercase text-sm tracking-[0.3em]"
           >
             Return Home
           </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryLog;
