import { formatearCOP } from "@/lib/dinero";

/**
 * La firma visual de Centavo: el mes como una suma de libro contable,
 * con la raya simple antes del resultado y doble raya bajo el balance.
 */
export function SumaDelMes({
  ingresos,
  gastos,
  balance,
}: {
  ingresos: number;
  gastos: number;
  balance: number;
}) {
  return (
    <section aria-label="Suma del mes" className="tarjeta px-5 py-4 sm:px-6">
      <p className="eyebrow mb-3">Estado de cuenta</p>
      <dl className="num text-[15px] sm:text-base">
        <div className="flex items-baseline justify-between py-1">
          <dt className="font-sans text-sm text-tinta-suave">Ingresos</dt>
          <dd className="text-verde">{formatearCOP(ingresos)}</dd>
        </div>
        <div className="flex items-baseline justify-between py-1">
          <dt className="font-sans text-sm text-tinta-suave">Gastos</dt>
          <dd className="text-cobre">− {formatearCOP(gastos)}</dd>
        </div>
        <div className="mt-2 flex items-baseline justify-between border-t border-tinta pt-2">
          <dt className="font-sans text-sm font-semibold">Balance</dt>
          <dd
            className={`border-b-4 border-double pb-1 text-lg font-bold sm:text-xl ${
              balance < 0 ? "border-cobre text-cobre" : "border-verde text-tinta"
            }`}
          >
            {formatearCOP(balance)}
          </dd>
        </div>
      </dl>
    </section>
  );
}
