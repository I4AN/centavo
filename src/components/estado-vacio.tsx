import Link from "next/link";

export function EstadoVacio({
  titulo,
  detalle,
  accion,
}: {
  titulo: string;
  detalle: string;
  accion?: { href: string; etiqueta: string };
}) {
  return (
    <div className="tarjeta flex flex-col items-center gap-2 border-dashed px-6 py-10 text-center">
      <p className="font-semibold">{titulo}</p>
      <p className="max-w-sm text-sm text-tinta-suave">{detalle}</p>
      {accion && (
        <Link href={accion.href} className="boton mt-2">
          {accion.etiqueta}
        </Link>
      )}
    </div>
  );
}
