import { EstadoVacio } from "@/components/estado-vacio";
import { FilaPresupuesto } from "@/components/fila-presupuesto";
import { FormularioPresupuesto } from "@/components/formulario-presupuesto";
import { FormularioSalario } from "@/components/formulario-salario";
import { SelectorMes } from "@/components/selector-mes";
import { formatearCOP } from "@/lib/dinero";
import { esMesValido, mesActual } from "@/lib/fechas";
import { listarCategorias, presupuestosDelMes, salarioDelMes } from "@/server/consultas";

export const dynamic = "force-dynamic";

export default async function PaginaPresupuestos({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string }>;
}) {
  const params = await searchParams;
  const mes = esMesValido(params.mes) ? params.mes : mesActual();

  const [presupuestos, salario, categorias] = await Promise.all([
    presupuestosDelMes(mes),
    salarioDelMes(mes),
    listarCategorias(),
  ]);

  const totalPresupuestado = presupuestos.reduce((s, p) => s + p.presupuesto, 0);
  const totalGastado = presupuestos.reduce((s, p) => s + p.gastado, 0);
  const categoriasGasto = categorias
    .filter((c) => c.tipo === "GASTO")
    .map(({ id, nombre, grupo }) => ({ id, nombre, grupo }));

  return (
    <div className="space-y-5">
      <SelectorMes mes={mes} />

      <section className="tarjeta px-5 py-4">
        <FormularioSalario
          mes={mes}
          salarioActualPesos={
            salario ? new Intl.NumberFormat("es-CO").format(Math.round(salario / 100)) : ""
          }
        />
        {salario !== null && totalPresupuestado > 0 && (
          <p className="mt-3 border-t border-linea/70 pt-3 text-sm text-tinta-suave">
            Lo presupuestado equivale al{" "}
            <span className="num font-semibold text-tinta">
              {Math.round((totalPresupuestado / salario) * 100)}%
            </span>{" "}
            de tu salario del mes.
          </p>
        )}
      </section>

      <div className="grid items-start gap-5 lg:grid-cols-[340px_1fr]">
        <section className="tarjeta px-5 py-4 lg:sticky lg:top-4">
          <p className="eyebrow mb-3">Nuevo presupuesto</p>
          <FormularioPresupuesto mes={mes} categorias={categoriasGasto} />
        </section>

        <section className="tarjeta px-5 py-4">
          <div className="mb-2 flex items-baseline justify-between gap-3">
            <p className="eyebrow">Presupuestos del mes</p>
            {presupuestos.length > 0 && (
              <p className="num text-sm text-tinta-suave">
                {formatearCOP(totalGastado)} / {formatearCOP(totalPresupuestado)}
              </p>
            )}
          </div>
          {presupuestos.length > 0 ? (
            <ul>
              {presupuestos.map((p) => (
                <FilaPresupuesto key={p.id} {...p} />
              ))}
            </ul>
          ) : (
            <EstadoVacio
              titulo="Sin presupuestos este mes"
              detalle="Define un tope por categoría y Centavo te muestra cuánto llevas y cuánto queda."
            />
          )}
        </section>
      </div>
    </div>
  );
}
