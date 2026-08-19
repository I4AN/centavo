import Link from "next/link";
import { BarrasDiarias } from "@/components/barras-diarias";
import { DonaCategorias } from "@/components/dona-categorias";
import { EstadoVacio } from "@/components/estado-vacio";
import { FilaMovimiento } from "@/components/fila-movimiento";
import { SelectorMes } from "@/components/selector-mes";
import { SumaDelMes } from "@/components/suma-del-mes";
import { esMesValido, mesActual } from "@/lib/fechas";
import {
  gastoDiario,
  gastoPorCategoria,
  movimientosDelMes,
  totalesDelMes,
} from "@/server/consultas";
import { requerirUsuario } from "@/server/sesion";

export const dynamic = "force-dynamic";

export default async function PaginaResumen({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string }>;
}) {
  const usuario = await requerirUsuario();
  const params = await searchParams;
  const mes = esMesValido(params.mes) ? params.mes : mesActual();

  const [totales, porCategoria, diario, movimientos] = await Promise.all([
    totalesDelMes(usuario.id, mes),
    gastoPorCategoria(usuario.id, mes),
    gastoDiario(usuario.id, mes),
    movimientosDelMes(usuario.id, mes),
  ]);
  const recientes = movimientos.slice(0, 7);
  const hayDatos = movimientos.length > 0;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SelectorMes mes={mes} />
        <Link href={`/movimientos?mes=${mes}`} className="boton">
          Registrar movimiento
        </Link>
      </div>

      <SumaDelMes {...totales} />

      {!hayDatos ? (
        <EstadoVacio
          titulo="Aún no hay movimientos este mes"
          detalle="Registra el primero y el resumen se arma solo: gasto por categoría, ritmo diario y balance."
          accion={{ href: `/movimientos?mes=${mes}`, etiqueta: "Registrar el primero" }}
        />
      ) : (
        <>
          <div className="grid gap-5 lg:grid-cols-2">
            <section className="tarjeta px-5 py-4">
              <p className="eyebrow mb-4">Gasto por categoría</p>
              {porCategoria.length > 0 ? (
                <DonaCategorias datos={porCategoria} />
              ) : (
                <p className="py-8 text-center text-sm text-tinta-suave">
                  Este mes no registra gastos. Buen dato.
                </p>
              )}
            </section>
            <section className="tarjeta px-5 py-4">
              <p className="eyebrow mb-4">Ritmo diario de gasto</p>
              <BarrasDiarias datos={diario} />
              <p className="mt-2 text-xs text-tinta-suave">
                La barra cobre marca el día de mayor gasto.
              </p>
            </section>
          </div>

          <section className="tarjeta px-5 py-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="eyebrow">Últimos movimientos</p>
              <Link
                href={`/movimientos?mes=${mes}`}
                className="text-sm font-medium text-verde hover:underline"
              >
                Ver todos
              </Link>
            </div>
            <ul>
              {recientes.map((m) => (
                <FilaMovimiento key={m.id} {...m} />
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
