"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { BotonEnviar } from "@/components/boton-enviar";
import { formatearEntradaPesos } from "@/lib/dinero";
import { crearMovimiento, type EstadoAccion } from "@/server/acciones";

type Categoria = { id: string; nombre: string; grupo: string; tipo: "INGRESO" | "GASTO" };

const ESTADO_INICIAL: EstadoAccion = { ok: true };

export function FormularioMovimiento({
  categorias,
  fechaInicial,
}: {
  categorias: Categoria[];
  fechaInicial: string;
}) {
  const [estado, accion] = useActionState(crearMovimiento, ESTADO_INICIAL);
  const [tipo, setTipo] = useState<"GASTO" | "INGRESO">("GASTO");
  const [monto, setMonto] = useState("");
  const notaRef = useRef<HTMLInputElement>(null);

  // Al guardar con éxito, limpiar monto y nota (la fecha y el tipo se conservan).
  useEffect(() => {
    if (estado.ok && estado.ts) {
      setMonto("");
      if (notaRef.current) notaRef.current.value = "";
    }
  }, [estado.ok, estado.ts]);

  const visibles = categorias.filter((c) => c.tipo === tipo);
  const grupos = [...new Set(visibles.map((c) => c.grupo))];

  return (
    <form action={accion} className="space-y-3">
      <fieldset>
        <legend className="eyebrow mb-2">Tipo</legend>
        <div className="grid grid-cols-2 gap-1 rounded-lg border border-linea bg-papel p-1">
          {(["GASTO", "INGRESO"] as const).map((t) => (
            <label
              key={t}
              className={`cursor-pointer rounded-md py-1.5 text-center text-sm font-semibold transition-colors ${
                tipo === t
                  ? t === "GASTO"
                    ? "bg-cobre-tenue text-cobre"
                    : "bg-verde-tenue text-verde"
                  : "text-tinta-suave hover:text-tinta"
              }`}
            >
              <input
                type="radio"
                name="tipo"
                value={t}
                checked={tipo === t}
                onChange={() => setTipo(t)}
                className="sr-only"
              />
              {t === "GASTO" ? "Gasto" : "Ingreso"}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block">
        <span className="eyebrow">Monto</span>
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
            className="campo num pl-7 text-right text-base"
          />
        </div>
      </label>

      <label className="block">
        <span className="eyebrow">Fecha</span>
        <input
          type="date"
          name="fecha"
          defaultValue={fechaInicial}
          required
          className="campo num mt-1"
        />
      </label>

      <label className="block">
        <span className="eyebrow">Categoría</span>
        <select name="categoriaId" required defaultValue="" className="campo mt-1" key={tipo}>
          <option value="" disabled>
            Elige una categoría
          </option>
          {grupos.map((grupo) => (
            <optgroup key={grupo} label={grupo}>
              {visibles
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
        <span className="eyebrow">Nota (opcional)</span>
        <input
          ref={notaRef}
          name="nota"
          maxLength={200}
          placeholder="Mercado de la semana, corrientazo…"
          className="campo mt-1"
        />
      </label>

      {!estado.ok && estado.error && (
        <p role="alert" className="rounded-md bg-cobre-tenue px-3 py-2 text-sm text-alerta">
          {estado.error}
        </p>
      )}

      <BotonEnviar>Registrar movimiento</BotonEnviar>
    </form>
  );
}
