import { createClient } from "./supabase/server";
import type { Event, EventFilters } from "./types";

export async function listEvents(filters: EventFilters = {}): Promise<Event[]> {
  const supabase = await createClient();
  let query = supabase.from("events").select("*").order("start_time", { ascending: true });

  if (filters.category) query = query.eq("category", filters.category);
  if (filters.gender) query = query.eq("gender", filters.gender);
  if (filters.character) query = query.eq("character", filters.character);

  const { data, error } = await query;
  if (error) throw new Error(`No se pudieron cargar las actividades: ${error.message}`);
  return data as Event[];
}

/** Próximas N actividades futuras, de cualquier categoría — no depende de los filtros activos. */
export async function getUpcomingEvents(limit: number): Promise<Event[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .gt("start_time", new Date().toISOString())
    .order("start_time", { ascending: true })
    .limit(limit);

  if (error) throw new Error(`No se pudieron cargar las próximas actividades: ${error.message}`);
  return data as Event[];
}

export async function getNextEvent(): Promise<Event | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .gt("start_time", new Date().toISOString())
    .order("start_time", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(`No se pudo calcular el próximo evento: ${error.message}`);
  return data as Event | null;
}
