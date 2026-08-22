"use client";

import { useMemo, useState } from "react";
import {
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventModal } from "./EventModal";
import { eventColor, eventColorForeground } from "@/lib/theme";
import type { Event } from "@/lib/types";

type ViewMode = "month" | "week";

export function CalendarView({ events }: { events: Event[] }) {
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [cursor, setCursor] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const days = useMemo(() => {
    if (viewMode === "week") {
      const start = startOfWeek(cursor, { weekStartsOn: 1 });
      const end = endOfWeek(cursor, { weekStartsOn: 1 });
      return eachDayOfInterval({ start, end });
    }
    const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [cursor, viewMode]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, Event[]>();
    for (const event of events) {
      const key = format(new Date(event.start_time), "yyyy-MM-dd");
      const list = map.get(key) ?? [];
      list.push(event);
      map.set(key, list);
    }
    return map;
  }, [events]);

  function goPrev() {
    setCursor((c) => (viewMode === "week" ? subWeeks(c, 1) : subMonths(c, 1)));
  }
  function goNext() {
    setCursor((c) => (viewMode === "week" ? addWeeks(c, 1) : addMonths(c, 1)));
  }
  function goToday() {
    setCursor(new Date());
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-heading text-xl capitalize">
          {format(cursor, viewMode === "week" ? "'Semana del' d 'de' MMMM" : "MMMM yyyy", {
            locale: es,
          })}
        </h3>
        <div className="flex items-center gap-2">
          <div className="flex overflow-hidden rounded-lg border border-border">
            <Button
              variant={viewMode === "month" ? "default" : "ghost"}
              size="sm"
              className="rounded-none"
              onClick={() => setViewMode("month")}
            >
              Mes
            </Button>
            <Button
              variant={viewMode === "week" ? "default" : "ghost"}
              size="sm"
              className="rounded-none"
              onClick={() => setViewMode("week")}
            >
              Semana
            </Button>
          </div>
          <Button variant="outline" size="icon" onClick={goPrev} aria-label="Anterior">
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToday}>
            Hoy
          </Button>
          <Button variant="outline" size="icon" onClick={goNext} aria-label="Siguiente">
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase text-muted-foreground">
        {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      <div className={`grid grid-cols-7 gap-1 ${viewMode === "month" ? "auto-rows-[6rem]" : "auto-rows-[10rem]"}`}>
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const dayEvents = eventsByDay.get(key) ?? [];
          const muted = viewMode === "month" && !isSameMonth(day, cursor);

          return (
            <div
              key={key}
              className={`flex flex-col gap-1 overflow-hidden rounded-lg border border-border/60 p-1.5 ${
                muted ? "bg-muted/40 text-muted-foreground" : "bg-background"
              }`}
            >
              <span
                className={`self-end text-xs font-semibold ${
                  isToday(day) ? "flex size-5 items-center justify-center rounded-full bg-accent text-accent-foreground" : ""
                }`}
              >
                {format(day, "d")}
              </span>
              <div className="flex flex-col gap-0.5 overflow-y-auto">
                {dayEvents.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className="truncate rounded px-1.5 py-0.5 text-left text-[11px] font-medium hover:opacity-90"
                    style={{
                      backgroundColor: eventColor(event),
                      color: eventColorForeground(event),
                    }}
                    title={event.title}
                  >
                    {event.title}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
}
