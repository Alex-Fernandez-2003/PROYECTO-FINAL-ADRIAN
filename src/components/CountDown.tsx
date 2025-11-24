import React, { useEffect, useState } from "react";
export default function Countdown({ targetDate }: { targetDate: Date }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, targetDate.getTime() - now.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return (
    <section className="mb-10 text-center">
      <h2 className="text-2xl font-semibold mb-3">Cuenta regresiva</h2>
      <div className="inline-flex items-center gap-3 rounded-xl border border-gray-100 px-6 py-4 shadow-sm bg-white">
        <TimePill label="Días" value={days} />
        <TimePill label="Horas" value={hours} />
        <TimePill label="Min" value={minutes} />
        <TimePill label="Seg" value={seconds} />
      </div>
    </section>
  );
}
function TimePill({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold">{String(value).padStart(2, "0")}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}
