"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { validateEventInput } from "@/lib/validators";
import type { Event, EventInput } from "@/lib/types";

type ActionResult = { data: Event } | { error: string };

async function requireSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return supabase;
}

export async function createEvent(input: Partial<EventInput>): Promise<ActionResult> {
  const supabase = await requireSession();
  if (!supabase) return { error: "No autorizado." };

  const result = validateEventInput(input);
  if (!result.valid) return { error: result.errors.join(" ") };

  const { data, error } = await supabase
    .from("events")
    .insert(result.data)
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/dashboard");
  return { data: data as Event };
}

export async function updateEvent(
  id: string,
  input: Partial<EventInput>,
): Promise<ActionResult> {
  const supabase = await requireSession();
  if (!supabase) return { error: "No autorizado." };

  const result = validateEventInput(input);
  if (!result.valid) return { error: result.errors.join(" ") };

  const { data, error } = await supabase
    .from("events")
    .update(result.data)
    .eq("id", id)
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/dashboard");
  return { data: data as Event };
}

export async function deleteEvent(id: string): Promise<{ success: true } | { error: string }> {
  const supabase = await requireSession();
  if (!supabase) return { error: "No autorizado." };

  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/dashboard");
  return { success: true };
}
