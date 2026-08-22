"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORY_ORDER, categoryLabel, genderAppliesTo, isCategory } from "@/lib/categories";
import { createEvent, updateEvent } from "../actions";
import type { Event, EventInput } from "@/lib/types";

const CATEGORY_ITEMS: Record<string, string> = Object.fromEntries(
  CATEGORY_ORDER.map((cat) => [cat, categoryLabel(cat)]),
);
const CHARACTER_ITEMS = { obligatorio: "Obligatorio", voluntario: "Voluntario" };
const GENDER_ITEMS = { masculino: "Masculino", femenino: "Femenino" };

function toLocalInputValue(iso: string | null) {
  if (!iso) return "";
  const date = new Date(iso);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

interface EventFormProps {
  event?: Event;
  onSuccess: () => void;
  onCancel: () => void;
}

/** Formulario de creación/edición. El campo género solo se habilita para Fútbol (FR-005). */
export function EventForm({ event, onSuccess, onCancel }: EventFormProps) {
  const [category, setCategory] = useState<string>(event?.category ?? CATEGORY_ORDER[0]);
  const [gender, setGender] = useState<string>(
    event?.gender && event.gender !== "no_aplica" ? event.gender : "",
  );
  const [character, setCharacter] = useState<string>(event?.character ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const showGender = isCategory(category) && genderAppliesTo(category);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);

    const input: Partial<EventInput> = {
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? "") || undefined,
      extra_info: String(formData.get("extra_info") ?? "") || undefined,
      category: category as EventInput["category"],
      gender: showGender ? (gender as "masculino" | "femenino") : undefined,
      character: character as EventInput["character"],
      start_time: formData.get("start_time")
        ? new Date(String(formData.get("start_time"))).toISOString()
        : "",
      end_time: formData.get("end_time")
        ? new Date(String(formData.get("end_time"))).toISOString()
        : undefined,
      location: String(formData.get("location") ?? ""),
      result: String(formData.get("result") ?? "") || undefined,
    };

    const result = event ? await updateEvent(event.id, input) : await createEvent(input);
    setPending(false);

    if ("error" in result) {
      setError(result.error);
      return;
    }
    onSuccess();
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Título</Label>
        <Input id="title" name="title" defaultValue={event?.title} required />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label>Categoría</Label>
          <Select
            items={CATEGORY_ITEMS}
            value={category}
            onValueChange={(v) => { setCategory(v as string); setGender(""); }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_ORDER.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {categoryLabel(cat)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Carácter</Label>
          <Select items={CHARACTER_ITEMS} value={character} onValueChange={(v) => setCharacter(v as string)}>
            <SelectTrigger>
              <SelectValue placeholder="Elegir…" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="obligatorio">Obligatorio</SelectItem>
              <SelectItem value="voluntario">Voluntario</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {showGender && (
        <div className="flex flex-col gap-1.5">
          <Label>Género</Label>
          <Select items={GENDER_ITEMS} value={gender} onValueChange={(v) => setGender(v as string)}>
            <SelectTrigger>
              <SelectValue placeholder="Elegir…" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="masculino">Masculino</SelectItem>
              <SelectItem value="femenino">Femenino</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="start_time">Inicio</Label>
          <Input
            id="start_time"
            name="start_time"
            type="datetime-local"
            defaultValue={toLocalInputValue(event?.start_time ?? null)}
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="end_time">Fin (opcional)</Label>
          <Input
            id="end_time"
            name="end_time"
            type="datetime-local"
            defaultValue={toLocalInputValue(event?.end_time ?? null)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="location">Lugar</Label>
        <Input id="location" name="location" defaultValue={event?.location} required />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Descripción</Label>
        <textarea
          id="description"
          name="description"
          defaultValue={event?.description ?? ""}
          rows={3}
          className="rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="extra_info">Información extra (opcional)</Label>
        <textarea
          id="extra_info"
          name="extra_info"
          defaultValue={event?.extra_info ?? ""}
          rows={2}
          className="rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="result">Resultado (opcional)</Label>
        <Input id="result" name="result" defaultValue={event?.result ?? ""} placeholder="Ej. NEXOS 3 - 1 Rival" />
      </div>

      {error && (
        <p role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}

      <div className="mt-2 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={pending || !character}>
          {pending ? "Guardando…" : "Guardar"}
        </Button>
      </div>
    </form>
  );
}
