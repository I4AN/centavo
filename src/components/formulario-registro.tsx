"use client";

import { useActionState } from "react";
import { BotonEnviar } from "@/components/boton-enviar";
import type { EstadoAccion } from "@/server/acciones";
import { registrarse } from "@/server/acciones-cuenta";

const ESTADO_INICIAL: EstadoAccion = { ok: true };

export function FormularioRegistro() {
  const [estado, accion] = useActionState(registrarse, ESTADO_INICIAL);

  return (
    <form action={accion} className="space-y-3">
      <label className="block">
        <span className="eyebrow">Nombre</span>
        <input
          name="nombre"
          autoComplete="name"
          required
          minLength={2}
          maxLength={60}
          placeholder="¿Cómo te llamas?"
          className="campo mt-1"
        />
      </label>
      <label className="block">
        <span className="eyebrow">Correo</span>
        <input
          name="correo"
          type="email"
          autoComplete="email"
          required
          placeholder="tu@correo.com"
          className="campo mt-1"
        />
      </label>
      <label className="block">
        <span className="eyebrow">Contraseña</span>
        <input
          name="contrasena"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="Mínimo 8 caracteres"
          className="campo mt-1"
        />
      </label>
      {!estado.ok && estado.error && (
        <p role="alert" className="text-sm text-alerta">
          {estado.error}
        </p>
      )}
      <BotonEnviar>Crear cuenta</BotonEnviar>
    </form>
  );
}
