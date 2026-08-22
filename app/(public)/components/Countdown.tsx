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
      <div className="rounded-2xl bg-primary px-6 py-10 text-center text-primary-foreground">
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
    <div className="relative overflow-hidden rounded-2xl bg-primary px-6 py-10 text-center text-primary-foreground sm:py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, currentColor 0 2px, transparent 2px 26px)",
        }}
      />

      <div className="relative">
        <p className="flex items-center justify-center gap-2 font-heading text-base opacity-90 sm:text-lg">
          <span className="relative flex size-2 rounded-full bg-accent">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75" />
          </span>
          Falta para
        </p>
        <h2 className="mt-1 text-balance font-heading text-2xl font-semibold sm:text-4xl">
          {nextEventTitle}
        </h2>

        <div className="mt-6 flex flex-wrap justify-center gap-3 sm:mt-8 sm:gap-4">
          {units.map(([label, value], i) => (
            <div key={label} className="flex items-center gap-3 sm:gap-4">
              <div className="flex min-w-[4.5rem] flex-col items-center rounded-xl bg-black/15 px-3 py-2.5 sm:min-w-24 sm:px-4 sm:py-3">
                <span className="font-sans text-4xl leading-none font-black tabular-nums sm:text-6xl">
                  {pad(value)}
                </span>
                <span className="mt-1.5 text-[10px] font-semibold tracking-widest uppercase opacity-80 sm:text-xs">
                  {label}
                </span>
              </div>
              {i < units.length - 1 && (
                <span className="hidden text-3xl font-light opacity-40 sm:inline sm:text-4xl">:</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
