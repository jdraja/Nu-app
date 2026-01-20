
export enum PrayerStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  MISSED = 'MISSED'
}

export type PrayerName = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha' | 'Jumma';

export interface Prayer {
  id: string;
  name: PrayerName;
  time: string; // Format: "HH:mm AM/PM"
  status: PrayerStatus;
}

export interface ReminderConfig {
  enabled: boolean;
  leadTimeMinutes: number; // minutes before the prayer time
  days: number[]; // 0-6 (Sun-Sat)
}

export interface FastingLog {
  isFasting: boolean;
  suhoor: boolean;
  iftar: boolean;
  taraweeh: boolean;
  quranPages: number;
}

export interface DailyLog {
  date: string;
  prayers: Prayer[];
  streak: number;
  fasting?: FastingLog;
}
