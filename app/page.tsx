import Image from "next/image";
import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Countdown } from "./(public)/components/Countdown";
import { CalendarView } from "./(public)/components/CalendarView";
import { Filters } from "./(public)/components/Filters";
import { Ticker } from "./(public)/components/Ticker";
import { getNextEvent, getUpcomingEvents, listEvents } from "@/lib/queries";
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

  const [events, nextEvent, upcoming] = await Promise.all([
    listEvents(filters),
    getNextEvent(),
    getUpcomingEvents(3),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-border bg-card/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Image
              src="/brand/logo-nexos.jpg"
              alt="NEXOS — Periódico Estudiantil"
              width={44}
              height={44}
              className="rounded-full"
              priority
            />
            <div className="leading-tight">
              <p className="font-heading text-lg font-semibold">NEXOS</p>
              <p className="text-xs text-muted-foreground">Calendario de actividades</p>
            </div>
          </div>

          <Button variant="outline" size="sm" render={<Link href="/admin/login" />}>
            <LayoutDashboard className="size-4" />
            <span className="hidden sm:inline">Panel administrativo</span>
            <span className="sm:hidden">Admin</span>
          </Button>
        </div>
      </header>

      <Ticker events={upcoming} />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 py-8 sm:px-6 sm:py-10">
        <Countdown
          nextEventStartTime={nextEvent?.start_time ?? null}
          nextEventTitle={nextEvent?.title ?? null}
        />

        <section className="flex flex-col gap-5">
          <h2 className="font-heading text-2xl">Calendario</h2>
          <Filters />
          <CalendarView events={events} />
        </section>
      </main>
    </div>
  );
}
