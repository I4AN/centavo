import "dotenv/config";
import { PrismaClient, TipoMovimiento } from "@prisma/client";

const db = new PrismaClient();

// Taxonomía portada tal cual de MagnetWallet v1 (src/lib/categories.ts).
// El seed solo carga categorías: cada usuario empieza con sus datos en cero.
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

async function main() {
  console.log("→ Creando categorías…");
  const categorias: { nombre: string; grupo: string; tipo: TipoMovimiento }[] = [];
  for (const [grupo, nombres] of Object.entries(GRUPOS_GASTO)) {
    for (const nombre of nombres) categorias.push({ nombre, grupo, tipo: "GASTO" });
  }
  for (const [grupo, nombres] of Object.entries(GRUPOS_INGRESO)) {
    for (const nombre of nombres) categorias.push({ nombre, grupo, tipo: "INGRESO" });
  }
  await db.categoria.createMany({ data: categorias, skipDuplicates: true });

  const total = await db.categoria.count();
  console.log(`✓ Seed listo: ${total} categorías. Sin datos de ejemplo: regístrate y empieza de cero.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
