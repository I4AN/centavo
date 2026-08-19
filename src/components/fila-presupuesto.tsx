import { Trash2 } from "lucide-react";
import { eliminarPresupuesto } from "@/server/acciones";
import { formatearCOP } from "@/lib/dinero";

type Props = {
  id: string;
  nombre: string;
  grupo: string;
  presupuesto: number;
  gastado: number;
};

export function FilaPresupuesto({ id, nombre, grupo, presupuesto, gastado }: Props) {
  const porcentaje = presupuesto > 0 ? (gastado / presupuesto) * 100 : 0;
  const excedido = gastado > presupuesto;
  const disponible = presupuesto - gastado;

  return (
    <li className="border-b border-linea/70 py-3 last:border-b-0">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{nombre}</p>
          <p className="text-xs text-tinta-suave">{grupo}</p>
        </div>
        <div className="flex items-center gap-2">
          <p className="num text-sm">
            <span className={excedido ? "font-semibold text-alerta" : "text-tinta"}>
              {formatearCOP(gastado)}
            </span>
            <span className="text-tinta-suave"> / {formatearCOP(presupuesto)}</span>
          </p>
          <form action={eliminarPresupuesto.bind(null, id)}>
            <button
              type="submit"
              aria-label={`Eliminar presupuesto de ${nombre}`}
              className="rounded p-1.5 text-tinta-suave hover:bg-cobre-tenue hover:text-cobre"
            >
              <Trash2 className="size-4" />
            </button>
          </form>
        </div>
      </div>
      <div
        role="progressbar"
        aria-valuenow={Math.round(Math.min(porcentaje, 100))}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Uso del presupuesto de ${nombre}`}
        className="mt-2 h-2 overflow-hidden rounded-full bg-papel"
      >
        <div
          className={`h-full rounded-full ${excedido ? "bg-alerta" : "bg-verde"}`}
          style={{ width: `${Math.min(porcentaje, 100)}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-tinta-suave">
        {excedido
          ? `Excedido por ${formatearCOP(gastado - presupuesto)}`
          : `Disponible: ${formatearCOP(disponible)} (${Math.round(porcentaje)}% usado)`}
      </p>
    </li>
  );
}
