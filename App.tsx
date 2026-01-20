
import { useEffect, useState } from "react";

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
