import { redirect } from "next/navigation";
import { usuarioActual } from "@/server/sesion";

export default async function LayoutCuenta({ children }: { children: React.ReactNode }) {
  // Con sesión activa no hay nada que hacer aquí.
  if (await usuarioActual()) redirect("/");

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 px-4 py-16">
      <p className="text-center text-2xl font-bold tracking-tight">
        <span className="text-cobre">¢</span>entavo
      </p>
      {children}
    </main>
  );
}
