"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { formatearCOP } from "@/lib/dinero";

const COLORES = [
  "#2e6b4f", "#4e8a6b", "#7fac93", "#9a5b33", "#be8256", "#c9a227", "#8b8f80",
];

type Dato = { nombre: string; total: number };

export function DonaCategorias({ datos }: { datos: Dato[] }) {
  const top = datos.slice(0, 6);
  const resto = datos.slice(6).reduce((suma, d) => suma + d.total, 0);
  const series = resto > 0 ? [...top, { nombre: "Otras", total: resto }] : top;
  const totalGastos = datos.reduce((suma, d) => suma + d.total, 0);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative mx-auto h-48 w-48 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={series}
              dataKey="total"
              nameKey="nombre"
              innerRadius={58}
              outerRadius={86}
              paddingAngle={2}
              strokeWidth={0}
            >
              {series.map((_, i) => (
                <Cell key={i} fill={COLORES[i % COLORES.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(valor) => formatearCOP(Number(valor))} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="eyebrow">Gastado</span>
          <span className="num text-sm font-bold">{formatearCOP(totalGastos)}</span>
        </div>
      </div>
      <ul className="w-full space-y-1.5 text-sm">
        {series.map((d, i) => (
          <li key={d.nombre} className="flex items-center justify-between gap-3">
            <span className="flex min-w-0 items-center gap-2">
              <span
                aria-hidden
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: COLORES[i % COLORES.length] }}
              />
              <span className="truncate">{d.nombre}</span>
            </span>
            <span className="num text-tinta-suave">{formatearCOP(d.total)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
