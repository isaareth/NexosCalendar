"use client";

import { useEffect, useState } from "react";

interface CountdownProps {
  nextEventStartTime: string | null;
  nextEventTitle: string | null;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function computeTimeLeft(target: string): TimeLeft {
  const diff = Math.max(0, new Date(target).getTime() - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

/** Countdown al próximo evento futuro, de cualquier categoría (FR-002). */
export function Countdown({ nextEventStartTime, nextEventTitle }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(
    nextEventStartTime ? computeTimeLeft(nextEventStartTime) : null,
  );

  useEffect(() => {
    if (!nextEventStartTime) return;
    const id = setInterval(() => {
      setTimeLeft(computeTimeLeft(nextEventStartTime));
    }, 1000);
    return () => clearInterval(id);
  }, [nextEventStartTime]);

  if (!nextEventStartTime || !timeLeft) {
    return (
      <div className="rounded-2xl bg-primary px-6 py-8 text-center text-primary-foreground">
        <p className="font-heading text-xl">Por ahora no hay ninguna actividad programada.</p>
        <p className="mt-1 text-sm opacity-80">Vuelve pronto — NEXOS siempre tiene algo en camino.</p>
      </div>
    );
  }

  const units: [string, number][] = [
    ["Días", timeLeft.days],
    ["Horas", timeLeft.hours],
    ["Min", timeLeft.minutes],
    ["Seg", timeLeft.seconds],
  ];

  return (
    <div className="rounded-2xl bg-primary px-6 py-8 text-center text-primary-foreground">
      <p className="font-heading text-lg opacity-90">Falta para</p>
      <h2 className="font-heading text-2xl font-semibold sm:text-3xl">{nextEventTitle}</h2>
      <div className="mt-5 flex justify-center gap-3 sm:gap-6">
        {units.map(([label, value]) => (
          <div key={label} className="flex flex-col items-center">
            <span className="font-heading text-3xl font-bold tabular-nums sm:text-5xl">
              {pad(value)}
            </span>
            <span className="text-xs uppercase tracking-wide opacity-80">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
