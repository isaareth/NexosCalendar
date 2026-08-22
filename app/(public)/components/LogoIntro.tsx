"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * Splash de entrada: el logo aparece grande y centrado, gira mientras hace zoom-out
 * durante ~2s hacia la esquina superior izquierda, y se desvanece justo cuando "llega" —
 * revelando el logo real ya en su lugar en el header. Se salta si el visitante tiene
 * activado prefers-reduced-motion.
 */
export function LogoIntro() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(false), 2000);
    return () => clearTimeout(timeout);
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden
      className="animate-logo-intro-fade pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-background"
    >
      <Image
        src="/brand/logo-nexos.jpg"
        alt=""
        width={140}
        height={140}
        priority
        className="animate-logo-intro-spin rounded-full"
      />
    </div>
  );
}
