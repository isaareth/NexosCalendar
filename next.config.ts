import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Evita que Turbopack suba a C:\Proyecticos\NexosCalendar (repo v1) buscando la raíz
  // del workspace — este proyecto es su propio repo independiente.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
