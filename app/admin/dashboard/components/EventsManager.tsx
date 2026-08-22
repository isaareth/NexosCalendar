"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CharacterBadge } from "@/app/(public)/components/CharacterBadge";
import { categoryLabel } from "@/lib/categories";
import { deleteEvent } from "../actions";
import { EventForm } from "./EventForm";
import type { Event } from "@/lib/types";

export function EventsManager({ events }: { events: Event[] }) {
  const router = useRouter();
  const [formState, setFormState] = useState<{ open: boolean; event?: Event }>({
    open: false,
  });
  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deletePending, setDeletePending] = useState(false);

  function closeForm() {
    setFormState({ open: false });
    router.refresh();
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeletePending(true);
    const result = await deleteEvent(deleteTarget.id);
    setDeletePending(false);

    if ("error" in result) {
      setDeleteError(result.error);
      return;
    }
    setDeleteTarget(null);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl">Actividades ({events.length})</h2>
        <Button onClick={() => setFormState({ open: true })}>
          <Plus className="size-4" />
          Nueva actividad
        </Button>
      </div>

      {events.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
          Todavía no hay actividades. Crea la primera con &quot;Nueva actividad&quot;.
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
          {events.map((event) => (
            <div key={event.id} className="flex items-center justify-between gap-3 p-3">
              <div className="flex min-w-0 flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="truncate font-medium">{event.title}</span>
                  <CharacterBadge character={event.character} />
                </div>
                <p className="truncate text-sm text-muted-foreground">
                  {categoryLabel(event.category)} ·{" "}
                  {format(new Date(event.start_time), "d MMM yyyy, HH:mm", { locale: es })} ·{" "}
                  {event.location}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Editar"
                  onClick={() => setFormState({ open: true, event })}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Eliminar"
                  onClick={() => {
                    setDeleteTarget(event);
                    setDeleteError(null);
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={formState.open} onOpenChange={(open) => !open && closeForm()}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading">
              {formState.event ? "Editar actividad" : "Nueva actividad"}
            </DialogTitle>
            <DialogDescription>
              Los campos marcados son obligatorios. El género solo aplica a Fútbol.
            </DialogDescription>
          </DialogHeader>
          <EventForm
            key={formState.event?.id ?? "new"}
            event={formState.event}
            onSuccess={closeForm}
            onCancel={closeForm}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading">Eliminar actividad</DialogTitle>
            <DialogDescription>
              ¿Eliminar &quot;{deleteTarget?.title}&quot;? Esta acción no se puede deshacer y
              desaparece de inmediato de la vista pública.
            </DialogDescription>
          </DialogHeader>
          {deleteError && (
            <p role="alert" className="text-sm font-medium text-destructive">
              {deleteError}
            </p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deletePending}>
              {deletePending ? "Eliminando…" : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
