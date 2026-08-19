import { randomBytes } from "node:crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

/**
 * Sesiones propias en Postgres: un token opaco en cookie httpOnly
 * apunta a una fila en Sesion. Sin JWT ni proveedor externo.
 */

const NOMBRE_COOKIE = "centavo_sesion";
const DURACION_DIAS = 30;

export type UsuarioSesion = { id: string; nombre: string; correo: string };

/** Usuario de la sesión actual o null. Cacheado por request. */
export const usuarioActual = cache(async (): Promise<UsuarioSesion | null> => {
  const jar = await cookies();
  const token = jar.get(NOMBRE_COOKIE)?.value;
  if (!token) return null;
  const sesion = await db.sesion.findUnique({
    where: { token },
    include: { usuario: { select: { id: true, nombre: true, correo: true } } },
  });
  if (!sesion || sesion.expiraEn < new Date()) return null;
  return sesion.usuario;
});

/** Exige sesión activa; si no la hay, manda a /ingresar. */
export async function requerirUsuario(): Promise<UsuarioSesion> {
  const usuario = await usuarioActual();
  if (!usuario) redirect("/ingresar");
  return usuario;
}

/** Crea la sesión y setea la cookie. Solo desde Server Actions. */
export async function abrirSesion(usuarioId: string): Promise<void> {
  const token = randomBytes(32).toString("hex");
  const expiraEn = new Date(Date.now() + DURACION_DIAS * 24 * 60 * 60 * 1000);
  await db.sesion.create({ data: { token, usuarioId, expiraEn } });
  const jar = await cookies();
  jar.set(NOMBRE_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiraEn,
    path: "/",
  });
}

/** Borra la sesión de la base y la cookie. Solo desde Server Actions. */
export async function cerrarSesionActual(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(NOMBRE_COOKIE)?.value;
  if (token) await db.sesion.deleteMany({ where: { token } });
  jar.delete(NOMBRE_COOKIE);
}
