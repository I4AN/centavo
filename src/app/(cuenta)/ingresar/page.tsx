import Link from "next/link";
import type { Metadata } from "next";
import { FormularioIngreso } from "@/components/formulario-ingreso";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Ingresar — Centavo" };

export default function PaginaIngresar() {
  return (
    <section className="tarjeta px-5 py-6">
      <h1 className="mb-1 text-lg font-bold">Ingresar</h1>
      <p className="mb-4 text-sm text-tinta-suave">
        Tus cuentas te esperan donde las dejaste.
      </p>
      <FormularioIngreso />
      <p className="mt-4 border-t border-linea/70 pt-4 text-sm text-tinta-suave">
        ¿Primera vez por aquí?{" "}
        <Link href="/registrarse" className="font-medium text-verde hover:underline">
          Crea tu cuenta
        </Link>
      </p>
    </section>
  );
}
