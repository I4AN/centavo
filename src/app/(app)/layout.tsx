import { Suspense } from "react";
import { LogOut } from "lucide-react";
import { Navegacion } from "@/components/navegacion";
import { cerrarSesion } from "@/server/acciones-cuenta";
import { requerirUsuario } from "@/server/sesion";

export default async function LayoutApp({ children }: { children: React.ReactNode }) {
  const usuario = await requerirUsuario();

  return (
    <>
      <header className="border-b border-linea bg-carta/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3">
          <a href="/" className="text-xl font-bold tracking-tight">
            <span className="text-cobre">¢</span>entavo
          </a>
          <Suspense fallback={<div className="h-8" />}>
            <Navegacion />
          </Suspense>
          <div className="flex items-center gap-2 text-sm">
            <span title={usuario.correo} className="max-w-32 truncate text-tinta-suave">
              {usuario.nombre}
            </span>
            <form action={cerrarSesion}>
              <button
                type="submit"
                title="Cerrar sesión"
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-tinta-suave hover:text-tinta"
              >
                <LogOut size={14} aria-hidden />
                Salir
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6 pb-16">{children}</main>
    </>
  );
}
