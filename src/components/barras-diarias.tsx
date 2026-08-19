"use client";

import { BarChart, Bar, Cell, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { formatearCOP } from "@/lib/dinero";

type Dato = { dia: number; total: number };

export function BarrasDiarias({ datos }: { datos: Dato[] }) {
  const maximo = Math.max(...datos.map((d) => d.total), 0);

  return (
    <div className="h-44 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={datos} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <XAxis
            dataKey="dia"
            tickLine={false}
            axisLine={{ stroke: "#ddd9c9" }}
            interval={4}
            tick={{ fontSize: 11, fill: "#6d7166" }}
          />
          <Tooltip
            cursor={{ fill: "rgba(35, 39, 31, 0.05)" }}
            formatter={(valor) => [formatearCOP(Number(valor)), "Gasto"]}
            labelFormatter={(dia) => `Día ${dia}`}
          />
          <Bar dataKey="total" radius={[2, 2, 0, 0]}>
            {datos.map((d) => (
              <Cell
                key={d.dia}
                fill={d.total === maximo && maximo > 0 ? "#9a5b33" : "#2e6b4f"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
