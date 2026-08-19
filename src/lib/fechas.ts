/**
 * Los meses viajan como "YYYY-MM" (igual que en la v1).
 * Las fechas de movimientos se guardan como DATE en UTC.
 */

export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function mesActual(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`;
}

export function esMesValido(mes: string | undefined): mes is string {
  return typeof mes === "string" && /^\d{4}-(0[1-9]|1[0-2])$/.test(mes);
}

export function mesSiguiente(mes: string): string {
  const [anio, m] = mes.split("-").map(Number);
  const d = new Date(Date.UTC(anio, m, 1));
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}`;
}

export function mesAnterior(mes: string): string {
  const [anio, m] = mes.split("-").map(Number);
  const d = new Date(Date.UTC(anio, m - 2, 1));
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}`;
}

/** Rango [inicio, fin) del mes para consultas Prisma. */
export function rangoMes(mes: string): { gte: Date; lt: Date } {
  return {
    gte: new Date(`${mes}-01T00:00:00.000Z`),
    lt: new Date(`${mesSiguiente(mes)}-01T00:00:00.000Z`),
  };
}

export function diasDelMes(mes: string): number {
  const [anio, m] = mes.split("-").map(Number);
  return new Date(Date.UTC(anio, m, 0)).getUTCDate();
}

export function fechaAIso(fecha: Date): string {
  return fecha.toISOString().slice(0, 10);
}

export function hoyIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

export function nombreMes(mes: string): string {
  const [anio, m] = mes.split("-").map(Number);
  return `${MESES[m - 1]} ${anio}`;
}

/** "2026-08-12" -> "12 ago" */
export function fechaCorta(fecha: Date): string {
  const dia = fecha.getUTCDate();
  const mes = MESES[fecha.getUTCMonth()].slice(0, 3);
  return `${dia} ${mes}`;
}
