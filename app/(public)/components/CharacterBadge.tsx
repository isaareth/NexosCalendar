import { AlertTriangle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EventCharacter } from "@/lib/types";

/**
 * Insignia obligatorio/voluntario (FR-007). El color nunca es la única señal: siempre va
 * con ícono + texto (FR-019).
 */
export function CharacterBadge({ character }: { character: EventCharacter }) {
  const isObligatorio = character === "obligatorio";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        isObligatorio
          ? "bg-destructive text-white"
          : "bg-secondary text-secondary-foreground",
      )}
    >
      {isObligatorio ? (
        <AlertTriangle className="size-3.5" aria-hidden />
      ) : (
        <Sparkles className="size-3.5" aria-hidden />
      )}
      {isObligatorio ? "Obligatorio" : "Voluntario"}
    </span>
  );
}
