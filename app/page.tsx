import Image from "next/image";
import { Countdown } from "./(public)/components/Countdown";
import { CalendarView } from "./(public)/components/CalendarView";
import { Filters } from "./(public)/components/Filters";
import { getNextEvent, listEvents } from "@/lib/queries";
import { isCategory } from "@/lib/categories";
import type { EventFilters } from "@/lib/types";

interface HomeProps {
  searchParams: Promise<{
    category?: string;
    gender?: string;
    character?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;

  const filters: EventFilters = {};
  if (params.category && isCategory(params.category)) filters.category = params.category;
  if (params.gender === "masculino" || params.gender === "femenino")
    filters.gender = params.gender;
  if (params.character === "obligatorio" || params.character === "voluntario")
    filters.character = params.character;

  const [events, nextEvent] = await Promise.all([listEvents(filters), getNextEvent()]);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-8 sm:px-6">
      <header className="flex flex-col items-center gap-4 text-center">
        <Image
          src="/brand/logo-nexos.jpg"
          alt="NEXOS — Periódico Estudiantil"
          width={140}
          height={140}
          className="rounded-full"
          priority
        />
        <p className="font-heading text-lg text-muted-foreground">
          Calendario de actividades de NEXOS
        </p>
      </header>

      <Countdown
        nextEventStartTime={nextEvent?.start_time ?? null}
        nextEventTitle={nextEvent?.title ?? null}
      />

      <Filters />

      <CalendarView events={events} />
    </div>
  );
}
