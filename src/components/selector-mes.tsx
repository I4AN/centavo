import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { mesAnterior, mesSiguiente, nombreMes } from "@/lib/fechas";

/**
 * Navegación de mes por searchParams (?mes=YYYY-MM).
 * Server component: son solo enlaces, sin JS en el cliente.
 */
export function SelectorMes({ mes }: { mes: string }) {
  return (
    <div className="flex items-center gap-2">
      <Link
        href={`?mes=${mesAnterior(mes)}`}
        aria-label="Mes anterior"
        className="tarjeta flex size-8 items-center justify-center text-tinta-suave hover:text-tinta"
      >
        <ChevronLeft className="size-4" />
      </Link>
      <h1 className="min-w-44 text-center text-lg font-bold capitalize tracking-tight">
        {nombreMes(mes)}
      </h1>
      <Link
        href={`?mes=${mesSiguiente(mes)}`}
        aria-label="Mes siguiente"
        className="tarjeta flex size-8 items-center justify-center text-tinta-suave hover:text-tinta"
      >
        <ChevronRight className="size-4" />
      </Link>
    </div>
  );
}
