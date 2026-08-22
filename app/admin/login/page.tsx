import Image from "next/image";
import { LoginForm } from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col items-center justify-center gap-6 px-4">
      <Image src="/brand/logo-nexos.jpg" alt="NEXOS" width={96} height={96} className="rounded-full" />
      <div className="w-full rounded-2xl border border-border bg-card p-6">
        <h1 className="mb-1 font-heading text-xl">Panel administrativo</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Acceso exclusivo para directivos de NEXOS.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
