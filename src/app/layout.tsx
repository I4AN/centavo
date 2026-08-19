import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Centavo — finanzas personales en COP",
  description:
    "Registro de ingresos, gastos y presupuestos mensuales. Cada centavo cuenta.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <div className="flex-1">{children}</div>
        <footer className="border-t border-linea py-6">
          <p className="mx-auto max-w-5xl px-4 text-xs text-tinta-suave">
            Hecho en Bogotá · el dinero se guarda en centavos, como debe ser.
          </p>
        </footer>
      </body>
    </html>
  );
}
