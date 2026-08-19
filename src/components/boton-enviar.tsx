"use client";

import { useFormStatus } from "react-dom";

export function BotonEnviar({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="boton w-full justify-center">
      {pending ? "Guardando…" : children}
    </button>
  );
}
