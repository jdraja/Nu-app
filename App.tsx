import { useEffect, useState } from "react";

/**
 * Returns Hijri parts for a given date with optional day offset.
 * Uses Intl.DateTimeFormat with the Islamic calendar.
 */
export function getHijriParts(date: Date, offset = 0) {
  const d = new Date(date);
  if (offset) d.setDate(d.getDate() + offset);

  // Use an Islamic calendar locale tag. 'en-u-ca-islamic' (or 'en-SA-u-ca-islamic') works in modern browsers/Node.
  const fmt = new Intl.DateTimeFormat('en-SA-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' });
  const parts = fmt.formatToParts(d).reduce(
    (acc: any, p: Intl.DateTimeFormatPart) => {
      if (p.type === 'day') acc.day = Number(p.value);
      if (p.type === 'month') acc.monthName = p.value;
      if (p.type === 'year') acc.year = Number(p.value);
      return acc;
    },
    { day: 0, monthName: '', year: 0 }
  );

  return {
    day: parts.day,
    monthName: parts.monthName,
    year: parts.year,
    full: fmt.format(d)
  };
}

function App() {
  const [message] = useState("Nur – Spiritual Prayer Companion");

  useEffect(() => {
    localStorage.setItem("nur_last_opened_date", new Date().toDateString());
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>{message}</h1>
      <p>App is running correctly.</p>
    </div>
  );
}

export default App;