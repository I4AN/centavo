import "dotenv/config";
import { PrismaClient, TipoMovimiento } from "@prisma/client";

const db = new PrismaClient();

/** Pesos -> centavos. El seed habla en pesos para ser legible. */
const $ = (pesos: number) => pesos * 100;

// Taxonomía portada tal cual de MagnetWallet v1 (src/lib/categories.ts).
const GRUPOS_GASTO: Record<string, string[]> = {
  Vivienda: ["Alquiler", "Hipoteca", "Administracion", "Mantenimiento", "Reparaciones", "Muebles", "Seguro hogar"],
  Servicios: ["Electricidad", "Agua", "Gas", "Internet", "Telefono", "Television", "Basura"],
  Alimentacion: ["Supermercado", "Restaurante", "Cafe", "Delivery", "Panaderia", "Snacks"],
  Transporte: ["Combustible", "Transporte publico", "Taxi", "Parking", "Peajes", "Mantenimiento vehiculo", "Seguro vehiculo", "Repuestos"],
  Salud: ["Seguro medico", "Medicinas", "Consultas", "Dentista", "Optica", "Terapia"],
  Educacion: ["Cursos", "Libros", "Materiales", "Matricula"],
  Trabajo: ["Herramientas", "Oficina", "Coworking", "Capacitacion"],
  Familia: ["Guarderia", "Colegio", "Actividades hijos", "Pension"],
  Mascotas: ["Comida mascotas", "Veterinario", "Accesorios mascotas"],
  "Ropa y cuidado personal": ["Ropa", "Calzado", "Lavanderia", "Peluqueria", "Cosmeticos", "Cuidado personal"],
  Ocio: ["Entretenimiento", "Cine", "Streaming", "Videojuegos", "Deportes", "Eventos"],
  Viajes: ["Vuelos", "Alojamiento", "Transporte viaje", "Comidas viaje", "Tours"],
  Finanzas: ["Comisiones bancarias", "Intereses", "Tarjeta credito", "Prestamos", "Impuestos", "Multas"],
  Suscripciones: ["Gimnasio", "Software", "Apps", "Musica"],
  "Regalos y donaciones": ["Regalos", "Donaciones", "Celebraciones"],
  Otros: ["Hogar", "Limpieza", "Otros"],
};

const GRUPOS_INGRESO: Record<string, string[]> = {
  Ingresos: ["Salario", "Freelance", "Bonificaciones", "Rendimientos", "Otros ingresos"],
};

// [fecha, categoría, pesos, nota?]
type Fila = [string, string, number, string?];

const MOVIMIENTOS: Fila[] = [
  // ─── junio 2026 ───
  ["2026-06-03", "Alquiler", 1_300_000, "Arriendo apartaestudio"],
  ["2026-06-03", "Administracion", 185_000],
  ["2026-06-05", "Supermercado", 210_400, "Mercado D1"],
  ["2026-06-06", "Internet", 89_900, "Claro hogar"],
  ["2026-06-08", "Transporte publico", 50_000, "Recarga TransMilenio"],
  ["2026-06-09", "Restaurante", 18_000, "Corrientazo"],
  ["2026-06-10", "Streaming", 26_900, "Netflix"],
  ["2026-06-10", "Musica", 16_900, "Spotify"],
  ["2026-06-12", "Electricidad", 98_300],
  ["2026-06-12", "Agua", 61_200],
  ["2026-06-14", "Delivery", 42_500, "Rappi"],
  ["2026-06-15", "Cafe", 8_500, "Juan Valdez"],
  ["2026-06-18", "Supermercado", 187_900, "Éxito"],
  ["2026-06-20", "Videojuegos", 64_000, "Rebajas de Steam"],
  ["2026-06-21", "Gimnasio", 75_000],
  ["2026-06-24", "Regalos", 120_000, "Cumpleaños de mamá"],
  ["2026-06-26", "Taxi", 23_400],
  ["2026-06-28", "Panaderia", 12_300],
  ["2026-06-30", "Salario", 4_200_000, "Nómina junio"],
  // ─── julio 2026 ───
  ["2026-07-03", "Alquiler", 1_300_000, "Arriendo apartaestudio"],
  ["2026-07-03", "Administracion", 185_000],
  ["2026-07-04", "Supermercado", 224_800, "Mercado D1"],
  ["2026-07-06", "Internet", 89_900, "Claro hogar"],
  ["2026-07-07", "Transporte publico", 50_000, "Recarga TransMilenio"],
  ["2026-07-09", "Cine", 34_000, "Estreno con crispetas"],
  ["2026-07-10", "Streaming", 26_900, "Netflix"],
  ["2026-07-10", "Musica", 16_900, "Spotify"],
  ["2026-07-11", "Electricidad", 94_100],
  ["2026-07-13", "Medicinas", 36_500, "Droguería"],
  ["2026-07-15", "Freelance", 650_000, "Landing para un cliente"],
  ["2026-07-16", "Restaurante", 52_000, "Almuerzo de domingo"],
  ["2026-07-18", "Supermercado", 176_300, "Éxito"],
  ["2026-07-19", "Cafe", 9_200, "Juan Valdez"],
  ["2026-07-21", "Gimnasio", 75_000],
  ["2026-07-23", "Delivery", 38_900, "Rappi"],
  ["2026-07-25", "Ropa", 145_000, "Camisas"],
  ["2026-07-27", "Taxi", 19_800],
  ["2026-07-30", "Salario", 4_200_000, "Nómina julio"],
  // ─── agosto 2026 (mes en curso) ───
  ["2026-08-03", "Alquiler", 1_300_000, "Arriendo apartaestudio"],
  ["2026-08-03", "Administracion", 185_000],
  ["2026-08-04", "Supermercado", 231_600, "Mercado D1"],
  ["2026-08-06", "Internet", 89_900, "Claro hogar"],
  ["2026-08-07", "Transporte publico", 50_000, "Recarga TransMilenio"],
  ["2026-08-08", "Restaurante", 17_000, "Corrientazo"],
  ["2026-08-10", "Streaming", 26_900, "Netflix"],
  ["2026-08-10", "Musica", 16_900, "Spotify"],
  ["2026-08-11", "Electricidad", 101_700],
  ["2026-08-12", "Delivery", 55_400, "Rappi con antojo"],
  ["2026-08-13", "Cafe", 8_500, "Juan Valdez"],
  ["2026-08-14", "Salario", 2_100_000, "Quincena agosto"],
  ["2026-08-15", "Delivery", 47_200, "Rappi"],
  ["2026-08-15", "Supermercado", 168_900, "Éxito"],
  ["2026-08-16", "Cursos", 89_000, "Curso de arquitectura de software"],
  ["2026-08-17", "Freelance", 800_000, "Ajustes web para un cliente"],
  ["2026-08-18", "Restaurante", 21_500, "Almuerzo con el equipo"],
];

// Presupuestos del mes en curso: incluye uno excedido a propósito
// para que el estado de alerta se vea en la demo.
const PRESUPUESTOS_AGOSTO: [string, number][] = [
  ["Supermercado", 600_000],
  ["Restaurante", 250_000],
  ["Transporte publico", 120_000],
  ["Delivery", 90_000],
  ["Streaming", 45_000],
  ["Cafe", 60_000],
];

const SALARIOS: [string, number][] = [
  ["2026-06", 4_200_000],
  ["2026-07", 4_200_000],
  ["2026-08", 4_200_000],
];

async function main() {
  console.log("→ Limpiando tablas…");
  await db.movimiento.deleteMany();
  await db.presupuesto.deleteMany();
  await db.salarioMensual.deleteMany();
  await db.categoria.deleteMany();

  console.log("→ Creando categorías…");
  const categorias: { nombre: string; grupo: string; tipo: TipoMovimiento }[] = [];
  for (const [grupo, nombres] of Object.entries(GRUPOS_GASTO)) {
    for (const nombre of nombres) categorias.push({ nombre, grupo, tipo: "GASTO" });
  }
  for (const [grupo, nombres] of Object.entries(GRUPOS_INGRESO)) {
    for (const nombre of nombres) categorias.push({ nombre, grupo, tipo: "INGRESO" });
  }
  await db.categoria.createMany({ data: categorias });
  const todas = await db.categoria.findMany();
  const porNombre = new Map(todas.map((c) => [c.nombre, c]));

  console.log("→ Creando movimientos de ejemplo…");
  await db.movimiento.createMany({
    data: MOVIMIENTOS.map(([fecha, nombre, pesos, nota]) => {
      const categoria = porNombre.get(nombre);
      if (!categoria) throw new Error(`Categoría desconocida en el seed: ${nombre}`);
      return {
        tipo: categoria.tipo,
        montoCentavos: $(pesos),
        fecha: new Date(`${fecha}T00:00:00.000Z`),
        categoriaId: categoria.id,
        nota,
      };
    }),
  });

  console.log("→ Creando presupuestos y salarios…");
  await db.presupuesto.createMany({
    data: PRESUPUESTOS_AGOSTO.map(([nombre, pesos]) => ({
      mes: "2026-08",
      categoriaId: porNombre.get(nombre)!.id,
      montoCentavos: $(pesos),
    })),
  });
  await db.salarioMensual.createMany({
    data: SALARIOS.map(([mes, pesos]) => ({ mes, montoCentavos: $(pesos) })),
  });

  const total = await db.movimiento.count();
  console.log(`✓ Seed listo: ${todas.length} categorías, ${total} movimientos.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
