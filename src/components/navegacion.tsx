"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const RUTAS = [
  { href: "/", etiqueta: "Resumen" },
  { href: "/movimientos", etiqueta: "Movimientos" },
  { href: "/presupuestos", etiqueta: "Presupuestos" },
];

export function Navegacion() {
  const ruta = usePathname();
  const params = useSearchParams();
  const mes = params.get("mes");
  const query = mes ? `?mes=${mes}` : "";

  return (
    <nav aria-label="Principal" className="flex items-center gap-1 text-sm">
      {RUTAS.map(({ href, etiqueta }) => {
        const activa = ruta === href;
        return (
          <Link
            key={href}
            href={`${href}${query}`}
            aria-current={activa ? "page" : undefined}
            className={
              activa
                ? "rounded-full bg-verde-tenue px-3 py-1.5 font-semibold text-verde"
                : "rounded-full px-3 py-1.5 text-tinta-suave hover:text-tinta"
            }
          >
            {etiqueta}
          </Link>
        );
      })}
    </nav>
  );
}
