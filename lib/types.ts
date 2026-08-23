import type { Category } from "./categories";

export type EventCharacter = "obligatorio" | "voluntario";
export type EventGender = "masculino" | "femenino" | "no_aplica";
export type EventOutcome = "ganado" | "perdido" | "empate";

export interface Event {
  id: string;
  title: string;
  description: string | null;
  extra_info: string | null;
  category: Category;
  gender: EventGender;
  character: EventCharacter;
  start_time: string; // ISO 8601
  end_time: string | null; // ISO 8601
  location: string;
  result: string | null;
  outcome: EventOutcome | null;
  created_at: string;
  updated_at: string;
}

export interface EventInput {
  title: string;
  description?: string;
  extra_info?: string;
  category: Category;
  gender?: "masculino" | "femenino";
  character: EventCharacter;
  start_time: string;
  end_time?: string;
  location: string;
  result?: string;
  outcome?: EventOutcome;
}

export interface EventFilters {
  category?: Category;
  gender?: "masculino" | "femenino";
  character?: EventCharacter;
}
