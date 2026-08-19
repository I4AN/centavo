import Link from "next/link";
import type { Metadata } from "next";
import { FormularioRegistro } from "@/components/formulario-registro";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Crear cuenta — Centavo" };

export default function PaginaRegistrarse() {
  return (
    <section className="tarjeta px-5 py-6">
      <h1 className="mb-1 text-lg font-bold">Crear cuenta</h1>
      <p className="mb-4 text-sm text-tinta-suave">
        Empiezas de cero: sin datos de ejemplo, cada centavo será tuyo.
      </p>
      <FormularioRegistro />
      <p className="mt-4 border-t border-linea/70 pt-4 text-sm text-tinta-suave">
        ¿Ya tienes cuenta?{" "}
        <Link href="/ingresar" className="font-medium text-verde hover:underline">
          Ingresa
        </Link>
      </p>
    </section>
  );
}
