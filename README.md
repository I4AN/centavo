# ¢entavo

**Cada centavo cuenta.** Finanzas personales en pesos colombianos: registra ingresos y gastos, define presupuestos por categoría y mira tu mes como lo que es — una suma de libro contable.

![Next.js](https://img.shields.io/badge/Next.js_15-App_Router-000?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql&logoColor=white)
![CI](https://github.com/i4an/centavo/actions/workflows/ci.yml/badge.svg)

<!-- TODO: agregar captura en docs/captura.png y descomentar -->
<!-- ![Resumen del mes en Centavo](docs/captura.png) -->

## Qué hace

- **Resumen mensual**: ingresos − gastos = balance, presentado como una suma contable con raya simple y doble raya. Gasto por categoría (dona) y ritmo diario de gasto.
- **Movimientos**: registro rápido de gastos e ingresos con categorías agrupadas (la taxonomía en español viene de la v1), nota opcional y navegación por mes.
- **Presupuestos**: tope mensual por categoría con barra de progreso, alerta al excederse y relación contra el salario del mes.
- **Multiusuario**: registro e inicio de sesión propios; cada usuario ve únicamente sus movimientos, presupuestos y salarios, y empieza de cero (sin datos de ejemplo).

## La historia: de MagnetWallet a Centavo

Este proyecto es la segunda vida de [MagnetWallet](https://github.com/i4an/MagnetWallet), mi primer gestor de gastos. La v1 me sirvió para aprender React; la v2 existe para hacerlo con la arquitectura que uso profesionalmente.

| | MagnetWallet (v1) | Centavo (v2) |
|---|---|---|
| Rendering | SPA con Vite | Next.js App Router, Server Components |
| Datos | Firestore (BaaS) | PostgreSQL + Prisma, esquema propio |
| Dinero | `number` en punto flotante | `Int` en **centavos de COP** |
| Mutaciones | SDK de Firebase en el cliente | Server Actions validadas con Zod |
| Agregaciones | En memoria, en el navegador | `groupBy` / `aggregate` en SQL |
| Auth | Firebase Auth obligatorio | Registro propio: scrypt + sesiones en Postgres |

## Decisiones de arquitectura

**El dinero se guarda en centavos.** Todo monto es un `Int` en centavos de COP; los floats no tocan el dinero en ninguna capa. La UI habla en pesos y la conversión ocurre en una sola frontera (`src/lib/dinero.ts`). De ahí el nombre del proyecto.

**Server Components + Server Actions, sin capa REST intermedia.** Las páginas consultan Prisma directamente en el servidor y las mutaciones pasan por acciones validadas con Zod. Para una app de este tamaño, una API REST propia sería ceremonia sin beneficio; el día que haga falta (app móvil, terceros), las consultas ya viven aisladas en `src/server/`.

**Las agregaciones son trabajo de la base de datos.** Totales del mes, gasto por categoría y presupuesto vs. gastado se resuelven con `aggregate` y `groupBy` de Prisma, no iterando arreglos en el cliente como en la v1.

**Autenticación propia, sin proveedor externo.** Registro e inicio de sesión con contraseña hasheada con scrypt (incluido en Node, sin dependencias extra) y sesiones opacas guardadas en Postgres, referenciadas por una cookie httpOnly. Para este dominio no hace falta OAuth ni un servicio de identidad: una tabla `Usuario`, una tabla `Sesion` y dos formularios. Toda consulta y mutación exige sesión activa y filtra por `usuarioId`.

**Lenguaje ubicuo en español.** El dominio es mío y pienso en español: `Movimiento`, `Presupuesto`, `SalarioMensual`. El código técnico (framework, librerías) queda en inglés; el dominio, en el idioma en que se razona.

## Arquitectura

```mermaid
flowchart LR
  U[Navegador] -->|GET| RSC["App Router · Server Components"]
  U -->|form action| SA["Server Actions + Zod"]
  RSC --> Q["src/server/consultas.ts"]
  SA --> Q2["src/server/acciones.ts"]
  Q --> P[("Prisma")]
  Q2 --> P
  P --> PG[("PostgreSQL · Neon")]
```

## Modelo de datos

```mermaid
erDiagram
  USUARIO ||--o{ SESION : abre
  USUARIO ||--o{ MOVIMIENTO : registra
  USUARIO ||--o{ PRESUPUESTO : define
  USUARIO ||--o{ SALARIO_MENSUAL : declara
  CATEGORIA ||--o{ MOVIMIENTO : clasifica
  CATEGORIA ||--o{ PRESUPUESTO : limita

  USUARIO {
    string id PK
    string correo UK
    string nombre
    string hashContrasena
  }
  SESION {
    string token PK
    string usuarioId FK
    datetime expiraEn
  }
  CATEGORIA {
    string id PK
    string nombre UK
    string grupo
    TipoMovimiento tipo
  }
  MOVIMIENTO {
    string id PK
    TipoMovimiento tipo
    int montoCentavos
    date fecha
    string nota
    string categoriaId FK
    string usuarioId FK
  }
  PRESUPUESTO {
    string id PK
    string mes
    int montoCentavos
    string categoriaId FK
    string usuarioId FK
  }
  SALARIO_MENSUAL {
    string usuarioId PK "FK"
    string mes PK
    int montoCentavos
  }
```

## Correrlo en local

Necesitas Node 20+ y una base Postgres (una gratis en [Neon](https://neon.tech), o local con Docker).

```bash
git clone https://github.com/i4an/centavo.git
cd centavo
npm install

# Postgres local con Docker (o pega tu cadena de Neon en .env).
# En una sola línea para que funcione igual en bash, PowerShell y CMD:
docker run -d --name centavo-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=centavo -p 5432:5432 postgres:16

cp .env.example .env
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/centavo"

npm run db:push   # crea el esquema
npm run db:seed   # solo la taxonomía de categorías; nada de datos de ejemplo
npm run dev
```

Abre http://localhost:3000, crea tu cuenta y empieza de cero: el primer movimiento lo registras tú.

## Deploy

Pensado para **Vercel + Neon**: importa el repo en Vercel, define `DATABASE_URL` y listo. El CI de GitHub Actions corre typecheck y build en cada push.

## Roadmap

- [x] Autenticación multiusuario y datos por usuario (registro propio, sesiones en Postgres)
- [ ] Edición de movimientos y presupuestos
- [ ] Exportar el mes a CSV
- [ ] Categorías personalizadas desde la UI
- [ ] Modo oscuro
- [ ] Tests: Vitest para `lib/` y Playwright para los flujos clave
- [ ] Tipografía propia vía `next/font` (Archivo + Spline Sans Mono)

## Licencia

[MIT](LICENSE)
