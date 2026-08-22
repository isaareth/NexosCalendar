import { listEvents } from "@/lib/queries";
import { signOut } from "../login/actions";
import { Button } from "@/components/ui/button";
import { EventsManager } from "./components/EventsManager";

export default async function AdminDashboardPage() {
  const events = await listEvents();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6">
      <header className="flex items-center justify-between">
        <h1 className="font-heading text-2xl">Panel administrativo</h1>
        <form action={signOut}>
          <Button type="submit" variant="outline">
            Cerrar sesión
          </Button>
        </form>
      </header>

      <EventsManager events={events} />
    </div>
  );
}
