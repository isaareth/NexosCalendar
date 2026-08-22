"use client";

import type { ReactNode } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { CATEGORY_ORDER, categoryLabel, genderAppliesTo, isCategory } from "@/lib/categories";
import { CATEGORY_COLOR, GENDER_COLOR } from "@/lib/theme";

const ALL = "__all__";

interface ChipProps {
  label: string;
  active: boolean;
  /** Sin color: usa el estilo neutro (foreground/border). Con color: lo usa como acento. */
  color?: string;
  onClick: () => void;
}

/** Botón tipo "chip" coloreado por departamento — reemplaza el desplegable de filtros. */
function Chip({ label, active, color, onClick }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className="rounded-full border px-3.5 py-1.5 text-sm font-semibold whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      style={
        color
          ? active
            ? { backgroundColor: color, borderColor: color, color: "#fff" }
            : { borderColor: color, color }
          : active
            ? { backgroundColor: "var(--foreground)", borderColor: "var(--foreground)", color: "var(--background)" }
            : { borderColor: "var(--border)", color: "var(--foreground)" }
      }
    >
      {label}
    </button>
  );
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

/**
 * Filtros de categoría/género/carácter, como chips coloreados. El género solo se habilita
 * para Fútbol (FR-005) — la condición se lee de lib/categories.ts (Principio II); los
 * colores se leen de lib/theme.ts (Principio VI), ningún color se define aquí.
 */
export function Filters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const category = searchParams.get("category");
  const gender = searchParams.get("gender");
  const character = searchParams.get("character");

  const showGender = category && isCategory(category) && genderAppliesTo(category);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    const isSameValue = params.get(key) === value;

    if (value === ALL || isSameValue) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    if (key === "category" && value !== "Deportes - Fútbol") {
      params.delete("gender");
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-4">
      <FilterGroup title="Categoría">
        <Chip label="Todas" active={!category} onClick={() => updateParam("category", ALL)} />
        {CATEGORY_ORDER.map((cat) => (
          <Chip
            key={cat}
            label={categoryLabel(cat)}
            active={category === cat}
            color={CATEGORY_COLOR[cat]}
            onClick={() => updateParam("category", cat)}
          />
        ))}
      </FilterGroup>

      {showGender && (
        <FilterGroup title="Género">
          <Chip label="Todos" active={!gender} onClick={() => updateParam("gender", ALL)} />
          <Chip
            label="Masculino"
            active={gender === "masculino"}
            color={GENDER_COLOR.masculino}
            onClick={() => updateParam("gender", "masculino")}
          />
          <Chip
            label="Femenino"
            active={gender === "femenino"}
            color={GENDER_COLOR.femenino}
            onClick={() => updateParam("gender", "femenino")}
          />
        </FilterGroup>
      )}

      <FilterGroup title="Carácter">
        <Chip label="Todos" active={!character} onClick={() => updateParam("character", ALL)} />
        <Chip
          label="Obligatorio"
          active={character === "obligatorio"}
          color="var(--destructive)"
          onClick={() => updateParam("character", "obligatorio")}
        />
        <Chip
          label="Voluntario"
          active={character === "voluntario"}
          onClick={() => updateParam("character", "voluntario")}
        />
      </FilterGroup>
    </div>
  );
}
