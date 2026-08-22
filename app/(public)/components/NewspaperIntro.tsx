"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * Splash de entrada: dos "hojas" de periódico cerradas mostrando el logo creativo de
 * NEXOS, que se abren como una portada (~2.2s) revelando la página real detrás. Se salta
 * por completo con prefers-reduced-motion (manejado en CSS, ver app/globals.css).
 */
export function NewspaperIntro() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(false), 2200);
    return () => clearTimeout(timeout);
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden
      className="animate-paper-overlay-fade pointer-events-none fixed inset-0 z-50 overflow-hidden [perspective:1800px]"
    >
      <div className="animate-paper-open-left absolute inset-y-0 left-0 w-1/2 origin-right border-r border-black/10 bg-card [backface-visibility:hidden]" />
      <div className="animate-paper-open-right absolute inset-y-0 right-0 w-1/2 origin-left border-l border-black/10 bg-card [backface-visibility:hidden]" />

      <div className="animate-paper-logo-fade absolute inset-0 flex flex-col items-center justify-center gap-2">
        <Image
          src="/brand/logo-nexos-creativo.jpg"
          alt=""
          width={160}
          height={160}
          priority
          className="rounded-2xl shadow-lg"
        />
        <p className="font-heading text-sm tracking-widest text-muted-foreground uppercase">
          Periódico Estudiantil
        </p>
      </div>
    </div>
  );
}
