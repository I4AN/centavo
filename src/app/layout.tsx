import type { Metadata } from "next";
import { Suspense } from "react";
import { Navegacion } from "@/components/navegacion";
import "./globals.css";

export const metadata: Metadata = {
  title: "Centavo — finanzas personales en COP",
  description:
    "Registro de ingresos, gastos y presupuestos mensuales. Cada centavo cuenta.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen font-sans antialiased">
        <header className="border-b border-linea bg-carta/80 backdrop-blur-sm">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
            <a href="/" className="text-xl font-bold tracking-tight">
              <span className="text-cobre">¢</span>entavo
            </a>
            <Suspense fallback={<div className="h-8" />}>
              <Navegacion />
            </Suspense>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-6 pb-16">{children}</main>
        <footer className="border-t border-linea py-6">
          <p className="mx-auto max-w-5xl px-4 text-xs text-tinta-suave">
            Hecho en Bogotá · el dinero se guarda en centavos, como debe ser.
          </p>
        </footer>
      </body>
    </html>
  );
}
