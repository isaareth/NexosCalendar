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
    <div className="flex flex-wrap items-center gap-3">
      <Select value={category ?? ALL} onValueChange={(v) => updateParam("category", v as string)}>
        <SelectTrigger aria-label="Filtrar por categoría">
          <SelectValue placeholder="Categoría" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Todas las categorías</SelectItem>
          {CATEGORY_ORDER.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {categoryLabel(cat)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {showGender && (
        <Select value={gender ?? ALL} onValueChange={(v) => updateParam("gender", v as string)}>
          <SelectTrigger aria-label="Filtrar por género">
            <SelectValue placeholder="Género" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todos</SelectItem>
            <SelectItem value="masculino">Masculino</SelectItem>
            <SelectItem value="femenino">Femenino</SelectItem>
          </SelectContent>
        </Select>
      )}

      <Select value={character ?? ALL} onValueChange={(v) => updateParam("character", v as string)}>
        <SelectTrigger aria-label="Filtrar por carácter">
          <SelectValue placeholder="Carácter" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Obligatorio y voluntario</SelectItem>
          <SelectItem value="obligatorio">Obligatorio</SelectItem>
          <SelectItem value="voluntario">Voluntario</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
