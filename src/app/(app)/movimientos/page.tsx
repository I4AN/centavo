import { EstadoVacio } from "@/components/estado-vacio";
import { FilaMovimiento } from "@/components/fila-movimiento";
import { FormularioMovimiento } from "@/components/formulario-movimiento";
import { SelectorMes } from "@/components/selector-mes";
import { esMesValido, hoyIso, mesActual } from "@/lib/fechas";
import { listarCategorias, movimientosDelMes } from "@/server/consultas";
import { requerirUsuario } from "@/server/sesion";

export const dynamic = "force-dynamic";

export default async function PaginaMovimientos({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string }>;
}) {
  const usuario = await requerirUsuario();
  const params = await searchParams;
  const mes = esMesValido(params.mes) ? params.mes : mesActual();

  const [movimientos, categorias] = await Promise.all([
    movimientosDelMes(usuario.id, mes),
    listarCategorias(),
  ]);

  const hoy = hoyIso();
  const fechaInicial = hoy.startsWith(mes) ? hoy : `${mes}-01`;

  return (
    <div className="space-y-5">
      <SelectorMes mes={mes} />

      <div className="grid items-start gap-5 lg:grid-cols-[340px_1fr]">
        <section className="tarjeta px-5 py-4 lg:sticky lg:top-4">
          <p className="eyebrow mb-3">Nuevo movimiento</p>
          <FormularioMovimiento
            categorias={categorias.map(({ id, nombre, grupo, tipo }) => ({
              id,
              nombre,
              grupo,
              tipo,
            }))}
            fechaInicial={fechaInicial}
          />
        </section>

        <section className="tarjeta px-5 py-4">
          <p className="eyebrow mb-2">
            {movimientos.length === 1
              ? "1 movimiento este mes"
              : `${movimientos.length} movimientos este mes`}
          </p>
          {movimientos.length > 0 ? (
            <ul>
              {movimientos.map((m) => (
                <FilaMovimiento key={m.id} {...m} conBorrar />
              ))}
            </ul>
          ) : (
            <EstadoVacio
              titulo="Nada registrado aún"
              detalle="Usa el formulario para anotar tu primer ingreso o gasto del mes."
            />
          )}
        </section>
      </div>
    </div>
  );
}
