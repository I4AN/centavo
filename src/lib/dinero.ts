/**
 * Todo el dinero vive como Int en centavos de COP.
 * La UI habla en pesos; la base de datos, en centavos.
 */

const formatoCOP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

/** 450000000 centavos -> "$ 4.500.000" */
export function formatearCOP(centavos: number): string {
  return formatoCOP.format(Math.round(centavos / 100));
}

/** "4.500.000" | "4500000" -> 450000000 centavos. null si no es válido. */
export function pesosACentavos(entrada: string): number | null {
  const digitos = entrada.replace(/[^\d]/g, "");
  if (!digitos) return null;
  const pesos = Number(digitos);
  if (!Number.isSafeInteger(pesos * 100)) return null;
  return pesos * 100;
}

/** Formatea el input mientras se escribe: "4500000" -> "4.500.000" */
export function formatearEntradaPesos(entrada: string): string {
  const digitos = entrada.replace(/[^\d]/g, "").slice(0, 12);
  if (!digitos) return "";
  return new Intl.NumberFormat("es-CO").format(Number(digitos));
}
