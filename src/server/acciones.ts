"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { pesosACentavos } from "@/lib/dinero";
import { esquemaMovimiento, esquemaPresupuesto, esquemaSalario } from "@/schemas";

export type EstadoAccion = { ok: boolean; error?: string; ts?: number };

function revalidarTodo() {
  revalidatePath("/");
  revalidatePath("/movimientos");
  revalidatePath("/presupuestos");
}

export async function crearMovimiento(
  _prev: EstadoAccion,
  formData: FormData
): Promise<EstadoAccion> {
  const montoCentavos = pesosACentavos(String(formData.get("monto") ?? ""));
  const datos = esquemaMovimiento.safeParse({
    tipo: formData.get("tipo"),
    montoCentavos: montoCentavos ?? -1,
    fecha: formData.get("fecha"),
    categoriaId: formData.get("categoriaId"),
    nota: String(formData.get("nota") ?? "").trim() || undefined,
  });
  if (!datos.success) {
    return { ok: false, error: datos.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const categoria = await db.categoria.findUnique({ where: { id: datos.data.categoriaId } });
  if (!categoria) return { ok: false, error: "La categoría no existe" };
  if (categoria.tipo !== datos.data.tipo) {
    return { ok: false, error: "La categoría no corresponde al tipo de movimiento" };
  }
  await db.movimiento.create({
    data: {
      tipo: datos.data.tipo,
      montoCentavos: datos.data.montoCentavos,
      fecha: new Date(`${datos.data.fecha}T00:00:00.000Z`),
      categoriaId: datos.data.categoriaId,
      nota: datos.data.nota,
    },
  });
  revalidarTodo();
  return { ok: true, ts: Date.now() };
}

export async function eliminarMovimiento(id: string): Promise<void> {
  await db.movimiento.delete({ where: { id } }).catch(() => null);
  revalidarTodo();
}

export async function guardarPresupuesto(
  _prev: EstadoAccion,
  formData: FormData
): Promise<EstadoAccion> {
  const montoCentavos = pesosACentavos(String(formData.get("monto") ?? ""));
  const datos = esquemaPresupuesto.safeParse({
    mes: formData.get("mes"),
    categoriaId: formData.get("categoriaId"),
    montoCentavos: montoCentavos ?? -1,
  });
  if (!datos.success) {
    return { ok: false, error: datos.error.issues[0]?.message ?? "Datos inválidos" };
  }
  await db.presupuesto.upsert({
    where: { categoriaId_mes: { categoriaId: datos.data.categoriaId, mes: datos.data.mes } },
    create: datos.data,
    update: { montoCentavos: datos.data.montoCentavos },
  });
  revalidarTodo();
  return { ok: true, ts: Date.now() };
}

export async function eliminarPresupuesto(id: string): Promise<void> {
  await db.presupuesto.delete({ where: { id } }).catch(() => null);
  revalidarTodo();
}

export async function guardarSalario(
  _prev: EstadoAccion,
  formData: FormData
): Promise<EstadoAccion> {
  const montoCentavos = pesosACentavos(String(formData.get("monto") ?? ""));
  const datos = esquemaSalario.safeParse({
    mes: formData.get("mes"),
    montoCentavos: montoCentavos ?? -1,
  });
  if (!datos.success) {
    return { ok: false, error: datos.error.issues[0]?.message ?? "Datos inválidos" };
  }
  await db.salarioMensual.upsert({
    where: { mes: datos.data.mes },
    create: datos.data,
    update: { montoCentavos: datos.data.montoCentavos },
  });
  revalidarTodo();
  return { ok: true, ts: Date.now() };
}
