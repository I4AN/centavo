"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { hashContrasena, verificarContrasena } from "@/lib/contrasena";
import { esquemaIngreso, esquemaRegistro } from "@/schemas";
import type { EstadoAccion } from "@/server/acciones";
import { abrirSesion, cerrarSesionActual } from "@/server/sesion";

export async function registrarse(
  _prev: EstadoAccion,
  formData: FormData
): Promise<EstadoAccion> {
  const datos = esquemaRegistro.safeParse({
    nombre: String(formData.get("nombre") ?? "").trim(),
    correo: String(formData.get("correo") ?? "").trim().toLowerCase(),
    contrasena: String(formData.get("contrasena") ?? ""),
  });
  if (!datos.success) {
    return { ok: false, error: datos.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const existe = await db.usuario.findUnique({ where: { correo: datos.data.correo } });
  if (existe) return { ok: false, error: "Ya existe una cuenta con ese correo" };

  const usuario = await db.usuario.create({
    data: {
      nombre: datos.data.nombre,
      correo: datos.data.correo,
      hashContrasena: hashContrasena(datos.data.contrasena),
    },
  });
  await abrirSesion(usuario.id);
  redirect("/");
}

export async function iniciarSesion(
  _prev: EstadoAccion,
  formData: FormData
): Promise<EstadoAccion> {
  const datos = esquemaIngreso.safeParse({
    correo: String(formData.get("correo") ?? "").trim().toLowerCase(),
    contrasena: String(formData.get("contrasena") ?? ""),
  });
  if (!datos.success) {
    return { ok: false, error: datos.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const usuario = await db.usuario.findUnique({ where: { correo: datos.data.correo } });
  // Mismo mensaje si el correo no existe o la contraseña falla:
  // no revelar cuáles correos tienen cuenta.
  if (!usuario || !verificarContrasena(datos.data.contrasena, usuario.hashContrasena)) {
    return { ok: false, error: "Correo o contraseña incorrectos" };
  }
  await abrirSesion(usuario.id);
  redirect("/");
}

export async function cerrarSesion(): Promise<void> {
  await cerrarSesionActual();
  redirect("/ingresar");
}
