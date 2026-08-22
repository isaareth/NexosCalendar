"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarDays, MapPin, Trophy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CharacterBadge } from "./CharacterBadge";
import { categoryLabel } from "@/lib/categories";
import { CATEGORY_COLOR } from "@/lib/theme";
import type { Event } from "@/lib/types";

interface EventModalProps {
  event: Event | null;
  onClose: () => void;
}

/** Modal de detalle de actividad (FR-008). */
export function EventModal({ event, onClose }: EventModalProps) {
  return (
    <Dialog open={event !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        {event && (
          <>
            <DialogHeader>
              <span
                className="mb-1 inline-block w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
                style={{ backgroundColor: CATEGORY_COLOR[event.category] }}
              >
                {categoryLabel(event.category)}
                {event.gender !== "no_aplica" &&
                  ` · ${event.gender === "masculino" ? "Masculino" : "Femenino"}`}
              </span>
              <DialogTitle className="font-heading text-2xl">{event.title}</DialogTitle>
              <DialogDescription className="sr-only">
                Detalle de la actividad {event.title}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center gap-2 text-foreground">
                <CalendarDays className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                <span>
                  {format(new Date(event.start_time), "EEEE d 'de' MMMM, HH:mm", { locale: es })}
                  {event.end_time &&
                    ` – ${format(new Date(event.end_time), "HH:mm", { locale: es })}`}
                </span>
              </div>

              <div className="flex items-center gap-2 text-foreground">
                <MapPin className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                <span>{event.location}</span>
              </div>

              <div>
                <CharacterBadge character={event.character} />
              </div>

              {event.description && (
                <p className="whitespace-pre-line text-foreground">{event.description}</p>
              )}

              {event.extra_info && (
                <div className="rounded-lg bg-muted p-3 text-muted-foreground">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide">
                    Información extra
                  </p>
                  <p className="whitespace-pre-line">{event.extra_info}</p>
                </div>
              )}

              {event.result && (
                <div className="flex items-center gap-2 rounded-lg bg-accent/15 p-3 font-semibold text-accent-foreground">
                  <Trophy className="size-4 shrink-0" aria-hidden />
                  <span>{event.result}</span>
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
