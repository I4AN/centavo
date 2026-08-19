"use client";

import { useActionState, useState } from "react";
import { BotonEnviar } from "@/components/boton-enviar";
import { formatearEntradaPesos } from "@/lib/dinero";
import { guardarSalario, type EstadoAccion } from "@/server/acciones";

const ESTADO_INICIAL: EstadoAccion = { ok: true };

export function FormularioSalario({
  mes,
  salarioActualPesos,
}: {
  mes: string;
  salarioActualPesos: string;
}) {
  const [estado, accion] = useActionState(guardarSalario, ESTADO_INICIAL);
  const [monto, setMonto] = useState(salarioActualPesos);

  return (
    <form action={accion} className="flex flex-wrap items-end gap-2">
      <input type="hidden" name="mes" value={mes} />
      <label className="min-w-40 flex-1">
        <span className="eyebrow">Salario del mes</span>
        <div className="relative mt-1">
          <span className="num pointer-events-none absolute inset-y-0 left-3 flex items-center text-tinta-suave">
            $
          </span>
          <input
            name="monto"
            value={monto}
            onChange={(e) => setMonto(formatearEntradaPesos(e.target.value))}
            inputMode="numeric"
            autoComplete="off"
            placeholder="0"
            required
            className="campo num pl-7 text-right"
          />
        </div>
      </label>
      <div className="w-32">
        <BotonEnviar>Guardar</BotonEnviar>
      </div>
      {!estado.ok && estado.error && (
        <p role="alert" className="w-full text-sm text-alerta">
          {estado.error}
        </p>
      )}
    </form>
  );
}
