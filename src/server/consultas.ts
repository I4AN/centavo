import { db } from "@/lib/db";
import { diasDelMes, rangoMes } from "@/lib/fechas";

/** Totales del mes: ingresos, gastos y balance (centavos). */
export async function totalesDelMes(mes: string) {
  const fecha = rangoMes(mes);
  const [ingresos, gastos] = await Promise.all([
    db.movimiento.aggregate({
      where: { fecha, tipo: "INGRESO" },
      _sum: { montoCentavos: true },
    }),
    db.movimiento.aggregate({
      where: { fecha, tipo: "GASTO" },
      _sum: { montoCentavos: true },
    }),
  ]);
  const totalIngresos = ingresos._sum.montoCentavos ?? 0;
  const totalGastos = gastos._sum.montoCentavos ?? 0;
  return {
    ingresos: totalIngresos,
    gastos: totalGastos,
    balance: totalIngresos - totalGastos,
  };
}

/** Gasto agrupado por categoría, de mayor a menor. */
export async function gastoPorCategoria(mes: string) {
  const grupos = await db.movimiento.groupBy({
    by: ["categoriaId"],
    where: { fecha: rangoMes(mes), tipo: "GASTO" },
    _sum: { montoCentavos: true },
  });
  if (grupos.length === 0) return [];
  const categorias = await db.categoria.findMany({
    where: { id: { in: grupos.map((g) => g.categoriaId) } },
    select: { id: true, nombre: true },
  });
  const nombres = new Map(categorias.map((c) => [c.id, c.nombre]));
  return grupos
    .map((g) => ({
      categoriaId: g.categoriaId,
      nombre: nombres.get(g.categoriaId) ?? "Sin categoría",
      total: g._sum.montoCentavos ?? 0,
    }))
    .sort((a, b) => b.total - a.total);
}

/** Gasto por día del mes, con ceros en los días sin gasto (idea portada de la v1). */
export async function gastoDiario(mes: string) {
  const movimientos = await db.movimiento.findMany({
    where: { fecha: rangoMes(mes), tipo: "GASTO" },
    select: { fecha: true, montoCentavos: true },
  });
  const porDia = new Map<number, number>();
  for (const m of movimientos) {
    const dia = m.fecha.getUTCDate();
    porDia.set(dia, (porDia.get(dia) ?? 0) + m.montoCentavos);
  }
  const dias = diasDelMes(mes);
  return Array.from({ length: dias }, (_, i) => ({
    dia: i + 1,
    total: porDia.get(i + 1) ?? 0,
  }));
}

/** Movimientos del mes, más recientes primero. */
export async function movimientosDelMes(mes: string) {
  return db.movimiento.findMany({
    where: { fecha: rangoMes(mes) },
    include: { categoria: { select: { nombre: true, grupo: true } } },
    orderBy: [{ fecha: "desc" }, { createdAt: "desc" }],
  });
}

/** Presupuestos del mes junto al gasto real de cada categoría. */
export async function presupuestosDelMes(mes: string) {
  const [presupuestos, gastos] = await Promise.all([
    db.presupuesto.findMany({
      where: { mes },
      include: { categoria: { select: { nombre: true, grupo: true } } },
      orderBy: { categoria: { nombre: "asc" } },
    }),
    db.movimiento.groupBy({
      by: ["categoriaId"],
      where: { fecha: rangoMes(mes), tipo: "GASTO" },
      _sum: { montoCentavos: true },
    }),
  ]);
  const gastado = new Map(gastos.map((g) => [g.categoriaId, g._sum.montoCentavos ?? 0]));
  return presupuestos.map((p) => ({
    id: p.id,
    categoriaId: p.categoriaId,
    nombre: p.categoria.nombre,
    grupo: p.categoria.grupo,
    presupuesto: p.montoCentavos,
    gastado: gastado.get(p.categoriaId) ?? 0,
  }));
}

export async function salarioDelMes(mes: string) {
  const salario = await db.salarioMensual.findUnique({ where: { mes } });
  return salario?.montoCentavos ?? null;
}

export async function listarCategorias() {
  return db.categoria.findMany({
    orderBy: [{ tipo: "asc" }, { grupo: "asc" }, { nombre: "asc" }],
  });
}
