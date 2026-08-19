import { Trash2 } from "lucide-react";
import { eliminarMovimiento } from "@/server/acciones";
import { formatearCOP } from "@/lib/dinero";
import { fechaCorta } from "@/lib/fechas";

type Props = {
  id: string;
  fecha: Date;
  tipo: "INGRESO" | "GASTO";
  montoCentavos: number;
  nota: string | null;
  categoria: { nombre: string; grupo: string };
  conBorrar?: boolean;
};

export function FilaMovimiento({
  id,
  fecha,
  tipo,
  montoCentavos,
  nota,
  categoria,
  conBorrar = false,
}: Props) {
  const esGasto = tipo === "GASTO";
  return (
    <li className="flex items-center gap-3 border-b border-linea/70 py-2.5 last:border-b-0">
      <span className="num w-14 shrink-0 text-xs text-tinta-suave">
        {fechaCorta(fecha)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{categoria.nombre}</span>
        <span className="block truncate text-xs text-tinta-suave">
          {nota || categoria.grupo}
        </span>
      </span>
      <span className={`num text-sm ${esGasto ? "text-cobre" : "text-verde"}`}>
        {esGasto ? "−" : "+"} {formatearCOP(montoCentavos)}
      </span>
      {conBorrar && (
        <form action={eliminarMovimiento.bind(null, id)}>
          <button
            type="submit"
            aria-label={`Eliminar movimiento de ${categoria.nombre}`}
            className="rounded p-1.5 text-tinta-suave hover:bg-cobre-tenue hover:text-cobre"
          >
            <Trash2 className="size-4" />
          </button>
        </form>
      )}
    </li>
  );
}
