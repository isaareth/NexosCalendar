"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORY_ORDER, categoryLabel, genderAppliesTo, isCategory } from "@/lib/categories";

const ALL = "__all__";

const CATEGORY_ITEMS: Record<string, string> = {
  [ALL]: "Todas las categorías",
  ...Object.fromEntries(CATEGORY_ORDER.map((cat) => [cat, categoryLabel(cat)])),
};

const GENDER_ITEMS: Record<string, string> = {
  [ALL]: "Todos",
  masculino: "Masculino",
  femenino: "Femenino",
};

const CHARACTER_ITEMS: Record<string, string> = {
  [ALL]: "Obligatorio y voluntario",
  obligatorio: "Obligatorio",
  voluntario: "Voluntario",
};

/**
 * Filtros de categoría/género/carácter. El género solo se habilita para Fútbol (FR-005) —
 * la condición se lee de lib/categories.ts, nunca se redefine aquí (Principio II).
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
    if (value === ALL) {
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
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Categoría
        </span>
        <Select
          items={CATEGORY_ITEMS}
          value={category ?? ALL}
          onValueChange={(v) => updateParam("category", v as string)}
        >
          <SelectTrigger aria-label="Filtrar por categoría" className="min-w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(CATEGORY_ITEMS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {showGender && (
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Género
          </span>
          <Select
            items={GENDER_ITEMS}
            value={gender ?? ALL}
            onValueChange={(v) => updateParam("gender", v as string)}
          >
            <SelectTrigger aria-label="Filtrar por género" className="min-w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(GENDER_ITEMS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Carácter
        </span>
        <Select
          items={CHARACTER_ITEMS}
          value={character ?? ALL}
          onValueChange={(v) => updateParam("character", v as string)}
        >
          <SelectTrigger aria-label="Filtrar por carácter" className="min-w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(CHARACTER_ITEMS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
