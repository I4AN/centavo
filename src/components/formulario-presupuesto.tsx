"use client";

import { useActionState, useEffect, useState } from "react";
import { BotonEnviar } from "@/components/boton-enviar";
import { formatearEntradaPesos } from "@/lib/dinero";
import { guardarPresupuesto, type EstadoAccion } from "@/server/acciones";

type Categoria = { id: string; nombre: string; grupo: string };

const ESTADO_INICIAL: EstadoAccion = { ok: true };

export function FormularioPresupuesto({
  mes,
  categorias,
}: {
  mes: string;
  categorias: Categoria[];
}) {
  const [estado, accion] = useActionState(guardarPresupuesto, ESTADO_INICIAL);
  const [monto, setMonto] = useState("");

  useEffect(() => {
    if (estado.ok && estado.ts) setMonto("");
  }, [estado.ok, estado.ts]);

  const grupos = [...new Set(categorias.map((c) => c.grupo))];

  return (
    <form action={accion} className="space-y-3">
      <input type="hidden" name="mes" value={mes} />
      <label className="block">
        <span className="eyebrow">Categoría de gasto</span>
        <select name="categoriaId" required defaultValue="" className="campo mt-1">
          <option value="" disabled>
            Elige una categoría
          </option>
          {grupos.map((grupo) => (
            <optgroup key={grupo} label={grupo}>
              {categorias
                .filter((c) => c.grupo === grupo)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="eyebrow">Tope mensual</span>
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
      {!estado.ok && estado.error && (
        <p role="alert" className="rounded-md bg-cobre-tenue px-3 py-2 text-sm text-alerta">
          {estado.error}
        </p>
      )}
      <BotonEnviar>Guardar presupuesto</BotonEnviar>
      <p className="text-xs text-tinta-suave">
        Si la categoría ya tiene presupuesto este mes, se actualiza el tope.
      </p>
    </form>
  );
}
