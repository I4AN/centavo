import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

/**
 * Hashing con scrypt (incluido en Node): sin dependencias extra.
 * Se guarda como "sal:hash" en hex; la sal es única por usuario.
 */

export function hashContrasena(contrasena: string): string {
  const sal = randomBytes(16).toString("hex");
  const hash = scryptSync(contrasena, sal, 64).toString("hex");
  return `${sal}:${hash}`;
}

export function verificarContrasena(contrasena: string, guardado: string): boolean {
  const [sal, hash] = guardado.split(":");
  if (!sal || !hash) return false;
  const calculado = scryptSync(contrasena, sal, 64);
  const esperado = Buffer.from(hash, "hex");
  return esperado.length === calculado.length && timingSafeEqual(calculado, esperado);
}
