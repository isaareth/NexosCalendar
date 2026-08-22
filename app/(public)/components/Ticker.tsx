import { format } from "date-fns";
import { es } from "date-fns/locale";
import { categoryLabel } from "@/lib/categories";
import { CATEGORY_COLOR } from "@/lib/theme";
import type { Event } from "@/lib/types";

/**
 * Franja animada con las próximas actividades, de cualquier categoría (no depende de los
 * filtros activos, igual que el countdown). Animación CSS pura — ver la clase
 * `.animate-ticker` en app/globals.css, que se desactiva con prefers-reduced-motion.
 */
export function Ticker({ events }: { events: Event[] }) {
  if (events.length === 0) return null;

  const items = [...events, ...events];

  return (
    <div className="group overflow-hidden border-y border-border bg-primary">
      <div className="flex w-max animate-ticker items-center gap-10 py-2.5 group-hover:[animation-play-state:paused]">
        {items.map((event, i) => (
          <span
            key={`${event.id}-${i}`}
            className="flex shrink-0 items-center gap-2 whitespace-nowrap text-sm text-primary-foreground"
          >
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: CATEGORY_COLOR[event.category] }}
              aria-hidden
            />
            <strong className="font-heading font-semibold">{event.title}</strong>
            <span className="opacity-75">
              {categoryLabel(event.category)} ·{" "}
              {format(new Date(event.start_time), "EEE d MMM, HH:mm", { locale: es })}
            </span>
            <span className="opacity-30" aria-hidden>
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
