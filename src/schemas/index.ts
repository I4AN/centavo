import { z } from "zod";

export const esquemaMovimiento = z.object({
  tipo: z.enum(["INGRESO", "GASTO"]),
  montoCentavos: z
    .number()
    .int("El monto debe ser un entero en centavos")
    .positive("El monto debe ser mayor a cero")
    .max(9_999_999_999_99, "Monto fuera de rango"),
  fecha: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida (se espera YYYY-MM-DD)"),
  categoriaId: z.string().min(1, "Elige una categoría"),
  nota: z.string().trim().max(200, "La nota supera 200 caracteres").optional(),
});

export const esquemaPresupuesto = z.object({
  mes: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Mes inválido"),
  categoriaId: z.string().min(1, "Elige una categoría"),
  montoCentavos: z.number().int().positive("El presupuesto debe ser mayor a cero"),
});

export const esquemaRegistro = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, "El nombre necesita al menos 2 caracteres")
    .max(60, "El nombre supera 60 caracteres"),
  correo: z.email("Correo inválido").max(254, "Correo demasiado largo"),
  contrasena: z
    .string()
    .min(8, "La contraseña necesita al menos 8 caracteres")
    .max(100, "La contraseña supera 100 caracteres"),
});

export const esquemaIngreso = z.object({
  correo: z.email("Correo inválido"),
  contrasena: z.string().min(1, "Escribe tu contraseña"),
});

export const esquemaSalario = z.object({
  mes: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Mes inválido"),
  montoCentavos: z.number().int().min(0, "El salario no puede ser negativo"),
});

export type EntradaMovimiento = z.infer<typeof esquemaMovimiento>;
